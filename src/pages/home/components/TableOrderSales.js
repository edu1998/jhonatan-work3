import React, { useEffect, useRef, useState } from 'react';
import { Table, Select, Typography, Image, Button, Row, Col, Space, Input, Tooltip } from 'antd';
import { SearchOutlined, StopTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { orderSaleStates } from '../../../utils/const';
import FBA_logo from '../../../assets/FBA_logo.png';
import FBM_logo from '../../../assets/FBM_logo.png';
import FBL_logo from '../../../assets/FBL_logo.png';
import "antd/dist/antd.css";
import { getSvgMarketPlace } from '../../../utils/functions';
const { Option } = Select;
const { Text } = Typography;

const TableOrderSales = ({ orderSales, setModalVisible, hasRefunds }) => {

    const { t } = useTranslation();

    const [data, setData] = useState();
    const [tableSelectedRows, setTableSelectedRows] = useState([]);
    const [tableSelectedRowsKeys, setTableSelectedRowsKeys] = useState([]);
    const [query, setQuery] = useState();
    const searchInput = useRef();

    const handleStateChange = (newState) => {
        console.log("Cambiar al nuevo estado: ", newState);
    }

    useEffect(() => {
        if (query && orderSales?.length > 0) {
            setData(orderSales?.filter(e => e?.orderId?.includes(query[0])));
        } else {
            setData(orderSales);
        }
    }, [query, orderSales])

    const handleFulfillmentModal = (record) => {
        setModalVisible({ state: true, order: record })
    }
    const saleOrderColumns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            filterMode: 'tree',
            filterSearch: true,
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
            width: 150,
            render: (text, record) => (record?.orderId),
        },
        {
            title: "DATE",
            dataIndex: "date",
            key: "date",
            width: 150,
            render: (text, record) => <Text>{new Date(record?.purchaseDate)?.toLocaleString()}</Text>,
        },
        {
            title: "MARKETPLACE",
            dataIndex: "marketplace",
            key: "marketplace",
            width: 130,
            render: (value, record) => {
                return getSvgMarketPlace(value, true);
            }
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (text, record) => (<>
                <Text>
                    {record?.orderStatus == 'Shipped'
                        && record?.orderFulfillmentStatus == 'Planning' ?
                        'Processing ...' : record?.orderStatus}
                </Text>
                {record?.shipment?.errors?.length > 0
                    && record?.orderStatus == 'Unshipped'
                    && <Tooltip placement="top" title={`Debe cumplir manualmente con la orden`} >
                        <StopTwoTone style={{ marginLeft: 10 }} twoToneColor="#D93025" />
                    </Tooltip>
                }</>),
        },
        {
            title: "CHANNEL",
            dataIndex: "channel",
            key: "channel",
            width: 110,
            render: (text, record) => (record?.salesChannel),
        },
        {
            title: "UPDATE",
            dataIndex: "update",
            key: "update",
            width: 150,
            render: (text, record) => <Text>{new Date(record?.lastUpdateDate)?.toLocaleString()}</Text>,
        },
        {
            title: "TOTAL",
            dataIndex: "total",
            key: "total",
            width: 80,
            sorter: (a, b) => a.orderTotal - b.orderTotal,
            render: (text, record) => (<Text>{`${record?.currency || 'USD'} ${parseFloat(record?.orderTotal || 0.00)?.toFixed(2)}`}</Text>),
        },
        {
            title: "FULFILLMENT",
            dataIndex: "fulfillment",
            key: "fulfillment",
            width: 100,
            render: (text, record) => {
                let component;
                switch (record?.fulfillmentChannel) {
                    case "FBA":
                        component = <>
                            {FBA_logo ? (
                                <Image style={{ cursor: "pointer" }} height={27}
                                    preview={false} onClick={() => { handleFulfillmentModal(record) }} src={FBA_logo} />
                            ) : (
                                <Button
                                    size="large"
                                    type="text"
                                    className="btn-primary"
                                    onClick={() => { handleFulfillmentModal(record) }}
                                >
                                    Enviar a FBA
                                </Button>
                            )}
                        </>
                        break;
                    case 'FBM':
                        component =
                            <Image style={{ cursor: "pointer" }} height={27}
                                src={FBM_logo} preview={false} onClick={() => { handleFulfillmentModal(record) }} />
                        break;
                    default:
                        component =
                            <Image style={{ cursor: "pointer" }} height={27}
                                src={FBL_logo} preview={false} onClick={() => { handleFulfillmentModal(record) }} />
                        break;
                }
                return component;
            }
        },
    ]

    const refundColums = [
        {
            title: "REFUNDS",
            dataIndex: "refunds",
            key: "refunds",
            width: 150,
            render: (text, record) => <Text>{record?.refunds}</Text>,
        },
    ];


    const getColumns = () => {
        if (hasRefunds && saleOrderColumns) {
            let columns = [];
            const actionColumn = saleOrderColumns.slice(saleOrderColumns.length - 1, saleOrderColumns.length);
            const restColumns = saleOrderColumns.slice(0, saleOrderColumns.length - 1);
            refundColums.push(...actionColumn);
            columns.push(...restColumns, ...refundColums);
            return columns;
        }
    }

    const columns = hasRefunds ? [...getColumns()] : saleOrderColumns;
    return <>
        <Table className="home-listing-table ant-table-thead ant-table-cell"
            columns={columns} dataSource={data}
            scroll={{ x: 1400, y: 600 }}
            rowSelection={{
                type: 'checkbox',
                selectedRowKeys: tableSelectedRowsKeys,
                onChange: (selectedRowsKeys, selectedRows) => {
                    setTableSelectedRowsKeys(selectedRowsKeys);
                    setTableSelectedRows(selectedRows);
                },
            }}
        />
    </>
}

export default TableOrderSales;