import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PictureOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Avatar, Col, Image, Row, Table, Tooltip, Typography, Form, Switch, Button, Space, Progress } from "antd";
import selectors from '../../../redux/analytic/dashboard/selectors';
import { Resizable } from 'react-resizable';
import { saveAs } from 'file-saver';
import dashboard from '../../../api/dashboard';

const { Text, Link } = Typography;

const ResizableTitle = props => {
    const { onResize, width, title, children, ...restProps } = props;
    if (!width) {
        return <th {...restProps}>{title}</th>;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps}>{title}</th>
        </Resizable>
    );
};

const DashBoardTable = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [expandable, setExpandable] = useState(true);
    const loading = useSelector(selectors.selectLoading);
    const rows = useSelector(selectors.selectRows);
    const filter = useSelector(selectors.selectRawFilter);
    const loadingProgress = useSelector(selectors.selectLoadingProgress);
    const [loadingExport, setLoadingExport] = useState(false);
    const [columnWidths, setColumnWidths] = useState({
        'name': 350, 'price': 80,
        'sumTotalSold': 100, 'sumTotalSoldVariance': 100, 'sumQuantitySold': 100, 'sumQuantitySoldVariance': 100, 'ordersQuantity': 100, 'numberUnsoldDays': 100, 'salesShare': 100,
        'fbaAvailableStock': 100, 'fbaTotalStock': 100, 'fbaDaysOutStock': 100, 'refunds': 80
    })

    console.log(rows)

    const exportExcel = async () => {
        setLoadingExport(true);
        try {
            const { data } = await dashboard.exportAnalytics(rows);
            const filename = `Analytics.xlsx`;
            let blob = new Blob([data], { type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            saveAs(blob, filename);
        } catch (error) {
            console.log('onClickExportHandler#Orders', error);
        } finally {
            setLoadingExport(false);
        }
    }

    const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const renderDolar = (value, row) => {
        return !value ? value : <span>$ {numberWithCommas(value)}</span>;
    }
    const renderPercent = (value, row) => {
        if ([undefined, null].includes(value)) {
            return '';
        }
        return {
            children: <span>{value} %</span>,
            props: {
                style: { color: parseInt(value) >= 0 ? "#5BD692" : "#FF0000" }
            }
        }
    };

    const renderPartner = (record) => {
        return <Text>{record.name}</Text>;
    }
    const renderMarket = (record) => {
        return <Text>{record.name}</Text>;
    }
    const renderListing = (record) => {
        return <Tooltip placement="rightTop" title={record.name}>{record.name.substring(0, 20)}</Tooltip>;
    }
    const renderProduct = (record) => {
        const imgUrl = record?.mainImages?.length > 0 ? record?.mainImages[0]?.url : null;
        return (<>
            <Row align="middle" justify="start">
                <Col span={24}>
                    <Space>
                        {imgUrl ?
                            <Avatar className="home-listing-table-avatar" src={<Image src={`${imgUrl}`} />} /> :
                            <Avatar className="home-listing-table-avatar" icon={<PictureOutlined />} />
                        }
                        <Space direction="vertical">
                            {getLinkToStore[record?.marketplace](record)}
                            <Tooltip title={record.name}>
                                SKU: {record.sku}
                            </Tooltip>
                        </Space>

                    </Space>
                </Col>
            </Row></>
        );
    }

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
            return item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.com/itm/${item.externalId}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Ebay Canada": (item) => {
            return item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.ca/itm/${item.externalId}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Ebay Spain": (item) => {
            return item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.es/itm/${item.externalId}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
                : <Tooltip placement="topLeft" title={item.title}><Text> {`${item.title}`}</Text></Tooltip>
        },
        "Ebay Germany": (item) => {
            return item?.externalId ?
                <Tooltip placement="topLeft" title={item.title}><Link href={`https://www.ebay.de/itm/${item.externalId}`} target="_blank"> {`${item.title}`}</Link></Tooltip>
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

    const components = {
        header: {
            cell: ResizableTitle,
        },
    };

    const handleResize = index => (e, { size }) => {
        setColumnWidths(columns => {
            const nextColumns = { ...columns };
            nextColumns[index] = size.width
            return nextColumns;
        });
    };

    const sellerColums = [
        {
            ellipsis: true,
            title: rows?.length > 0 && <Row><Text style={{ textAlign: 'center', width: '100%' }}>Sellers</Text></Row>,
            dataIndex: 'name',
            key: 'name',
            fixed: 'center',
            width: columnWidths['name'],
            onHeaderCell: column => {
                return {
                    width: column.width,
                    title: column.title,
                    onResize: handleResize('name'),
                }
            },
            render: (value, record) => {
                let component;
                if (record.isPartner) {
                    component = renderPartner(record);
                }
                if (record.isMarket) {
                    component = renderMarket(record);
                }
                if (record.isListing) {
                    component = renderListing(record);
                }
                if (record.isProduct) {
                    component = renderProduct(record);
                }
                return component;
            }
        }
    ];
    /*const salesColums = [
        {
            title: <Tooltip title="">Ventas</Tooltip>,
            onHeaderCell: column => {
                return {
                title: column.title,
            }},
            children: [
                {
                    title: <Tooltip title="Precio de venta actual publicado">Precio <InfoCircleOutlined /></Tooltip>,
                    ellipsis: true,
                    dataIndex: 'price',
                    key: 'price',
                    width: columnWidths['price'],
                    align: 'center',
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('price'),
                    }},
                    render: renderDolar,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Total de ventas en períodos seleccionados">Ventas $ <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'sumTotalSold',
                    width: columnWidths['sumTotalSold'],
                    align: 'center',
                    key: 'sumTotalSold',
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('sumTotalSold'),
                    }},
                    render: renderDolar,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Variación de ventas respecto al período anterior">Variación $ <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'sumTotalSoldVariance',
                    width: columnWidths['sumTotalSoldVariance'],
                    align: 'center',
                    key: 'sumTotalSoldVariance',
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('sumTotalSoldVariance'),
                    }},
                    render: renderPercent,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Total de unidades vendidas en período seleccionado">Unidades # <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'sumQuantitySold',
                    width: columnWidths['sumQuantitySold'],
                    align: 'center',
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('sumQuantitySold'),
                    }},
                    key: 'sumQuantitySold',
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Variaciones de unidades vendidas respecto a período anterior">Variación # <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'sumQuantitySoldVariance',
                    align: 'center',
                    width: columnWidths['sumQuantitySoldVariance'],
                    key: 'sumQuantitySoldVariance',
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('sumQuantitySoldVariance'),
                    }},
                    render: renderPercent,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Cantidad de pedidos realizados en el período">Órdenes <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'ordersQuantity',
                    align: 'center',
                    width: columnWidths['ordersQuantity'],
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('ordersQuantity'),
                    }},
                    key: 'ordersQuantity',
                },
                ,
                {
                    ellipsis: true,
                    title: <Tooltip title="Número de días sin ventas">Días sin ventas <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'numberUnsoldDays',
                    width: columnWidths['numberUnsoldDays'],
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('numberUnsoldDays'),
                    }},
                    align: 'center',
                    key: 'numberUnsoldDays',
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Porcentaje de participación en las ventas totales en cada marketplace">% de participación <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'salesShare',
                    width: columnWidths['salesShare'],
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('salesShare'),
                    }},
                    align: 'center',
                    key: 'salesShare',
                    render: renderPercent,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Unidades reembolsadas en período seleccionado">Reembolso <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'refunds',
                    width: columnWidths['refunds'],
                    onHeaderCell: column => {
                        return {
                        width: column.width,
                        title: column.title,
                        onResize: handleResize('refunds'),
                    }},
                    align: 'center',
                    key: 'refunds',
                },
            ]
        }
    ];*/

    const salesColums = [
        {
            title: <Tooltip title="">Ventas</Tooltip>,
            onHeaderCell: column => {
                return {
                    title: column.title,
                }
            },
            children: [
                {
                    title: <Tooltip title="Precio de venta actual publicado">Precio <InfoCircleOutlined /></Tooltip>,
                    ellipsis: true,
                    dataIndex: 'price',
                    key: 'price',
                    width: columnWidths['price'],
                    align: 'center',
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('price'),
                        }
                    },
                    render: renderDolar,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Total de ventas en períodos seleccionados">Ventas $ <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'sumTotalSold',
                    width: columnWidths['sumTotalSold'],
                    align: 'center',
                    key: 'sumTotalSold',
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('sumTotalSold'),
                        }
                    },
                    render: renderDolar,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Total de unidades vendidas en período seleccionado">Unidades # <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'sumQuantitySold',
                    width: columnWidths['sumQuantitySold'],
                    align: 'center',
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('sumQuantitySold'),
                        }
                    },
                    key: 'sumQuantitySold',
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Cantidad de pedidos realizados en el período">Órdenes <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'ordersQuantity',
                    align: 'center',
                    width: columnWidths['ordersQuantity'],
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('ordersQuantity'),
                        }
                    },
                    key: 'ordersQuantity',
                },
                ,
                {
                    ellipsis: true,
                    title: <Tooltip title="Número de días sin ventas">Días sin ventas <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'numberUnsoldDays',
                    width: columnWidths['numberUnsoldDays'],
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('numberUnsoldDays'),
                        }
                    },
                    align: 'center',
                    key: 'numberUnsoldDays',
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Porcentaje de participación en las ventas totales en cada marketplace">% de participación <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'salesShare',
                    width: columnWidths['salesShare'],
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('salesShare'),
                        }
                    },
                    align: 'center',
                    key: 'salesShare',
                    render: renderPercent,
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Unidades reembolsadas en período seleccionado">Reembolso <InfoCircleOutlined /></Tooltip>,
                    dataIndex: 'refunds',
                    width: columnWidths['refunds'],
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('refunds'),
                        }
                    },
                    align: 'center',
                    key: 'refunds',
                },
            ]
        }
    ];


    const stockColums = [
        {
            title: <Tooltip title="Agregar Tooltip">Stock</Tooltip>,
            onHeaderCell: column => {
                return {
                    title: column.title,
                }
            },
            children: [
                {
                    ellipsis: true,
                    title: <Tooltip title="Agregar Tooltip">Disponible</Tooltip>,
                    dataIndex: 'fbaAvailableStock',
                    key: 'fbaAvailableStock',
                    width: columnWidths['fbaAvailableStock'],
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('fbaAvailableStock'),
                        }
                    },
                    align: 'center',
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Agregar Tooltip">Total</Tooltip>,
                    dataIndex: 'fbaTotalStock',
                    key: 'fbaTotalStock',
                    width: columnWidths['fbaTotalStock'],
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('fbaTotalStock'),
                        }
                    },
                    align: 'center',
                },
                {
                    ellipsis: true,
                    title: <Tooltip title="Agregar Tooltip">Dias sin Stock</Tooltip>,
                    dataIndex: 'fbaDaysOutStock',
                    key: 'fbaDaysOutStock',
                    width: columnWidths['fbaDaysOutStock'],
                    onHeaderCell: column => {
                        return {
                            width: column.width,
                            title: column.title,
                            onResize: handleResize('fbaDaysOutStock'),
                        }
                    },
                    align: 'center',
                },
            ]
        }
    ];

    const getColumnsByFilter = () => {
        let columns = [];
        if (filter?.category?.includes('sales')) {
            columns.push(...salesColums);
        }
        if (filter?.category?.includes('stock')) {
            columns.push(...stockColums);
        }
        return columns;
    }

    const columns = [...sellerColums, ...getColumnsByFilter()]


    let progress = Math.floor((loadingProgress.progress * 100) / loadingProgress.totalToProcess);
    const tableLoading = {
        spinning: loading,
        indicator: <Progress type="circle" percent={progress} width={80} />
    }

    return rows.length > 0 ?
        (<>
            <Row>
                <Col sm={18} md={21} span={21}>
                    <Form
                        layout="inline"
                        style={{ marginBottom: 16 }}
                    >
                        <Form.Item
                            label={t('dashboard.fields.expandable')}>
                            <Switch defaultChecked onChange={setExpandable} />
                        </Form.Item>
                    </Form>
                </Col>
                <Col sm={6} md={3} span={3}>
                    <Row justify="end">
                        <Button
                            loading={loadingExport}
                            className="draft-buttons btn-basic-green"
                            onClick={exportExcel}>{t('onboarding.draft.exportExcel')}
                        </Button>
                    </Row>
                </Col>
            </Row>
            {expandable ? (
                <Table key="table-expand"
                    bordered
                    expandable={{ defaultExpandAllRows: true, rowExpandable: record => true, indentSize: 30 }}
                    loading={tableLoading}
                    columns={columns}
                    components={components}
                    dataSource={rows}
                    pagination={false}
                    size="small"
                    scroll={{
                        y: 500,
                        x: 1500,
                    }} />
            ) :
                (<Table
                    key="table-not-expand-all"
                    bordered
                    expandable
                    loading={tableLoading}
                    components={components}
                    columns={columns}
                    dataSource={rows}
                    pagination={false}
                    size="small"
                    scroll={{
                        y: 500,
                        x: 1500,
                    }} />
                )}
        </>) :
        (
            <Table key="loading-not-done" bordered columns={columns} loading={tableLoading} />
        );
};

export default React.memo(DashBoardTable);