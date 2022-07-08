import React, { useState, useEffect } from "react";
import { Row, Col, Card, DatePicker, Select, Button, Form, Typography, Skeleton, Popconfirm, Tooltip, Space } from "antd";
import { TagTwoTone, CloseCircleOutlined, RedoOutlined } from "@ant-design/icons";
import orderSalesApi from '../../../api/order-sales';
import { useTranslation } from 'react-i18next';
import OrderSalesTabs from "./OrderSalesTabs";
import partnerApi from '../../../api/partner';
import { useForm } from "antd/lib/form/Form";
import { useSelector } from "react-redux";
import moment from 'moment';
import 'moment/locale/es';
import { openNotification } from "../../../components/Toastr";
import { sellerMarketplaces } from "../../../utils/const";

const { Item } = Form;
const { Option } = Select;
const { Text } = Typography;
const dateFormat = 'YYYY-MM-DD'

const DateNow = moment();

const antIcon = <RedoOutlined spin />;

const OrderSales = ({ profileCompleted, setModalVisible, modalVisible }) => {

  const { t } = useTranslation();
  const session = useSelector(store => store.Session.session);

  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [partners, setPartners] = useState([]);
  const [data, setData] = useState([]);
  const [syncStatus, setSyncStatus] = useState();
  const formDefault = {
    dateRange: [moment(moment().add(-30, 'days'), dateFormat), moment(DateNow, dateFormat)]
  }

  useEffect(() => {
    getAllPartners();
    getSyncStatus();
  }, [])

  const handleExport = async () => { }

  const SyncTooltip = () => {
    return (
      <Space direction="vertical" size="small">
        <span>Sincronización del histórico de ventas, los últimos 90 días desde la fecha actual.</span>
        {syncStatus && syncStatus.createdAt ? <span>
          {syncStatus.finished ? 'Última sincronizacion: ' + moment(syncStatus.finishedAt).fromNow() : 'Última sincronizacion iniciada: ' + moment(syncStatus.createdAt).fromNow()}
        </span> : null}
      </Space>);
  }


  useEffect(() => {
    getOrdersSales()
    if (!modalVisible?.state && data?.length > 0) {
      form.submit();
    }
  }, [modalVisible])

  const getAllPartners = async () => {
    setLoadingPartners(true);
    await partnerApi.findAllForAdmin()
      .then((response) => {
        setPartners(response?.data?.filter(partner => partner.commercial_partner_id && partner.commercial_partner_id[0]));
        setLoadingPartners(false);
      })
      .catch((error) => {
        setLoadingPartners(false);
      })
  }

  const getSyncStatus = async () => {
    const partnerId = !session?.userInfo?.isAdmin ? session?.userInfo?.commercial_partner_id[0] : form.getFieldsValue()?.partnerId || null;
    if (!partnerId) {
      return;
    }
    !loadingHistory && setLoadingHistory(true);
    try {
      const { data } = await orderSalesApi.getHistoricalSyncStatus(partnerId);
      setLoadingHistory(!data.finished);
      setSyncStatus(data);
      if (!data.finished) {
        setTimeout(() => {
          getSyncStatus();
        }, 60000); 
      }
    } catch (error) {
      setLoadingHistory(false);
    }
  }

  const cancelSyncOrders = async () => {
    const partnerId = !session?.userInfo?.isAdmin ? session?.userInfo?.commercial_partner_id[0] : form.getFieldsValue()?.partnerId || null;
    if (!partnerId) {
      session?.userInfo?.isAdmin && openNotification({ status: false, content: 'Seleccione un Partner del listado' });
      return;
    }

    setLoadingHistory(true);
    try {
      const { data } = await orderSalesApi.cancelSyncOrders(partnerId);
      setLoadingHistory(false);
      if (data?.success) {
        openNotification({ status: true, content: "Se canceló el proceso de sincronización" });
      } else {
        openNotification({ status: false, content: t('home.listing.error') });
      }
      getSyncStatus();
    } catch (error) {
      openNotification({ status: false, content: error?.response?.data?.message || t('home.listing.error') });
      setLoadingHistory(false);

    }
  }

  const getHistorical = async () => {
    const partnerId = !session?.userInfo?.isAdmin ? session?.userInfo?.commercial_partner_id[0] : form.getFieldsValue()?.partnerId || null;
    if (!partnerId) {
      session?.userInfo?.isAdmin && openNotification({ status: false, content: 'Seleccione un Partner del listado' });
      return;
    }
    setLoadingHistory(true);
    setSyncStatus({ finished: false });
    await orderSalesApi.getHistorical(partnerId)
      .then(async (response) => {
        if (response?.data?.success) {
          openNotification({ status: true, content: "El histórico de ventas está siendo sincronizado desde los marketplaces, en unos minutos estará disponibles" });
        } else {
          openNotification({ status: false, content: 'Error al obtener el histórico de ventas' });
        }

        await new Promise(resolve => setTimeout(resolve, 6000))
        getSyncStatus();
      })
      .catch((error) => {
        setSyncStatus({ finished: true });
        const message = error.response.data.message;
        openNotification({ status: false, content: message ? `${message}` : 'Error al obtener el histórico de ventas' });
      })
    setLoadingHistory(false);
  }

  const getOrdersSales = () => {
    form.submit();
  }

  const onFinish = (values) => {
    values.partnerId = !session?.userInfo?.isAdmin ? session?.userInfo?.commercial_partner_id[0] : values?.partnerId;
    setLoading(true);
    orderSalesApi.getByFilter(values).then((res) => {
      setData(res.data?.Orders);
      setLoading(false);
    }).catch((error) => {
      setLoading(false);
    })
  }


  return (
    <Row className="home-listing-main-row orders-status">
      <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
        <Card className="home-listing-card">
          <Row >
            <Col span={syncStatus && !syncStatus.finished ? 5 : 8} md={6} >
              <div className="home-listing-card-content">
                <Col>
                  <div className="home-listing-card-content">
                    <span className="home-listing-title" style={{ fontSize: '22px', marginTop: '10px' }} >
                      <TagTwoTone style={{ fontSize: '20px' }} className="btn-primary home-listing-title-icon" />
                      {t('home.sale-order.title')}
                    </span>
                    <span className="home-listing-title-description">
                      {t('home.sale-order.subTitle')}
                    </span>
                  </div>
                </Col>
              </div>
            </Col>
          </Row>
          <Form layout="vertical" form={form} onFinish={onFinish} initialValues={formDefault}>
            <Row justify="end" style={{ marginRight: 40 }}>
              <Col span={4} style={{ fontSize: '13px', marginRight: '10px' }}>
                <Row>
                  <Item name="dateRange" label={<Text strong={true}>Pick a date</Text>} rules={[{ required: true, message: `Fecha ${t('isRequired')}` }]}>
                    <DatePicker.RangePicker name="dateRange" defaultValue={[moment(DateNow, dateFormat), moment(moment().add(-30, 'days'), dateFormat)]} style={{ width: '100%' }} format={'YYYY-MM-DD'}
                      disabledDate={d => !d || d.isAfter(moment().add(1, 'days')) || d.isSameOrBefore(moment().add(-90, 'days'))}
                    />
                  </Item>
                </Row>
              </Col>
              <Col span={2} style={{ fontSize: '13px', marginRight: '10px' }}>
                <Row>
                  <Item name="fulfillmentType" style={{ width: '100%' }} label={<Text strong={true}>Fulfillment</Text>}>
                    <Select defaultValue={null} bordered={true} >
                      <Option value={null}> Todos </Option>
                      <Option value="FBA"> FBA </Option>
                      <Option value="MFN"> FBM / FBL</Option>
                    </Select>
                  </Item>
                </Row>
              </Col>
              <Col span={3} style={{ fontSize: '13px', marginRight: '10px' }}>
                <Row>
                  <Item name="marketplace" style={{ width: '100%' }} label={<Text strong={true}>Marketplace</Text>}>
                    <Select defaultValue={null} >
                      <Option value={null}>Todos</Option>
                      {Object.keys(sellerMarketplaces)?.map((mkp, index) => (
                        <Option key={index} value={sellerMarketplaces[mkp]}>{sellerMarketplaces[mkp]}</Option>
                      ))}
                    </Select>
                  </Item>
                </Row>
              </Col>
              {session?.userInfo?.isAdmin &&
                <Col span={3} style={{ fontSize: '13px', marginRight: '10px' }}>
                  <Row>
                    <Item name="partnerId" style={{ width: '100%' }} label={<Text strong={true}>Partner</Text>}
                      rules={[{ required: true, message: `Partner ${t('isRequired')}` }]}>
                      <Select defaultValue={'Seleccione partner'} bordered={true} loading={loadingPartners} allowClear
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} showSearch={true}>
                        {partners?.map((partner, index) => (
                          <Option value={partner.commercial_partner_id[0]} key={index}>{partner?.name}</Option>
                        ))}
                      </Select>
                    </Item>
                  </Row>
                </Col>
              }
              <Col className="text-align-right"
                span={3} xs={8} sm={8} md={4}
                style={{ fontSize: '10px', marginTop: '30px' }} >
                <Button className="btn-basic-green" style={{ marginRight: 10, minWidth: '38%' }}
                  onClick={getOrdersSales} >Buscar</Button>

                <Tooltip title={<SyncTooltip />}>
                  <Button loading={loadingHistory} className="btn-primary" style={{ minWidth: '55%' }}
                    icon={loadingHistory ? null : <RedoOutlined />}
                    onClick={getHistorical} >Histórico</Button>
                </Tooltip>
                {/* 
                <Button
                  icon={<ExportOutlined />}
                  className="btn-primary"
                  disabled={!profileCompleted}
                  onClick={handleExport} >
                  {t('home.listing.export')}
                </Button>
                */}
              </Col>
              {syncStatus && !syncStatus.finished &&

                <Col span={3} xs={8} sm={8} md={4}
                  style={{ fontSize: '10px', marginTop: '30px' }} >
                  <Popconfirm placement="top" title={'¿Está seguro de cancelar el proceso de sincronización?'} onConfirm={cancelSyncOrders} okText="Sí" cancelText="No">
                    <Button
                      icon={<CloseCircleOutlined />}
                      danger
                      className="margin-left-10"
                    >
                      Cancelar sincronización
                    </Button>

                  </Popconfirm>
                </Col>

              }

            </Row>
          </Form>
          <Row className="home-listing-table-parent">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              {loading ?
                <div className="generic-spinner">
                  <Skeleton active />
                </div>
                :
                <OrderSalesTabs orderSales={data.map((item, index) => ({ ...item, key: index }))} setModalVisible={setModalVisible} />
              }
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>)
};

export default React.memo(OrderSales);
