import React from 'react';
import { Row, Col, Typography, Tooltip, Image, Table } from 'antd';
import FBA_logo from '../../../../assets/FBA_logo.png';
import FBM_logo from '../../../../assets/FBM_logo.png';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Text, Link } = Typography;

const FulfillmentShipmentsTable = ({ order, loadingShippment }) => {
    const columnsShipment = [
        {
            title: "ID", dataIndex: 'id', key: 'id', width: 80,
            render: (value, record) => <Text ellipsis={{ tooltip: record?.amazonShipmentId || record?.marketplaceShipmentId }}>
                {record?.amazonShipmentId || record?.marketplaceShipmentId}</Text>
        },
        {
            title: "STATUS", dataIndex: 'orderStatus', key: 'status', width: 70,
            render: (value, record) => <Text ellipsis={{ tooltip: record?.fulfillmentShipmentStatus }}>{record?.fulfillmentShipmentStatus}</Text>
        },
        {
            title: "SHIP DATE", dataIndex: 'date', key: 'date', width: 60,
            render: (value, record) => <Text ellipsis={{ tooltip: record?.shippingDate }}>{record?.shippingDate}</Text>
        },
        {
            title: "PACKAGE", dataIndex: 'date', key: 'date', width: 300,
            render: (value, record) =>
                <>
                    {record?.fulfillmentShipmentPackage?.map((pack, index) => (
                        <Row key={index}>
                            <Col span={6}><Text style={{ width: '100%' }} ellipsis={{ tooltip: pack?.carrierCode }}>Carrier: {pack?.carrierCode}</Text></Col>
                            <Col span={6}><Tooltip placement="top" title={'Ver seguimiento'}><Link href={pack?.carrierURL} target="_blank" style={{ width: '100%', paddingLeft: 5 }} ellipsis={{ tooltip: pack?.trackingNumber }}><SearchOutlined /> {pack?.trackingNumber} </Link></Tooltip></Col>
                            <Col span={12}>
                                <Text style={{ width: '100%', paddingLeft: 5 }} ellipsis={{ tooltip: pack?.packageNumber || pack?.trackingNumber }}>
                                    {pack?.packageNumber ? 'Package number' : 'Tracking number'}  : {pack?.packageNumber || pack?.trackingNumber}
                                </Text>
                            </Col>
                        </Row>
                    ))}
                </>
        },
        {
            title: "ITEMS IN SHIPMENT", dataIndex: 'date', key: 'date', width: 300,
            render: (value, record) =>
                <>
                    {record?.fulfillmentShipmentItem?.map((items, index) => (
                        <Row key={index}>
                            <Col span={13}>
                                <Text style={{ width: '100%' }} ellipsis={{ tooltip: items?.packageNumber || items?.trackingNumber }}>
                                    {items?.packageNumber ? 'Package number' : 'Tracking number'} : {items?.packageNumber || items?.trackingNumber}
                                </Text>
                            </Col>
                            <Col span={6}><Text style={{ width: '100%' }} ellipsis={{ tooltip: items?.sellerSku }}>SKU: {items?.sellerSku}</Text></Col>
                            <Col span={5}><Text style={{ width: '100%' }} ellipsis={{ tooltip: items?.quantity }}>Quantity: {items?.quantity}</Text></Col>
                        </Row>
                    ))}
                </>
        },
        {
            title: "FULFILLMENT ORDER ID", dataIndex: 'id', key: 'id', width: 120,
            render: (value, record) => <Text ellipsis={{ tooltip: order?.shipment?.sellerFulfillmentOrderId }}>{order?.shipment?.sellerFulfillmentOrderId}</Text>
        },
        {
            title: "SHIPPED VIA", dataIndex: 'fulfillment', key: 'fulfillment', width: 110,
            render: (text, record) => {
                let component;
                switch (order.fulfillmentChannel) {
                    case 'FBM':
                        component = <Image style={{ height: 20 }} preview={false} src={FBM_logo} />;
                        break;
                    case 'FBA':
                        component = <Image style={{ height: 20 }} preview={false} src={FBA_logo} />;
                        break;
                    default:
                        component = <Text type="text" > {order.fulfillmentChannel} </Text>;
                }
                return component;
            }
        },
    ]

    return (
        <>
            {['Shipped'].includes(order?.orderStatus) && order?.orderItems?.length > 0 && <Row>
                <Col span={24}>
                    <Table
                        className="home-listing-table"
                        size={"small"}
                        loading={loadingShippment}
                        columns={columnsShipment}
                        dataSource={order?.fulfillmentShipments || []}
                        pagination={false}
                        scroll={{ x: 1600 }}
                    />
                </Col>
            </Row>
            }
        </>
    )
};

export default React.memo(FulfillmentShipmentsTable);