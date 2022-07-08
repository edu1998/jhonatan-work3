import React, { useEffect, useState } from "react";
import {
    DownOutlined,
    DeleteOutlined,
    PictureOutlined,
    UpOutlined,
    MinusOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
    Button,
    Table,
    Row,
    Col,
    Space,
    Avatar,
    Image,
    Skeleton
} from "antd";
import "antd/dist/antd.css";
import { CustomTableEmptyText } from './CustomTableEmptyText';

export const TableStock = ({ datas, profileCompleted, session, show }) => {
    const [data, setData] = useState([]);
    const { t } = useTranslation();
    const [loadingAPI, setLoadingAPI] = useState(false);

    useEffect(async () => {
        if (true) {
            setLoadingAPI(true);
            setData(handleData);
            setLoadingAPI(false);
        } else {
            setLoadingAPI(true);
            //setSales(datas);
            setLoadingAPI(false);
        }
    }, []);


    const handleData = () => {

        return session.userInfo.role !== 'Admin' ?
            [
                {
                    inventoryPercentaje: 54,
                    name: 'AMAZON',
                    inventory: 80,
                    noStock: 2,
                    subData: [
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: false,
                            image: false,
                        },
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: false,
                        },
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: 5,
                        },
                    ],
                },
                {
                    inventoryPercentaje: 54,
                    name: 'EBAY',
                    inventory: 80,
                    noStock: 2,
                    subData: [
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: false,
                        },
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: false,
                        },
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: 5,
                        },
                    ],
                },
                {
                    inventoryPercentaje: 54,
                    name: 'WALMART',
                    inventory: 80,
                    noStock: 2,
                    subData: [
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: false,
                        },
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: false,
                        },
                        {
                            inventoryPercentaje: 54,
                            name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                            sku: '1234abcdf5678',
                            inventory: 30,
                            noStock: 5,
                        },
                    ],
                },
            ] :
            [
                {
                    name: "Cliente demo test",
                    inventory: 441,
                    noStock: false,
                    inventoryPercentaje: 54,
                    subData: [
                        {
                            name: 'AMAZON',
                            inventory: 80,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: 5,
                                },
                            ],
                        },
                        {
                            name: 'EBAY',
                            inventory: 80,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    noStock: false,
                                    inventoryPercentaje: 54,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: 5,
                                },
                            ],
                        },
                        {
                            name: 'WALMART',
                            inventory: 80,
                            noStock: 2,
                            inventoryPercentaje: 54,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    noStock: 5,
                                    inventoryPercentaje: 54,
                                },
                            ],
                        },
                    ]
                },
                {
                    name: "Cliente demo test",
                    inventory: 441,
                    inventoryPercentaje: 54,
                    noStock: false,
                    subData: [
                        {
                            name: 'AMAZON',
                            inventory: 80,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    noStock: 5,
                                    inventoryPercentaje: 54,
                                },
                            ],
                        },
                        {
                            name: 'EBAY',
                            inventory: 80,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    noStock: 5,
                                    inventoryPercentaje: 54,
                                },
                            ],
                        },
                        {
                            name: 'WALMART',
                            inventory: 80,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    noStock: false,
                                    inventoryPercentaje: 54,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: 5,
                                },
                            ],
                        },
                    ]
                },
                {
                    name: "Cliente demo test",
                    inventory: 441,
                    inventoryPercentaje: 54,
                    noStock: false,
                    subData: [
                        {
                            name: 'AMAZON',
                            inventory: 80,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: 5,
                                },
                            ],
                        },
                        {
                            name: 'EBAY',
                            inventory: 80,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: false,
                                },
                                {
                                    name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                                    sku: '1234abcdf5678',
                                    inventory: 30,
                                    inventoryPercentaje: 54,
                                    noStock: 5,
                                },
                            ],
                        },
                        {
                            name: 'WALMART',
                            inventory: 0,
                            inventoryPercentaje: 54,
                            noStock: 2,
                            subData: [],
                        },
                    ]
                },
            ]
    };

    const columns = [
        {
            ellipsis: true,
            title: 'NAME',
            dataIndex: 'name',
            render: (value, record) => {
                const obj = {
                    children: value,
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
            title: 'INVENTARIO',
            width: '330px',
            dataIndex: 'inventory',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component =
                    <Row>
                        <Col style={{width: '50px'}}>
                            <span>{record.inventory}</span>
                        </Col>
                        <Col style={{width: '60px', color: '#5BD692', fontWeight: 'bold'}}>
                            <span>{record.inventoryPercentaje} %</span>
                        </Col>
                    </Row>
                obj.children = component;
                return obj;
            },
        },
        {
            ellipsis: false,
            title: 'DIAS SIN STOCK',
            width: '400px',
            dataIndex: 'noStock',
            render: (value, record) => {
                const obj = {
                    children: value,
                    props: {}
                }
                obj.children = record.noStock ? record.noStock : "-";
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
                            <Avatar src={<Image src={`data:image/png;base64, ${record.image_1920}`} />} />
                        ) : (
                            <Avatar icon={<PictureOutlined />} />
                        )}
                    </>
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
            dataIndex: 'inventory',
            width: '330px',
            render: (value, record) => {
                let component;
                const obj = {
                    children: value,
                    props: {}
                }
                component =
                    <Row>
                        <Col style={{width: '50px'}}>
                            <span>{record.inventory}</span>
                        </Col>
                        <Col style={{width: '60px', color: '#5BD692', fontWeight: 'bold'}}>
                            <span>{record.inventoryPercentaje} %</span>
                        </Col>
                    </Row>
                obj.children = component;
                return obj;
            }
        },
        {
            ellipsis: false,
            dataIndex: 'noStock',
            width: '400px',
            render: (value, record) => {
                const obj = {
                    children: value,
                    props: {}
                }
                obj.children = record.noStock ? record.noStock : "-";
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
                        <Avatar src={<Image src={`data:image/png;base64, ${record.image_1920}`} />} />
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
};
