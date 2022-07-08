import React, { useState, useEffect } from 'react';
import { Table, Pagination, Skeleton, Row, Col, Avatar, Image } from 'antd';
import { UpOutlined, DownOutlined, MinusOutlined, PictureOutlined } from '@ant-design/icons';
import { CustomTableEmptyText } from './CustomTableEmptyText';

export const TableSales = ({ datass, profileCompleted, session, show }) => {

    const datas = [
        {
            name: 'AMAZON',
            listings: 3,
            montoPercentaje: 100,
            promedioPorOrden: 2.5,
            pedidosPorOrden: 2000,
            ventas: 100,
            monto: 500.12,
            montoPercentaje: 100,
            pedidosPorOrden: 2000,
            promedioPorOrden: 2.5,
            subData: [
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 30,
                    monto: 150.15,
                    montoPercentaje: 100,
                    estado: 'Bueno'
                },
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 50,
                    monto: 250.22,
                    montoPercentaje: 100,
                    estado: 'Malo'
                },
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 20,
                    montoPercentaje: 100,
                    monto: 100.666,
                    estado: 'Regular'
                },
            ],
        },
        {
            name: 'EBAY',
            listings: 4,
            montoPercentaje: 100,
            promedioPorOrden: 2.5,
            pedidosPorOrden: 2000,
            ventas: 100,
            montoPercentaje: 100,
            monto: 500.45,
            subData: [
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 30,
                    montoPercentaje: 100,
                    monto: 150.00,
                    estado: 'Bueno'
                },
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 50,
                    montoPercentaje: 100,
                    monto: 250.00,
                    estado: 'Malo'
                },
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 20,
                    montoPercentaje: 100,
                    monto: 100.00,
                    estado: 'Regular'
                },
            ],
        },
        {
            name: 'WALMART',
            listings: 2,
            montoPercentaje: 100,
            promedioPorOrden: 2.5,
            pedidosPorOrden: 2000,
            ventas: 34,
            montoPercentaje: 100,
            monto: 500.78,
            subData: [
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 30,
                    montoPercentaje: 100,
                    monto: 150.00,
                    estado: 'Bueno'
                },
                {
                    image: '',
                    name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                    sku: '2344BFSD231',
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 4,
                    montoPercentaje: 100,
                    monto: 250.00,
                    estado: 'Malo'
                },
            ],
        },
        {
            name: 'Other Market Place',
            listings: 0,
            montoPercentaje: 100,
            promedioPorOrden: 2.5,
            pedidosPorOrden: 2000,
            ventas: 0,
            montoPercentaje: 100,
            monto: 0.01,
            subData: [],
        }
    ]

    const dataAdmins = [
        {
            name: 'Cliente 1',
            listings: 0,
            montoPercentaje: 100,
            promedioPorOrden: 2.5,
            pedidosPorOrden: 2000,
            ventas: 0,
            image: false,
            montoPercentaje: 100,
            monto: 0.12,
            subData: [],
        },
        {
            name: 'Cliente 2',
            listings: 3,
            montoPercentaje: 100,
            promedioPorOrden: 2.5,
            pedidosPorOrden: 2000,
            ventas: 100,
            image: false,
            montoPercentaje: 100,
            monto: 500.12,
            subData: [
                {
                    name: 'AMAZON',
                    listings: 3,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 100,
                    montoPercentaje: 100,
                    monto: 500.13,
                    subData: [
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 30,
                            montoPercentaje: 100,
                            monto: 150.15,
                            estado: 'Bueno'
                        },
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 50,
                            montoPercentaje: 100,
                            monto: 250.22,
                            estado: 'Malo'
                        },
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 20,
                            montoPercentaje: 100,
                            monto: 100.66,
                            estado: 'Regular'
                        },
                    ],
                },
                {
                    name: 'EBAY',
                    listings: 4,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 100,
                    montoPercentaje: 100,
                    monto: 500.46,
                    subData: [
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 30,
                            montoPercentaje: 100,
                            monto: 150.00,
                            estado: 'Bueno'
                        },
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 50,
                            montoPercentaje: 100,
                            monto: 250.00,
                            estado: 'Malo'
                        },
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 20,
                            montoPercentaje: 100,
                            monto: 100.00,
                            estado: 'Regular'
                        },
                    ],
                },
                {
                    name: 'WALMART',
                    listings: 2,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 34,
                    montoPercentaje: 100,
                    monto: 500.79,
                    subData: [
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 30,
                            montoPercentaje: 100,
                            monto: 150.00,
                            estado: 'Bueno'
                        },
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 4,
                            montoPercentaje: 100,
                            monto: 250.00,
                            estado: 'Malo'
                        },
                    ],
                },
                {
                    name: 'Other Market Place',
                    listings: 0,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 0,
                    montoPercentaje: 100,
                    monto: 0.01,
                    subData: [],
                }
            ],
        },
        {
            name: 'Cliente 3',
            listings: 3,
            montoPercentaje: 100,
            promedioPorOrden: 2.5,
            pedidosPorOrden: 2000,
            ventas: 100,
            image: false,
            montoPercentaje: 100,
            monto: 500.12,
            subData: [
                {
                    name: 'AMAZON',
                    listings: 3,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 100,
                    montoPercentaje: 100,
                    monto: 500.13,
                    subData: [],
                },
                {
                    name: 'EBAY',
                    listings: 4,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 100,
                    montoPercentaje: 100,
                    monto: 500.45,
                    subData: [],
                },
                {
                    name: 'WALMART',
                    listings: 2,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 34,
                    montoPercentaje: 100,
                    monto: 500.79,
                    subData: [
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 30,
                            montoPercentaje: 100,
                            monto: 150.00,
                            estado: 'Bueno'
                        },
                        {
                            image: '',
                            name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                            sku: '2344BFSD231',
                            montoPercentaje: 100,
                            promedioPorOrden: 2.5,
                            pedidosPorOrden: 2000,
                            ventas: 4,
                            montoPercentaje: 100,
                            monto: 250.00,
                            estado: 'Malo'
                        },
                    ],
                },
                {
                    name: 'Other Market Place',
                    listings: 0,
                    montoPercentaje: 100,
                    promedioPorOrden: 2.5,
                    pedidosPorOrden: 2000,
                    ventas: 0,
                    montoPercentaje: 100,
                    monto: 0.01,
                    subData: [],
                }
            ],
        },
    ]

    const [data, setData] = useState([]);
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [checkStrictly, setCheckStrictly] = useState(false);

    useEffect(async () => {
        if (true) {
            setLoadingAPI(true);
            setData(session.userInfo.role != 'Admin' ? datas : dataAdmins);
            setLoadingAPI(false);
        } else {
            setLoadingAPI(true);
            //setData(datas);
            setLoadingAPI(false);
        }
    }, []);

    const columns = [
        {
            ellipsis: true,
            title: 'NAME',
            dataIndex: 'name',
            render: (value, record) => {
                const obj = {
                    children: record.name,
                    props: {}
                }
                obj.children = record.name;
                if (session.userInfo.role != 'Admin') {
                    if (record.name == 'AMAZON' || 'EBAY' || 'WALMART') {
                        return <span style={{
                            color: '#08c',
                            textDecoration: 'underline',
                        }}>{record.name}</span>
                    }
                }
                return obj;
            }
        },
        {
            ellipsis: false,
            title: 'LISTINGS',
            width: '130px',
            dataIndex: 'listings',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>{record.listings}</span>
                obj.children = component;
                return obj;
            },
        },
        {
            ellipsis: false,
            title: 'MONTO',
            width: '200px',
            dataIndex: 'monto',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>$ {record.monto}</span>
                obj.children = component;
                return obj;
            }
        },
        {
            ellipsis: false,
            title: 'PEDIDOS POR ORDEN',
            width: '200px',
            dataIndex: 'pedidosPorOrden',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>$ {record.pedidosPorOrden}</span>
                obj.children = component;
                return obj;
            }
        },
        {
            ellipsis: false,
            title: 'PROMEDIO POR ORDEN',
            width: '200px',
            dataIndex: 'promedioPorOrden',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>{record.promedioPorOrden}</span>
                obj.children = component;
                return obj;
            }
        },
    ];

    const columnsAdmin = [
        {
            ellipsis: false,
            title: 'IMAGE',
            width: '85px',
            dataIndex: 'image',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                if (session.userInfo.role == 'Admin') {
                    component = <>
                        {record.image ? (
                            <Avatar src={<Image src={record.image} />} />
                        ) : (
                            <Avatar icon={<PictureOutlined />} />
                        )}
                    </>
                } else {

                }
                obj.children = component;
                return obj;
            }
        },
        ...columns
    ];

    const columnsNoHeader = [
        {
            ellipsis: false,
            width: '1px',
            dataIndex: 'image',
        },
        {
            ellipsis: false,
            dataIndex: 'name',
            render: (value, record) => {
                let component;
                const obj = {
                    children: record.name,
                    props: {}
                }
                if (session.userInfo.role == 'Admin') {

                    if (record.name == 'AMAZON' || 'EBAY' || 'WALMART') {
                        component = <span style={{
                            color: '#08c',
                            textDecoration: 'underline',
                        }}>{record.name}</span>
                        obj.children = component;
                    }
                }
                if (record.sku) {
                    component =
                        <Col>
                            <Row>
                                {record.name}
                            </Row>
                            <Row style={{ color: 'lightGray' }}>
                                SKU: {record.sku}
                            </Row>
                        </Col>
                    obj.children = component;
                }
                return obj;
            }
        },
        {
            ellipsis: false,
            width: '130px',
            dataIndex: 'listings',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>{record.listings}</span>
                obj.children = component;
                return obj;
            },
        },
        {
            ellipsis: false,
            width: '200px',
            dataIndex: 'monto',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>$ {record.monto}</span>
                obj.children = component;
                return obj;
            }
        },
        {
            ellipsis: false,
            width: '200px',
            dataIndex: 'pedidosPorOrden',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>$ {record.pedidosPorOrden}</span>
                obj.children = component;
                return obj;
            }
        },
        {
            ellipsis: false,
            width: '200px',
            dataIndex: 'promedioPorOrden',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <span>{record.promedioPorOrden}</span>
                obj.children = component;
                return obj;
            }
        },
    ];

    const columnsSecondLevel = [
        {
            ellipsis: false,
            width: '10px',
            dataIndex: 'image',
        },
        ...columnsNoHeader
    ];

    const columnsThirdLevel = [
        {
            ellipsis: false,
            title: 'IMAGE',
            width: '53px',
            dataIndex: 'image',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component = <>
                    {record.image ? (
                        <Avatar src={<Image src={record.image} />} />
                    ) : (
                        <Avatar icon={<PictureOutlined />} />
                    )}
                </>
                obj.children = component;
                return obj;
            }
        },
        ...columnsNoHeader
    ];

    const expandedRoww = (record) => {
        if (record[0].name == 'AMAZON') {
            return <Table
                rowSelection={false}
                expandable={{
                    expandIcon: ({ expanded, onExpand, record }) =>
                        record.subData.length > 0 ? expanded ? (
                            <UpOutlined onClick={e => onExpand(record, e)} />
                        ) : (
                            <DownOutlined onClick={e => onExpand(record, e)} />
                        )
                            : <MinusOutlined />,
                    columnWidth: 30
                }}
                dataSource={record.map((item, index) => ({ ...item, key: index }))}
                columns={columnsSecondLevel}
                expandedRowRender={(record) => expandedRoww(record.subData)}
                rowClassName={"stock-row-marketplaces"}
                size='small'
                pagination={false}
                showHeader={false}
            />

        } else {
            return <Table
                rowSelection={false}
                dataSource={record.map((item, index) => ({ ...item, key: index }))}
                columns={columnsThirdLevel}
                pagination={false}
                showHeader={false}
            />
        }
    }

    return (
        <>
            {
                show ? !loadingAPI ?
                    <Table
                        className="order-table"
                        rowSelection={false}
                        locale={{ emptyText: <CustomTableEmptyText profileCompleted={profileCompleted} /> }}
                        scroll={{ x: 1200, y: 400 }}
                        expandable={{
                            expandIcon: ({ expanded, onExpand, record }) =>
                                record.subData.length > 0 ? expanded ? (
                                    <UpOutlined onClick={e => onExpand(record, e)} />
                                ) : (
                                    <DownOutlined onClick={e => onExpand(record, e)} />
                                )
                                    : <MinusOutlined />,
                            columnWidth: 50
                        }}
                        dataSource={data.map((item, index) => ({ ...item, key: index }))}
                        columns={session.userInfo.role != 'Admin' ? columns : columnsAdmin}
                        expandedRowRender={(record) => expandedRoww(record.subData)}
                        rowClassName={session.userInfo.role != 'Admin' ? "stock-row-marketplaces" : ""}
                        size='small'
                        pagination={false}
                    /> :
                    <div className="generic-spinner">
                        <Skeleton active />
                    </div>
                    : null
            }
        </>
    );
}