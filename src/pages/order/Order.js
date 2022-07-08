import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Row, Select, Col, Button, Card, Input, AutoComplete, Spin, Pagination, Space, PageHeader } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { FileTextFilled, LeftOutlined, UnorderedListOutlined, ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './order.css';
import { TableOrder } from './components/TableOrder';
import Layout, { Content } from 'antd/lib/layout/layout';
import { openNotification } from '../../components/Toastr';
import { getErrorMessage } from '../../api/api';
import { useSelector } from 'react-redux';
import orderApi from '../../api/order';
import { MassiveActionsModal } from './components/MassiveActionsModal';
import { saveAs } from 'file-saver';

export const Order = () => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState(null);
    const [query, setQuery] = useState({field:'amazonId'});

    const [filterOptionSelected, setFilterOptionSelected] = useState(null);
    const [options, setOptions] = useState(null);
    const [loadingCreateOrder, setLoadingCreateOrder] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [orders, setOrders] = useState({});
    const [meta, setMeta] = useState({});
    const [loadingExportable, setLoadingExportable] = useState(false);

    const history = useHistory();

    const session = useSelector(store => store.Session.session);

    useEffect(() => {
        let opts = [
            {
                value: 'amazonId',
                results: 0,
                label: `Buscar en ${t('orders.newOrder.table.filterOptions.shipping_id')}`,
            },
            {
                value: 'lapId',
                results: 0,
                label: `Buscar en ${t('orders.newOrder.table.filterOptions.order_id')}`,
            },
            
        ];
        if(session?.userInfo?.isAdmin){
            opts.push({
                value: 'account',
                results: 0,
                label: `Buscar en ${t('orders.newOrder.table.filterOptions.account')}`,
            });
        }
        
        setOptions(opts);
        getOrders();
    }, [session])

    const getOrders = async () => {
        setLoadingOrders(true);
        const values = {
            partnerId: session.userInfo.isAdmin ? null : session.userInfo.commercial_partner_id[0],
            page: meta?.page ? meta.page : 1,
            take: 50,
            field: query?.field,
            query: query?.query
        }
        await orderApi.getOrdersPerPage(values)
            .then((response) => {
                setOrders(response.data.data);
                setMeta(response.data.meta)
            })
            .catch((error) => {
                setOrders([]);
                openNotification({ status: false, content: getErrorMessage(error) });
            });

        setLoadingOrders(false);
    };

    const onChangePage = async (page) => {

        if (session) {
            setLoadingOrders(true);
            const values = {
                partnerId: session.userInfo.isAdmin ? null : session.userInfo.partner_id[0],
                page: page,
                take: 50
            }
            await orderApi.getOrdersPerPage(values)
                .then((response) => {
                    setOrders(response.data.data);
                    setMeta(response.data.meta)
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
            setLoadingOrders(false);
        }
    }

    useEffect(()=>{
        setMeta({});
        if(!query || query.field && query.query){
            getOrders();
        }        
    }, [query]);

    const onSelect = (value) => {
        setQuery({ query: filter, field: value });
    };

    const handleNewOrder = async () => {
        setLoadingCreateOrder(true);
        await orderApi.create()
            .then((res) => {
                const orderId = res.data;
                setLoadingCreateOrder(false);
                history.push(`orders/${orderId}`);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
                setLoadingCreateOrder(false);
            });
    }

    const handleExport = async () => {
        const account = selectedOrders[0].clientId;
        const tipoEnvio = selectedOrders[0].shippingType;

        let seguir = true;
        const skuArray = [];
        selectedOrders.forEach((row) => {
            if (seguir) {
                if (account !== row.clientId) {
                    openNotification({ status: false, content: "ERROR. Estas eligiendo ordenes de diferentes cuentas, y eso no es posible." });
                    seguir = false;
                }
            }
        })
        if (!seguir) return;
        setLoadingExportable(true);
        try {
            let orders = selectedOrders.map((o) => { return o.id });
            const { data } = await orderApi.getExcelReport(orders);
            const filename = `orders: ${new Date()}.xlsx`;
            let blob = new Blob([data], { type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            saveAs(blob, filename);
        } catch (error) {
            console.log('onClickExportHandler#Orders', error);
        } finally {
            setLoadingExportable(false);
        }
    };

    const selectBefore = (
        <Select onChange={onSelect} defaultValue="amazonId" className="select-before" options={options}>
        </Select>
      );

    return !loadingCreateOrder ? (
        <PageHeader title={' '} onBack={() => { history.push("/") }}>
        <div className="content-div">
            {loadingExportable &&
                <Row justify="center" align="middle" >
                    <Col>
                        <Spin size="large" />
                    </Col>
                </Row>}
            <Row>
              <Col span={10} md={12} >
                <div className="home-listing-card-content">
                  <Col>
                    <div className="home-listing-card-content">
                      <div style={{ textAlign: 'left' }}>
                      <span className="home-listing-title" style={{ fontSize: '22px', marginTop: '10px' }} >
                        <UnorderedListOutlined className="btn-primary home-listing-title-icon" />
                        <span style={{ marginLeft: 10 }}>{t('orders.section1')}</span>
                      </span>
                      </div>
                      <span className="home-listing-title-description">
                        {t('orders.subtitle')}
                      </span>
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>             
            <Row>
                <Layout className="padding-layout">
                    <Content className="site-layout-background padding-layout-content content-padding">
                        <Spin spinning={loadingCreateOrder}>
                            <Row className="home-listing-main-row">
                                <Col span={24} xs={24} sm={24} md={24}>
                                    <Card className="home-listing-card">
                                        <Row>
                                            <Col xs={24} sm={8} md={8}>
                                                <div className="home-listing-card-content">
                                                    <span className="home-listing-title">{t('orders.newOrder.table.title')}</span>
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={6} md={8}>
                                                <Row>
                                                    <Col span={24}>
                                                        <Input 
                                                            onPressEnter={()=>{setQuery({...query, query:filter})}}
                                                            allowClear={true} onChange={(e)=>{
                                                            if(!e.target.value){
                                                                setQuery(undefined);
                                                            }
                                                            setFilter(e.target.value);
                                                        }} addonBefore={selectBefore} suffix={<SearchOutlined onClick={()=>{setQuery({...query, query:filter})}} />} placeholder={t('orders.newOrder.table.search')} enterButton />
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xs={24} sm={session.userInfo.role === 'Admin' ? 8 : 16} md={session.userInfo.role === 'Admin' ? 8 : 16} style={{ textAlign: 'right' }}>
                                                {session.userInfo.isAdmin && <Space>
                                                    <Button
                                                        icon={<ExportOutlined />}
                                                        type={"default"}
                                                        disabled={selectedOrders.length === 0}
                                                        onClick={handleExport}
                                                    >
                                                        Exportar
                                                    </Button>
                                                    <Button icon={<ExportOutlined />} type="default"
                                                        onClick={() => setModalVisible(true)} disabled={selectedOrders.length === 0}>
                                                        {t('orders.newOrder.table.buttonModal')}
                                                    </Button>
                                                    <Button icon={<PlusOutlined />}
                                                        type="primary" loading={loadingCreateOrder} onClick={handleNewOrder} >{t('orders.newOrder.table.buttonNewOrder')}
                                                    </Button>
                                                </Space>}
                                            </Col>

                                        </Row>
                                        <Row className="home-listing-table-parent">
                                            <Col xs={24} sm={24} md={24}>
                                                {loadingExportable &&
                                                    <Row justify="center" align="middle" >
                                                        <Col>
                                                            <Spin size="large" />
                                                        </Col>
                                                    </Row>}
                                                <TableOrder
                                                    filter={filter} options={options} setOptions={setOptions}
                                                    filterOptionSelected={filterOptionSelected} setSelectedOrders={setSelectedOrders}
                                                    loadingOrders={loadingOrders} orders={orders} setOrders={setOrders} getOrders={getOrders}
                                                />
                                                {!loadingOrders ?
                                                    <Pagination style={{ textAlign: 'right', marginTop: 24, marginRight: 12 }}
                                                        defaultCurrent={meta.page}
                                                        total={meta.itemCount}
                                                        pageSize={50}
                                                        showQuickJumper
                                                        showSizeChanger={false}
                                                        onChange={(page) => onChangePage(page)}
                                                    /> : null
                                                }
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Spin>
                    </Content>
                </Layout>
            </Row>
            <MassiveActionsModal visible={modalVisible} setVisible={setModalVisible} selectedOrders={selectedOrders} getOrders={getOrders} />
        </div >
        </PageHeader>
    ) : (
        <Row justify="center" align="middle" >
            <Col>
                <Spin size="large" />
            </Col>
        </Row>
    )
}