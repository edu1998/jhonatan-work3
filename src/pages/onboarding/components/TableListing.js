import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Tooltip, Spin, Input, Space, Image, Row, Col, Skeleton, Avatar, Typography, Popconfirm, Radio } from 'antd';
import {
    EditOutlined, CheckCircleFilled, CheckCircleOutlined, SearchOutlined,
    SyncOutlined, CaretUpOutlined, CaretDownOutlined, PictureOutlined,
    UnorderedListOutlined, MinusOutlined, ExpandAltOutlined, RedoOutlined,
    WarningOutlined, CloseOutlined, AppstoreAddOutlined, LinkOutlined
} from '@ant-design/icons';
import { CustomTableEmptyText } from './CustomTableEmptyText';
import { openNotification } from '../../../components/Toastr';
import { useTranslation } from 'react-i18next';
import { getSvgMarketPlace } from '../../../utils/functions';
import partnerAPI from '../../../api/partner';
import listingAPI from '../../../api/listing'
import { getErrorMessage } from '../../../api/api';
// import { TableExpandedRow } from './TableExpandedRow';
import SvgAirplane from '../../../utils/icons/SvgAirplane';
import SvgCircleWarning from '../../../utils/icons/SvgCircleWarning';
import { ListingStateEnum, sellerMarketplaces } from '../../../utils/const';
import { useHistory } from 'react-router-dom';
import { listingStates } from '../../../utils/const';
import { AttributesModal } from './AttributesModal';
import { FBMModal } from './FBMModal';
import { FBAMatchingModal } from './FBAMatchingModal';
import "antd/dist/antd.css";

const { Text, Link } = Typography;
const antIcon = <RedoOutlined spin />;

