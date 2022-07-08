import React, { useRef, useState } from 'react';
import { Button, Table, Avatar, Tooltip, Image, Checkbox, Typography, Row, Col, Spin, Popconfirm } from 'antd';
import { DownOutlined, FolderOpenOutlined, PictureOutlined, UpOutlined, LoadingOutlined, PlusOutlined, RedoOutlined, WarningOutlined } from '@ant-design/icons';
import DocumentsCRUD from '../../client-important-info/DocumentsCRUD';
import { TableListing } from './TableListing';
import { getSvgMarketPlace, nameToSlug } from '../../../utils/functions';
import partnerAPI from '../../../api/partner';
import { openNotification } from '../../../components/Toastr';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import partnerApi from "../../../api/partner";
import listingApi from "../../../api/listing";
import { useHistory } from 'react-router-dom';
import { getErrorMessage } from '../../../api/api';
import { sellerMarketplaces } from '../../../utils/const';

const { Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

export const TableClients = ({ data, getAllPartners }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const session = useSelector(store => store.Session.session);

    const checkBoxCanPublish = useRef();
    const checkBoxAutofulfillmentFBA = useRef();
    const [visible, setVisible] = useState(false);
    const [documentPartner, setDocumentPartner] = useState();
    const [loadingSyncStock, setLoadingSyncStock] = useState(false);
    const [loadingUnlinkMatchesFBA, setLoadingUnlinkMatchesFBA] = useState(false);
    const [loadingCreateListing, setLoadingCreateListing] = useState(false);
    const [loadingCanPublish, setLoadingCanPublish] = useState({ loading: false, index: null });
    const [loadingCanAutofulfillmentFBA, setLoadingCanAutofulfillmentFBA] = useState({ loading: false, index: null, marketplace: null });
    const [loadingGetListingsFromMarketplaces, setLoadingGetListingsFromMarketplaces] = useState({ loading: false, index: null });
    const [getListings, setGetListings] = useState(false);

    const handleCanPublish = async (partner, index) => {
        let payload = { partnerId: partner.commercial_partner_id[0], canPublish: checkBoxCanPublish?.current?.state?.checked }
        setLoadingCanPublish({ loading: true, index: index });
        await partnerAPI.updateCanPublish(payload)
            .then((response) => {
                if (response.data.success) {
                    openNotification({ status: true, content: t('home.listing.successfulPermissions') });
                } else {
                    checkBoxCanPublish.current.state.checked = !payload.canPublish;
                    openNotification({ status: false, content: t('home.listing.unsuccessfulPermissions') });
                }
            })
            .catch((error) => {
                checkBoxCanPublish.current.state.checked = !payload.canPublish;
                openNotification({ status: false, content: t('home.listing.unsuccessfulPermissions') });
            });
        setLoadingCanPublish({ loading: false, index: null });
    }

    const handleCanAutoFulfillmentOutboundFBA = async (partner, index, marketplace) => {
        let payload = { partnerId: partner.commercial_partner_id[0], canAutofulfillmentFBA: checkBoxAutofulfillmentFBA?.current?.state?.checked, marketplace: marketplace };
        setLoadingCanAutofulfillmentFBA({ loading: true, index: index, marketplace: marketplace });
        await partnerAPI.updateHasAutofulfillmentOutboundFBA(payload)
            .then((response) => {
                if (response.data.success) {
                    openNotification({ status: true, content: t('home.listing.successfulPermissions') });
                } else {
                    checkBoxAutofulfillmentFBA.current.state.checked = false;
                    openNotification({ status: false, content: t('home.listing.unsuccessfulPermissions') });
                }
            })
            .catch((error) => {
                checkBoxAutofulfillmentFBA.current.state.checked = false;
                openNotification({ status: false, content: t('home.listing.unsuccessfulPermissions') });
            });
        setLoadingCanAutofulfillmentFBA({ loading: false, index: null, marketplace: null });
    }

    const handleNewListing = async (partner) => {
        setLoadingCreateListing(true);
        await partnerApi
            .insertListing(partner?.id)
            .then((res) => {
                const listingId = res.data;
                setLoadingCreateListing(false);
                history.push(`onboarding/${listingId}`);
            })
            .catch((error) => {
                setLoadingCreateListing(false);
                openNotification({
                    status: false,
                    content: "Error al crear un nuevo listing",
                });
            });
    };

    const syncFbaStockByPartner = async (partner, index) => {
        const values = { partnerId: partner?.id }
        setLoadingSyncStock({ loading: true, index: index });
        await listingApi.syncFbaStock(values)
            .then((result) => {
                openNotification({ status: true, content: 'Sincronización de stock con FBA de manera exitosa' });
                setGetListings(true);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingSyncStock({ loading: false, index: null });
    }

    const unlinkMatchesFBAByPartner = async (partner, index) => {
        const values = { commercial_partner_id: partner?.userInfo?.commercial_partner_id[0] };
        setLoadingUnlinkMatchesFBA(true);
        await listingApi.unlinkMatchesFBA(values)
            .then((result) => {
                openNotification({ status: true, content: 'Se desvincularon los productos matcheados para FBA' });
                setGetListings(true);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingUnlinkMatchesFBA(false);
    }

    const getListingsFromMarkteplaces = async (partner, index) => {
        try {
            setLoadingGetListingsFromMarketplaces({ loading: true, index: index });
            const { data } = await listingApi.getAllFromMkts(partner?.commercial_partner_id[0]);
            setGetListings(true);
            openNotification({ status: true, content: "Listings obtenidos desde los marketplaces con éxito" });
            setLoadingGetListingsFromMarketplaces({ loading: false, index: null });
        } catch (error) {
            openNotification({ status: false, content: error?.response?.data?.message || t('home.listing.error') });
            setLoadingGetListingsFromMarketplaces({ loading: false, index: null });
        }
    }

    const columns = [
        // {
        //     title: "",
        //     key: 'action',
        //     width: '5%'
        // },
        {
            title: "IMAGE",
            dataIndex: "image",
            key: "image",
            width: '7%',
            render: (text, record) => (
                <>
                    {record.image_1920 ? <Avatar src={<Image src={`data:image/png;base64, ${record.image_1920}`} />} /> : <Avatar icon={<PictureOutlined />} />}
                </>
            ),
        },
        {
            title: "NAME",
            dataIndex: "name",
            key: "name",
            width: '13%',
            render: (text, record) => (
                <Text style={{ width: 150 }} ellipsis={{ tooltip: record.name }}>{record.name}</Text>
            )
        },
        {
            title: "PERMISOS",
            dataIndex: "can_publish",
            key: "can_publish",
            width: '20%',
            render: (text, record, index) => (
                <Row>
                    <Col>
                        <Popconfirm
                            title={t('home.listing.confirmUpdateCanPublish')}
                            onConfirm={(e) => handleCanPublish(record, index)}
                            onCancel={() => { checkBoxCanPublish.current.state.checked = record?.x_can_publish }}
                            icon={<WarningOutlined />}
                            okText={t('yes')}
                            cancelText={t('no')}
                            okButtonProps={{ style: { backgroundColor: '#5365E3' } }}>
                            <Tooltip placement="top" title={t('home.listing.tooltipCanPublish')}>
                                <Checkbox
                                    id={'can_publish'}
                                    name={'can_publish'}
                                    ref={checkBoxCanPublish} defaultChecked={record?.x_can_publish}>
                                    {loadingCanPublish.loading && loadingCanPublish.index === index ?
                                        antIcon : <></>} Sync partner
                                </Checkbox>
                            </Tooltip>
                        </Popconfirm>
                    </Col>
                    {record?.hasAutofulfillmentOutboundFBA?.filter(mkp => !mkp.marketplace.includes(sellerMarketplaces.AMAZON))?.map(mkp => (
                        <Col>
                            <Popconfirm
                                title={t('home.listing.confirmUpdateCanPublish')}
                                onConfirm={(e) => handleCanAutoFulfillmentOutboundFBA(record, index, mkp?.marketplace)}
                                onCancel={() => { checkBoxAutofulfillmentFBA.current.state.checked = mkp?.value }}
                                icon={<WarningOutlined />}
                                okText={t('yes')}
                                cancelText={t('no')}
                                okButtonProps={{ style: { backgroundColor: '#5365E3' } }}>
                                <Tooltip placement="bottom" title={t('home.listing.tooltipCanAutofulfillmentFBA')}>
                                    <Checkbox
                                        id={'auto_fulfillment_FBA'}
                                        name={'auto_fulfillment_FBA'}
                                        ref={checkBoxAutofulfillmentFBA} defaultChecked={mkp?.value}>
                                        {loadingCanAutofulfillmentFBA.loading
                                            && loadingCanAutofulfillmentFBA.index === index
                                            && loadingCanAutofulfillmentFBA.marketplace === mkp?.marketplace ?
                                            antIcon : <></>} Fulfillment Outbound ({mkp?.marketplace})
                                    </Checkbox>
                                </Tooltip>
                            </Popconfirm>
                        </Col>
                    ))}
                </Row>
            )
        },
        {
            title: "LISTINGS",
            dataIndex: "listings",
            key: "listings",
            width: '7%',
            render: (text, record) => <span>{record?.listings}</span>
        },
        {
            title: "ACTIVE",
            dataIndex: "active",
            key: "active",
            width: '6%',
            render: (text, record) => (
                <>
                    <span>{record?.activeListings}</span>
                </>
            )
        },
        {
            title: "MARKETPLACES",
            dataIndex: "mktplace",
            key: "mktplace",
            width: '17%',
            render: (text, record) => (
                <div style={{ display: 'flex' }}>
                    {record?.marketplaces?.map((marketplace) => {
                        return <div style={{ marginRight: '10px' }}>{getSvgMarketPlace(marketplace, false)}</div>
                    })}
                </div>
            )
        },
        {
            title: "DOCUMENTOS",
            dataIndex: "documents",
            key: "documents",
            width: '8%',
            render: (text, record) => (
                <>
                    <Tooltip placement="topLeft" title="Ver documentos y videos">
                        <Button onClick={() => { setDocumentPartner(record.id); setVisible(true); }} icon={<FolderOpenOutlined />} className="home-clients-table-open-documents-button" type="text">Abrir</Button>
                    </Tooltip>
                </>
            ),
        },
        {
            title: "ACCIONES",
            dataIndex: "-",
            key: "-",
            width: 550,
            render: (text, record, index) => (
                <Row>
                    <Col >
                        <Button size="small"
                            icon={<PlusOutlined />}
                            className={record?.marketplaces?.length > 0 ? "btn-primary " : ""}
                            disabled={!record.x_can_publish}
                            onClick={() => handleNewListing(record)}
                        >
                            {t('home.listing.add')}
                        </Button>
                    </Col>
                    <Col >
                        <Tooltip placement="top" title={t('home.listing.tooltipSyncListings')}>
                            <Button size="small"
                                icon={loadingGetListingsFromMarketplaces.loading && loadingGetListingsFromMarketplaces.index === index ?
                                    <Spin indicator={antIcon} /> : <RedoOutlined />}
                                className="btn-primary margin-left-10"
                                onClick={() => getListingsFromMarkteplaces(record, index)}
                                disabled={!record?.marketplaces?.length > 0 || !record.x_can_publish}
                            >
                                {' '}{t('home.listing.syncListings')}
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col >
                        <Tooltip placement="top" title={t('home.listing.tooltipSyncStockFBA')}>
                            <Button size="small"
                                icon={loadingSyncStock.loading && loadingSyncStock.index === index ? <Spin indicator={antIcon} /> : <RedoOutlined />}
                                className="btn-primary margin-left-10"
                                disabled={!record?.marketplaces?.length > 0 || !record.x_can_publish}
                                onClick={() => syncFbaStockByPartner(record, index)}
                            >
                                {' '}{t('home.listing.syncStockFBA')}
                            </Button>
                        </Tooltip>
                    </Col>
                    <Col >
                        <Tooltip placement="top" title={t('home.listing.tooltipUnlinkMatchesFBA')}>
                            <Button size="small"
                                icon={loadingUnlinkMatchesFBA?.loading && loadingUnlinkMatchesFBA?.index === index ? <Spin indicator={antIcon} /> : <RedoOutlined />}
                                className="btn-primary margin-left-10"
                                disabled={!record?.marketplaces?.length > 0 || !record.x_can_publish}
                                onClick={() => unlinkMatchesFBAByPartner(record, index)}
                            >
                                {' '}{t('home.listing.unlinkMatchesFBA')}
                            </Button>
                        </Tooltip>
                    </Col>
                </Row>
            ),
        },
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const expandedRoww = (record, index) => {
        return <div style={{ marginLeft: '20px' }}>
            <TableListing
                profileCompleted={null}
                partnerId={record.id}
                selectable={false}
                getListings={getListings}
                setGetListings={setGetListings}
                paginationPosition={['bottomRight']}
            />
        </div>
    }

    return (
        <>
            <DocumentsCRUD visible={visible} setVisible={setVisible} partner={documentPartner} />
            <div className="App">
                <Table columns={columns} dataSource={data.map((item, index) => ({ ...item, key: nameToSlug(item?.display_name) }))}
                    //  rowSelection={rowSelection} 
                    scroll={{ x: 1700, y: 600 }}
                    expandable={{
                        expandIcon: ({ expanded, onExpand, record }) =>
                            expanded ? (
                                <UpOutlined onClick={e => onExpand(record, e)} />
                            ) : (
                                <DownOutlined onClick={e => onExpand(record, e)} />
                            ),
                        columnWidth: 50
                    }}
                    expandedRowRender={(record, index) => expandedRoww(record, index)}
                />
            </div>
        </>
    )
}
