import React from 'react';
import { Row, Col, Typography, Table, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import FBA_logo from '../../../../assets/FBA_logo.png';
import 'antd/dist/antd.css';

const { Text } = Typography;

const FBAFromamazon = ({ order, loadingShippment }) => {
    const { t } = useTranslation();
    const columnsShipment = [
        {
            title: "ID", dataIndex: 'id', key: 'id', width: 80,
            render: (value, record) => <Text ellipsis={{ tooltip: record?.orderId }}>{record?.orderId}</Text>
        },
        {
            title: "STATUS", dataIndex: 'orderStatus', key: 'status', width: 70,
            render: (value, record) => <Text ellipsis={{ tooltip: record?.orderStatus }}>{record?.orderStatus}</Text>
        },
        {
            title: "ITEMS IN SHIPMENT", dataIndex: 'date', key: 'date', width: 250,
            render: (value, record) =>
                <>
                    {record?.orderItems?.map(items => (
                        <>
                            <Row>
                                <Col span={12}><Text ellipsis={{ tooltip: items?.sku }}>SKU: {items?.sku}</Text></Col>
                                <Col span={12}><Text ellipsis={{ tooltip: items?.asin }}>ASIN: {items?.asin}</Text></Col>
                            </Row>
                            <Row>
                                <Col span={24}><Text ellipsis={{ tooltip: items?.title }} style={{ width: 250 }}>TITLE: {items?.title}</Text></Col>
                            </Row>
                        </>
                    ))}
                </>
        },
        {
            title: "SHIPPED VIA", dataIndex: 'fulfillment', key: 'fulfillment', width: 110,
            render: (text, record) => {
                let component;
                component = <>
                    {FBA_logo ? (
                        <Image style={{ width: '100px' }} preview={false} src={FBA_logo} />
                    ) : (
                        <Text size="large" type="text" > FBA </Text>
                    )}
                </>
                return component;
            }
        },
    ]

    return (
        <>
            {['Shipped'].includes(order?.orderStatus) && order?.orderItems?.length > 0 &&
                <>
                    <Text style={{ fontSize: "22px", }}>Shipments</Text>
                    <Row>
                        <Table
                            className="home-listing-table"
                            size={"small"}
                            loading={loadingShippment}
                            columns={columnsShipment}
                            dataSource={[order]}
                            pagination={false}
                            scroll={{ x: 1000 }}
                        />
                    </Row>
                </>
            }
        </>
    )
};

export default React.memo(FBAFromamazon);