export const TableListing = ({ paginationPosition, profileCompleted, partnerId, selectable, getListings, setGetListings }) => {

    const { t } = useTranslation();

    const [tableSelectedRows, setTableSelectedRows] = useState([]);
    const [tableSelectedRowsKeys, setTableSelectedRowsKeys] = useState([]);
    const [clientListings, setClientListings] = useState([]);
    const [clientProducts, setClientProducts] = useState([]);
    const [meta, setMeta] = useState({});
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [loadingSyncStock, setLoadingSyncStock] = useState({ loading: false, listingIndex: null });
    const [loadingDeleteListing, setLoadingDeleteListing] = useState({ loading: false, listingIndex: null });
    const [viewMode, setViewMode] = useState('onlyListings');
    const [visible, setVisible] = useState({ value: false, data: {}, title: null });
    const [fbmModal, setFbmModal] = useState({ value: false, data: {}, title: null });
    const [productMatchingModalFBA, setProductMatchingModalFBA] = useState({ value: false, data: {}, title: null });
    const [query, setQuery] = useState();
    const history = useHistory();
    const searchInput = useRef();
    const session = useSelector(store => store.Session.session);

    useEffect(async () => {
        if (session) {
            getListingsPerPageInit();
            getAllProducts();
        }
    }, []);

    useEffect(async () => {
        getListingsPerPageInit();
    }, [query]);

    useEffect(() => {
        if (getListings) {
            getListingsPerPageInit();
            getAllProducts();
        }
    }, [getListings])

    const getListingsPerPageInit = async () => {
        const values = {
            partnerId: partnerId,
            query: query,
            page: meta?.page ? meta.page : 1,
            take: 50
        }
        setLoadingAPI(true);
        await partnerAPI.getListingsPerPage(values)
            .then((result) => {
                setClientListings(result.data.data?.map((listing, index) => {
                    return {
                        ...listing,
                        fulfillmentType: listing?.products?.find(p => p.fulfillmentType === 'FBA') ? 'FBA' : 'FBM'
                    }
                }));
                setMeta(result.data.meta);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingAPI(false);
    }

    const getAllProducts = async () => {
        await partnerAPI.getAllProductsByPartner(partnerId)
            .then((result) => {
                setClientProducts(result.data);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    }

    const syncFbaStockByListing = async (listingIndex) => {
        let products = clientListings[listingIndex]?.products?.filter(prd => prd.fulfillmentType === 'FBA')?.map(item => item.defaultCode);
        let skus = [];
        for (const prd of products) {
            if (!skus?.find(sku => sku === prd)) {
                skus.push(prd);
            }
        }
        const values = {
            partnerId: partnerId,
            skus: skus,
        }
        setLoadingSyncStock({ loading: true, listingIndex: listingIndex });
        await listingAPI.syncFbaStock(values)
            .then((result) => {
                openNotification({ status: true, content: 'Sincronización de stock con FBA de manera exitosa' });
                getListingsPerPageInit();
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingSyncStock({ loading: false, listingIndex: null });
    }

    const onChangePage = async (page) => {
        if (session) {
            const values = {
                partnerId: partnerId,
                query: query,
                page: page ? page : 1,
                take: 50
            }
            setLoadingAPI(true);
            await partnerAPI.getListingsPerPage(values)
                .then((result) => {
                    setClientListings(result.data.data);
                    setMeta(result.data.meta)
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
            setLoadingAPI(false);
        }
    }

    // const expandedRow = (record) => {
    //     return <TableExpandedRow
    //         dataSource={record.subData?.map((item, index) => ({ ...item, key: index }))}
    //         rowSelection={rowSelection}
    //         checkStrictly={checkStrictly}
    //         session={session}
    //     />
    // }

    const onClickCancel = async (listingId, index) => {
        if (!listingId) { return; }
        setLoadingDeleteListing({ loading: true, listingIndex: index });
        await partnerAPI.deleteListing(partnerId, listingId)
            .then((response) => {
                getListingsPerPageInit();
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingDeleteListing({ loading: false, listingIndex: index });
    }

    const hanldeButtonEdit = (record) => {
        history.push(`onboarding/${record.id}`);
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        },
        onSelect: (record, selected, selectedRows) => {
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
        },
    };

    const setStateListing = (record) => {
        let option = '';
        let icon;
        switch (record) {

            case ListingStateEnum.PENDING:
                option = 'Draft';
                icon = <EditOutlined />;
                break;
            case ListingStateEnum.PENDING_CLIENT:
                option = 'Pending Client Response';
                icon = <SyncOutlined className="primary" />;
                break;
            case ListingStateEnum.PENDING_LAP:
                option = 'Pending Lap Response';
                icon = <SyncOutlined className="primary" />;
                break;
            case ListingStateEnum.PENDING_ACKNOWLEDGE:
                option = 'Pending Acceptance';
                icon = <SyncOutlined className="primary" />;
                break;
            case ListingStateEnum.COMPLETED:
                option = 'Sent';
                icon = <CheckCircleOutlined className=" primary" />;
                break;
            case ListingStateEnum.SHIPPING:
                option = 'Shipping';
                icon = <SvgAirplane height={17} width={17} />;
                break;
            case ListingStateEnum.COMPLETED:
                option = 'Arrived ok';
                icon = <CheckCircleFilled className=" green" />;
                break;
            case ListingStateEnum.COMPLETED:
                option = 'Arrived error';
                icon = <SvgCircleWarning height={17} width={17} fill={"#D4485E"} strokeWarning={"#FFFF"} />;
                break;
            case ListingStateEnum.PUBLISHED:
                option = 'Published';
                icon = <CheckCircleOutlined className=" primary" />;
                break;
            case ListingStateEnum.SENT:
                option = 'Sent';
                icon = <CheckCircleOutlined className=" primary" />;
                break;
            default:
                break;
        }
        return <Row style={{ minWidth: '200px' }}>
            <Col>
                {icon}
            </Col>
            <Col style={{ marginLeft: '10px' }}>
                {option}
            </Col>
        </Row>;
    }

    const columns2 = [
        {
            ellipsis: true,
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={searchInput}
                        placeholder={`Buscar`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => setQuery(selectedKeys[0])}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Row justify="end">
                        <Col>
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => setQuery(selectedKeys)}
                                    icon={<SearchOutlined />}
                                    size="small"
                                    style={{ width: 90 }}
                                >
                                    Buscar
                                </Button>
                                <Button onClick={() => setQuery(undefined)} size="small" style={{ width: 90 }}>
                                    Limpiar
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => searchInput.current.select(), 100);
                }
            },
            title: t('home.listing.title'),
            dataIndex: 'title',
            key: 'title',
            width: 250,
            render: (value, record) => {
                return <Col>
                    <Row>
                        <Tooltip placement="topLeft" title={record.name}> <span> {record.name ? record.name : "Sin título"}</span></Tooltip>
                    </Row>
                    <Row>
                        <span style={{ color: 'gray' }}> {`Fecha de creacion: ${record.createdAt}`}</span>
                    </Row>
                </Col>
            }
        },
        {
            ellipsis: false,
            title: t('home.listing.category'),
            dataIndex: 'category',
            key: 'category',
            width: 250,
            render: (value, record) => (<Text>{value || 'n/a'}</Text>)
        },
        {
            ellipsis: false,
            title: t('home.listing.salesChannels'),
            dataIndex: 'marketplaces',
            key: 'marketplaces',
            width: 360,
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <>
                    {record?.marketplaceListings?.map((marketplace, index) => {
                        return <a style={{ marginRight: 7 }} target="blank" key={index}>
                            {getSvgMarketPlace(marketplace.marketplace, true)}
                        </a>
                    })}
                </>
                obj.children = component;
                return obj;
            }
        },
        {
            ellipsis: false,
            title: t('home.listing.state'),
            dataIndex: 'state',
            key: 'state',
            width: 250,
            render: (text, record) => (setStateListing(record.state))
        },
        {
            ellipsis: false,
            title: t('home.listing.actions'),
            key: 'action',
            width: session.userInfo.isAdmin ? 360 : 260,
            render: (text, record, index) => (
                <Row>
                    <Col md={session.userInfo.isAdmin ? 5 : 10}>
                        <Tooltip placement="topLeft" title={t('home.listing.edit')}>
                            <Button type="text" height="15" width="15"
                                icon={<EditOutlined style={{ fontSize: '15px' }} />}
                                onClick={(e) => { hanldeButtonEdit(record) }} >Editar</Button>
                        </Tooltip>
                    </Col>
                    {session.userInfo.isAdmin ?
                        <>
                            <Col md={1} />
                            <Col md={5}>
                                <Popconfirm
                                    title={t('onboarding.confirmDelete')}
                                    onConfirm={() => onClickCancel(record?.id, index)}
                                    onCancel={() => { }}
                                    icon={<WarningOutlined />}
                                    okText={t('yes')}
                                    cancelText={t('no')}
                                    okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                >
                                    <Button loading={loadingDeleteListing.loading && loadingDeleteListing.listingIndex === index}
                                        type="text" icon={<CloseOutlined />} >{t('onboarding.alertButtonClose')}</Button>
                                </Popconfirm>
                            </Col>
                        </> : <></>
                    }
                    <Col md={session.userInfo.isAdmin ? 1 : 3} />
                    <Col md={7}>
                        {record?.marketplaceListings?.find(mkt => mkt.marketplace.includes(sellerMarketplaces.AMAZON)) &&
                            record?.products?.find(product => product.fulfillmentType === "FBA") &&
                            <>
                                <Tooltip placement="topLeft" title={`Sincronizar los productos que tienen inventario en FBA, para el listing: ${record?.name}.`}>
                                    <Button type="text" height="15" width="15"
                                        icon={loadingSyncStock?.listingIndex === index && loadingSyncStock?.loading ? <Spin indicator={antIcon} /> : <RedoOutlined />}
                                        onClick={() => syncFbaStockByListing(index)}
                                    >FBA stock</Button>
                                </Tooltip>
                            </>
                        }
                    </Col>
                </Row>
            ),
        },
    ];

    const getLinkToStore = {
        "Amazon": (item) => {
            return item?.asin ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.amazon.com/dp/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Amazon Mexico": (item) => {
            return item?.asin ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.amazon.mx/dp/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Amazon Canada": (item) => {
            return item?.asin ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.amazon.ca/dp/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Amazon Brazil": (item) => {
            return item?.asin ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.amazon.br/dp/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Ebay": (item) => {
            return item?.asin && item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.com/itm/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Ebay Canada": (item) => {
            return item?.asin && item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.ca/itm/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Ebay Spain": (item) => {
            return item?.asin && item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.es/itm/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Ebay Germany": (item) => {
            return item?.asin && item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.de/itm/${item.asin}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Walmart": (item) => {
            return item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.walmart.com/ip/${item.externalId}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Shopify": (item) => {
            return <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
    }

    const columnsNoHeader = [
        {
            ellipsis: false,
            width: '85px',
            dataIndex: 'image',
            render: (value, record) => {
                let imgUrl = record?.mainImages?.length > 0 ? record?.mainImages[0]?.url : null;
                return (
                    imgUrl ?
                        <Avatar className="home-listing-table-avatar" src={<Image src={`${imgUrl}`} />} /> :
                        <Avatar className="home-listing-table-avatar" icon={<PictureOutlined />} />
                )
            }
        },
        {
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            width: 500,
            render: (value, record) => {
                return <>
                    {record?.marketplace ? getLinkToStore[record?.marketplace](record) : ''}
                </>
            }
        },
        {
            dataIndex: 'marketplace',
            key: 'marketplace',
            ellipsis: true,
            width: 100,
            render: (value, record) => {
                return getSvgMarketPlace(value, true);
            }
        },
        {
            ellipsis: false,
            dataIndex: 'category',
            key: 'category',
            width: 600,
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component =
                    <Row>
                        <Col span={9}>
                            <Row>
                                <Col span={24}>
                                    <Text strong>{`SKU:  `}</Text><Text ellipsis={{ tooltip: record.defaultCode }}>{record.defaultCode || 'n/a'}</Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong>Status:</Text><Text style={{ marginLeft: 5 }} ellipsis={{ tooltip: record.status }}>{record.status || 'n/a'} </Text>                                </Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={6}>
                            <Row>
                                <Col span={24}>
                                    <Text strong>{`Fulfillment: `}</Text>
                                    <Text>{record?.fulfillmentType || 'n/a'}</Text>
                                </Col>
                                {record?.fulfillmentType &&
                                    <Col span={24}>
                                        <Text strong >{`${record?.fulfillmentType == 'FBA' ? 'FBA' : 'FBM'} stock: `}</Text>
                                        <Text>{record?.fulfillmentType == 'FBA' ?
                                            (record?.inventory?.fbaAvailableStock || 'n/a') : (record?.inventory?.fbmStock || 'n/a')}</Text>
                                    </Col>
                                }
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={7}>
                            {record?.fulfillmentType == 'FBA' && !record?.marketplace?.includes(sellerMarketplaces.AMAZON) &&
                                <Row>
                                    <Text strong >FBA SKU:</Text><Text style={{ marginLeft: 5 }}>{record?.fbaSku || 'n/a'}</Text>
                                </Row>
                            }
                            <Row>
                                <Text strong>ASIN:</Text><Text style={{ marginLeft: 5 }} ellipsis={{ tooltip: record.asin }}>{record.asin || 'n/a'} </Text>
                            </Row>
                        </Col>
                    </Row>
                obj.children = component;
                return obj;
            },
        },
        {
            ellipsis: false,
            dataIndex: 'marketplaces',
            key: 'marketplaces',
            width: 150,
            render: (value, record) => {
                return <Button
                    type="text" icon={<ExpandAltOutlined style={{ fontSize: '16px' }} />}
                    onClick={() => setVisible({ value: true, data: record, title: record.defaultCode })}>
                    Ver atributos
                </Button>
            },
        },
        {
            ellipsis: false,
            key: 'action',
            width: 350,
            render: (text, record, index) => (
                <Row>
                    <Col span={record?.fulfillmentType == 'FBM' ? 12 : 24}>
                        <Tooltip placement="topLeft" title={t('home.listing.generateOrder')}>
                            <Button type="text" icon={<UnorderedListOutlined style={{ fontSize: '16px', color: "blue" }} height="15" width="15" disabled={![listingStates.PENDING_CLIENT, listingStates.COMPLETED].includes(record.state)} onClick={(e) => { }} />} >Ordenes</Button>
                        </Tooltip>
                    </Col>
                    {showFBMStock(record) && <Col span={12}>
                        <Tooltip placement="topLeft" title="Actualizar stock FBM">
                            <Button
                                type="text" icon={<AppstoreAddOutlined style={{ fontSize: '16px' }} />}
                                onClick={() => setFbmModal({
                                    value: true, clientListings: clientListings,
                                    product: { ...record, productIndex: index },
                                    title: `Actualización manual de stock para ${record.defaultCode}`
                                })}>
                                FBM stock
                            </Button>
                        </Tooltip>
                    </Col>}
                    {showFBAMatching(record)
                        && <Tooltip placement="topLeft" title={`Vincular el SKU ${record?.defaultCode} con algún SKU del inventario FBA en origen para ${record?.marketplace}.`}>
                            <Button
                                type="text" icon={<LinkOutlined style={{ fontSize: '16px' }} />}
                                onClick={() => setProductMatchingModalFBA({
                                    value: true, clientListings: clientListings,
                                    product: { ...record, productIndex: index },
                                    title: `Vinculación para el SKU ${record?.defaultCode} con inventario FBA en orígen`
                                })}>
                                FBA matching
                            </Button>
                        </Tooltip>
                    }
                </Row>
            ),
        },
    ];

    const showFBAMatching = (record) => {
        return (!record?.marketplace?.includes(sellerMarketplaces.AMAZON) && record?.externalId && record?.fulfillmentType == 'FBA');
    }

    const showFBMStock = (record) => {
        if (record?.fulfillmentType == 'FBM') {
            return true;
        }

        if (record?.fulfillmentType == 'FBA') {
            if (!record?.marketplace?.includes(sellerMarketplaces.AMAZON) && record?.externalId) {
                return true;
            }
        }

        return false;
    }

    const expandedRoww = (record, index) => {
        return <Table
            rowSelection={false}
            dataSource={record.products?.map(prd => ({
                ...prd, listingIndex: index, key: prd.id
            }))}
            columns={columnsNoHeader}
            pagination={true}
            showHeader={false}
            scroll={{ x: 1400 }}
            size="small"
        />
    }

    return (
        <>
            {!loadingAPI && session ?
                <>
                    <Row>
                        <Radio.Group
                            onChange={({ target: { value } }) => {
                                setViewMode(value);
                            }}
                            value={viewMode}
                        >
                            <Radio value="onlyProducts">Ver productos</Radio>
                            <Radio value="onlyListings">Ver listings</Radio>
                        </Radio.Group>
                    </Row>
                    {viewMode === 'onlyProducts' ?
                        expandedRoww({ products: clientProducts }, 0) :
                        <Table
                            className="home-listing-table .ant-table-thead .ant-table-cell"
                            columns={columns2} dataSource={clientListings.map((item, index) => ({ ...item, key: index }))}
                            locale={{ emptyText: <CustomTableEmptyText profileCompleted={profileCompleted} /> }}
                            scroll={{ x: "100%", y: 400 }}
                            loading={loadingAPI}
                            rowSelection={selectable ? {
                                type: 'checkbox',
                                selectedRowKeys: tableSelectedRowsKeys,
                                onChange: (selectedRowsKeys, selectedRows) => {
                                    setTableSelectedRowsKeys(selectedRowsKeys);
                                    setTableSelectedRows(selectedRows);
                                },
                            } : null}
                            expandable={{
                                expandIcon: ({ expanded, onExpand, record }) =>
                                    record.products?.length > 0 ? expanded ? (
                                        <CaretUpOutlined onClick={e => { onExpand(record, e) }} />
                                    ) : (
                                        <CaretDownOutlined onClick={e => { onExpand(record, e) }} />
                                    )
                                        : <MinusOutlined />,
                                columnWidth: 50
                            }}
                            expandedRowRender={(record, index) => expandedRoww(record, index)}
                            pagination={{
                                position: paginationPosition || ['bottomRight'], defaultCurrent: meta.page,
                                total: meta.itemCount,
                                pageSize: 50,
                                showQuickJumper: true,
                                showSizeChanger: false,
                                onChange: (page) => onChangePage(page)
                            }}
                        />
                    }
                </>
                : (
                    <div className="generic-spinner">
                        <Skeleton active />
                    </div>
                )}
            <AttributesModal
                visible={visible}
                setVisible={setVisible} />
            <FBMModal
                partnerId={partnerId}
                visible={fbmModal} setVisible={setFbmModal}
                setLoadingSyncStock={setLoadingSyncStock} loadingSyncStock={loadingSyncStock}
                clientListings={clientListings} getListingsPerPageInit={getListingsPerPageInit} />
            <FBAMatchingModal
                partnerId={partnerId}
                visible={productMatchingModalFBA} setVisible={setProductMatchingModalFBA}
                clientListings={clientListings} getListingsPerPageInit={getListingsPerPageInit}
                getAllProducts={getAllProducts} />
        </>
    )
}
