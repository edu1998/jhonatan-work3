import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Row, Col, Divider, Form, Input, Select, Tooltip, Table, InputNumber, Skeleton, Typography, Alert } from 'antd';
import {
    CheckCircleOutlined,
    Loading3QuartersOutlined,
    SmileFilled,
    SaveFilled,
    CalendarOutlined,
    FormOutlined,
    InfoCircleOutlined,
    EnvironmentFilled,
    ShoppingFilled
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import { orderSaleStates } from '../../../utils/const';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import orderSalesApi from '../../../api/order-sales';
import listingApi from '../../../api/listing';
import partnerApi from '../../../api/partner';
import { useTranslation } from 'react-i18next';
import FBAFromAnotherMarketplace from './fulfillmentOutbound/FBAFromAnotherMarketplace';
import FBAFromAmazon from './fulfillmentOutbound/FBAFromAmazon';
import FBM from './fulfillmentOutbound/FBM';
import FBF from './fulfillmentOutbound/FBF';

const { Text, Title } = Typography;

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const formByFulfillmentType = {
    FBM: FBM,
    FBF: FBF,
    FBA: FBAFromAmazon,
    FBAFOM: FBAFromAnotherMarketplace,
}

const FormByFulfillmentType = (props) => {
    let fulfillmentType = props?.order?.fulfillmentChannel;
    switch (fulfillmentType) {
        case 'FBA':
            fulfillmentType = !props.isReadOnly ?
                'FBAFOM' : [orderSaleStates.UNSHIPPED, orderSaleStates.SHIPPED, orderSaleStates.PARTIALLY_SHIPPED].includes(props.order.orderStatus) && props.order.marketplace != 'Amazon' ?
                    'FBAFOM' : 'FBA';
            break;
        case 'FBM':
            fulfillmentType = props.order.marketplace == 'Amazon' ? 'FBA' : 'FBM';
            break;
        default:
            fulfillmentType = 'FBF';
            break;
    }
    let Comp = formByFulfillmentType[fulfillmentType];
    return <Comp {...props}></Comp>
}

const FulfillmentModal = ({ isModalVisible, setModalVisible }) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [loadingShippment, setLoadingShippment] = useState(false);
    const [loadingSendFulfillment, setLoadingSendFulfillment] = useState(false);
    const [loadingCancelFBA, setLoadingCancelFBA] = useState(false);
    const [loadingUpdateFBA, setLoadingUpdateFBA] = useState(false);
    const [order, setOrder] = useState();
    const [isReadOnly, setReadOnly] = useState(false);
    const [productsToMatchOnFBA, setProductsToMatchOnFBA] = useState();
    const [loadingListingsAndProducts, setLoadingGetProducts] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [footerButtons, setFooterButtons] = useState(false);

    useEffect(() => {
        if (order) {
            setDisabled(['Canceled', 'Shipped'].includes(order?.orderStatus) || order?.orderFulfillmentStatus === 'Completed');
            if (['FBM', 'FBF', 'FBL'].includes(order?.fulfillmentChannel)) {
                setFooterButtons([
                    <Button
                        key="cancel"
                        onClick={handleCancelModal}>
                        Cerrar
                    </Button>]);
            } else {
                setFooterButtons([
                    <Button
                        key="cancel"
                        onClick={handleCancelModal}>
                        Cerrar
                    </Button>,
                    <Button
                        icon={<SaveFilled />}
                        key="save"
                        type="submit"
                        className="btn-link-filled"
                        loading={loading}
                        onClick={handleSave}>
                        Guardar
                    </Button>
                ]);
            }
        }
    }, [order])

    const session = useSelector(store => store.Session.session);

    useEffect(() => {
        if (isModalVisible?.order) {
            form.resetFields();
            getDetails();
        }
    }, [isModalVisible])

    useEffect(() => {
        if (order) {
            form.setFieldsValue(order);
        }
    }, [order])

    const getDetails = () => {
        setLoadingItems(true);
        let values = {
            orderId: isModalVisible?.order?.orderId,
            partnerId: isModalVisible?.order?.partnerId,
            marketplace: isModalVisible?.order?.marketplace,
        }
        orderSalesApi.getByOrderId(values).then((res) => {
            let data = {
                ...isModalVisible?.order,
                ...res?.data
            };

            setReadOnly(data?.fulfillmentChannel === "FBM" ? true : data?.marketplace === 'Amazon' ? true : data?.shipment?.canAutoFulfillmentOutbound);
            setOrder(data);
            getTotalDetail(data);
            setLoadingItems(false);
            form.setFieldsValue({
                shipment: {
                    ...data.shipment,
                    marketplaceId: data.marketplaceId || "ATVPDKIKX0DER",
                    shippingSpeedCategory: data.shippingSpeedCategory || "Standard",
                },
                orderItems: data.orderItems,
                notificationEmails: data?.notificationEmails?.length > 0 ?
                    data?.notificationEmails : [session?.userInfo?.email, data?.buyerInfo?.email]
            });
        }).catch((error) => {
            setLoadingItems(false);
        });
    }

    useEffect(() => {
        if (!isReadOnly && order?.fulfillmentChannel === 'FBA') {
            getListingsByPartner();
        }
    }, [isReadOnly, order])

    const getListingsByPartner = async () => {
        setLoadingGetProducts(true);
        let products = [];
        await partnerApi.productsWithInventoryAtOriginFba(isModalVisible?.order?.partnerId, isModalVisible?.order?.marketplace)
            .then((response) => {
                for (const product of response?.data) {
                    if (product?.defaultCode && product?.externalId) {
                        if (!products?.find(p => p.defaultCode === product.defaultCode && p.marketplace === product.marketplace)) {
                            products.push(product)
                        }
                    }
                }
            }).catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingGetProducts(false);
        setProductsToMatchOnFBA(products);
    }

    useEffect(() => {
        if (productsToMatchOnFBA?.length > 0) {
            let items = [];
            for (const itemOrdered of order?.orderItems) {
                const skuMatched = productsToMatchOnFBA?.find(item => item?.sku === itemOrdered?.sellerSku || item?.sku === itemOrdered?.sku);
                if (skuMatched) {
                    items.push({ ...itemOrdered, sellerSku: skuMatched.sku, sellerFulfillmentOrderItemId: skuMatched.sku });
                } else {
                    items.push({ ...itemOrdered, sellerSku: 'Seleccione el SKU correcto para FBA', sellerFulfillmentOrderItemId: null });
                }
            }
            form.setFieldsValue({ orderItems: items });
        }
    }, [productsToMatchOnFBA])



    const getTotalDetail = (order) => {
        let data = { subtotal: 0, shippingPrice: 0, shippingTax: 0, taxPrice: 0, discount: 0, total: 0 };
        for (const item of order?.orderItems) {
            item?.itemPrice?.amount && (data.subtotal += parseFloat(String(item?.itemPrice?.amount)) * item?.quantity);
            item?.itemTax?.amount && (data.taxPrice += parseFloat(String(item?.itemTax?.amount)));
            item?.shippingPrice?.amount && (data.shippingPrice += parseFloat(String(item?.shippingPrice?.amount)));
            item?.deliveryCost?.amount && (data.deliveryCost += parseFloat(String(item?.deliveryCost?.amount)));
            item?.promotionDiscount?.amount && (data.discount += parseFloat(String(item?.promotionDiscount?.amount)));
            item?.shippingDiscount?.amount && (data.discount += parseFloat(String(item?.shippingDiscount?.amount)));
            //item?.promotionDiscountTax?.amount && (data.discount += parseFloat(item?.promotionDiscountTax?.amount));
        }

        data.total = order?.orderTotal ? parseFloat(String(order?.orderTotal)) : 0;
        data.subtotal = data.subtotal?.toFixed(2) || 0;
        data.taxPrice = data.taxPrice?.toFixed(2) || 0;
        data.shippingPrice = data.shippingPrice?.toFixed(2) || 0;
        data.discount = data.discount?.toFixed(2) || 0;
        form.setFieldsValue(data)
    }

    const doFulfillmentOutbound = (values) => {
        const fulfillmentType = !isReadOnly && order?.fulfillmentChannel === 'FBA' ? 'FBA' : 'FBM';
        switch (fulfillmentType) {
            case 'FBA':
                const items = values?.orderItems?.map((item, index) => ({ ...order?.orderItems[index], ...item, sellerFulfillmentOrderId: item.sku }))
                values.orderItems = items;
                let payload = { ...order, ...values, partnerId: isModalVisible?.order?.partnerId }
                if (order?.shipment?.sellerFulfillmentOrderId && ['New', 'Received'].includes(order?.orderFulfillmentStatus)) {
                    updateFBAFulfillmentOutbound(payload);
                } else {
                    saveFulfillment(payload);
                }
                break;
            case 'FBF':
            case 'FBM':
                break;
            default:
                break;
        }
    }

    const saveFulfillment = (payload) => {
        setLoadingSendFulfillment(true);
        orderSalesApi.saveFulfillmentOutbound(payload).then((res) => {
            const response = res.data;
            if (res.data.success) {
                syncFbaStockByPartner(payload);
            }
            openNotification({ status: response.success, content: !response.success ? response.errors.message : 'Fulfillment enviado a FBA', duration: 8 });
            setLoadingSendFulfillment(false);
        }).catch((error) => {
            setLoadingSendFulfillment(false);
            openNotification({ status: false, content: error });
        });
    }

    const syncFbaStockByPartner = async (payload) => {
        const values = {
            commercialPartnerId: payload?.partnerId,
        }
        await listingApi.syncFbaStock(values)
            .then((result) => {
                openNotification({ status: true, content: 'Sincronización de stock FBA con éxito' });
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingSendFulfillment(false);
    }

    const updateFBAFulfillmentOutbound = (values) => {
        setLoadingUpdateFBA(true);
        let payload = { ...order, ...values };
        orderSalesApi.updateFBAFulfillmentOutbound(payload).then((res) => {
            const response = res.data;
            if (res.data.success) {
                syncFbaStockByPartner(payload);
            }
            setLoadingUpdateFBA(false);
            openNotification({ status: response.success, content: !response.success ? response.errors.message : 'Fulfillment actualizado', duration: 8 });
        }).catch((error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setLoadingUpdateFBA(false);
        });
    }

    const cancelFBAFulfillmentOutbound = (payload) => {
        setLoadingCancelFBA(true);
        if (payload) {
            order.cancellationReasonCode = payload
        }
        orderSalesApi.cancelFBAFulfillmentOutbound(order).then((res) => {
            const response = res.data;
            setLoadingCancelFBA(false);
            openNotification({ status: response.success, content: !response.success ? response.errors.message : 'Fulfillment cancelado', duration: 8 });
        }).catch((error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setLoadingCancelFBA(false);
        });
    }

    const handleCancelModal = () => {
        setModalVisible({ state: false, data: {} });
    }

    const handleSave = () => {
        let data = form.getFieldsValue();
        let payload = { ...order, ...data };
        if (data?.id) {
            payload.id = data?.id;
            updateOrder(payload);
        } else {
            saveOrder(payload);
        }
    }

    const saveOrder = (payload) => {
        setLoading(true);
        orderSalesApi.saveSaleOrder(payload).then((res) => {
            form.setFieldsValue({ id: res?.data?.id });
            openNotification({ status: true, content: 'Datos almacenados correctamente.' });
            setLoading(false);
        }).catch((error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setLoading(false);
        });
    }

    const updateOrder = (payload) => {
        setLoading(true);
        orderSalesApi.updateSaleOrder(payload?.id, payload).then((res) => {
            openNotification({ status: true, content: 'Datos actualizados correctamente.' });
            setLoading(false);
        }).catch((error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setLoading(false);
        });
    }

    const calculateTotal = () => {
        let formData = form.getFieldsValue();
        let total = parseFloat(formData?.subtotal) + parseFloat(formData?.shippingPrice) + parseFloat(formData?.taxPrice);
        form.setFieldsValue({ total: parseFloat(total).toFixed(2) })
    }

    const columnsItems = [
        {
            title: "SKU", dataIndex: 'image', key: 'image', width: 200,
            render: (value, record, index) =>
                <Text style={{ width: 200 }} ellipsis={{ tooltip: record?.sku }}>{record?.sku}</Text>
        },
        {
            title: () => (
                <Text>SKU FBA <Tooltip placement="bottom" title={'El SKU que se encuentra en FBA para el item solicitado en la orden de venta. Sabemos que pueden ser diferentes los SKUs entre los marketplaces.'}><InfoCircleOutlined style={{ color: 'black' }} /></Tooltip></Text>
            ),
            dataIndex: 'image', key: 'image', width: 300,
            render: (value, record, index) =>
                <>
                    {isReadOnly ?
                        <Text style={{ width: 300 }} ellipsis={{ tooltip: record?.sellerSku }}>{record?.sellerSku}</Text> :
                        <>
                            <Item rules={[{ required: true }]} name={['orderItems', index, 'sellerSku']}>
                                <Select loading={loadingListingsAndProducts} style={{ width: '100%', marginTop: 15 }}
                                    showSearch filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    } disabled={disabled}>
                                    {productsToMatchOnFBA?.map((item, index) => {
                                        return <Option key={index} value={item.sku}>{item?.sku}</Option>
                                    })}
                                </Select>
                            </Item>
                            <Item hidden name={['orderItems', index, 'sku']}><Input /></Item>
                            <Item hidden name={['orderItems', index, 'quantity']}><Input /></Item>
                            <Item hidden name={['orderItems', index, 'title']}><Input /></Item>
                        </>
                    }
                </>
        },
        {
            title: "Title", dataIndex: 'image', key: 'image', width: 190,
            render: (value, record) => <Text style={{ width: 190 }} ellipsis={{ tooltip: record?.title }}>{record?.title}</Text>
        },
        {
            title: "Quantity Ordered", dataIndex: 'quantity', key: 'quantity', width: 160,
            render: (value, record) => <Text>{`${record?.quantity || 0}`}</Text>
        },
        // {
        //     title: () => (
        //         <Text>Order ItemId <Tooltip placement="bottom" title={'Un identificador de artículo de pedido de cumplimiento que crea el vendedor para realizar un seguimiento de los artículos de pedido de cumplimiento. Se utiliza para eliminar la ambigüedad de varios artículos de cumplimiento que tienen el mismo SellerSKU. Por ejemplo, el vendedor puede asignar diferentes valores de SellerFulfillmentOrderItemId a dos artículos en un pedido de cumplimiento que comparten el mismo SellerSKU pero tienen diferentes valores de GiftMessage.'}><InfoCircleOutlined style={{ color: 'black' }} /></Tooltip></Text>
        //     ),
        //     dataIndex: '-', key: '-', width: 300,
        //     render: (value, record, index) => <>
        //         {isReadOnly ?
        //             <Text>{record?.orderItemId || ''}</Text> :
        //             <Item rules={[{ required: true }]} name={['orderItems', index, 'sellerFulfillmentOrderItemId']}>
        //                 <Input style={{ width: "100%", marginTop: 15 }} maxLength={50} disabled={disabled} />
        //             </Item>
        //         }
        //     </>
        // },
        {
            title: "Price", dataIndex: 'price', key: 'price', width: 140,
            render: (value, record) => <Text>{`${record?.itemPrice?.currencyCode || 'USD'} ${record?.itemPrice?.amount || 0}`}</Text>
        },
        {
            title: "Tax", dataIndex: 'tax', key: 'tax', width: 130,
            render: (value, record) => <Text>{`${record?.itemTax?.currencyCode || 'USD'} ${record?.itemTax?.amount || 0}`}</Text>
        },
        {
            title: "Total", dataIndex: 'x', key: 'x', width: 80,
            render: (value, record) => <Text>{`${(parseFloat(record?.itemPrice?.amount) + parseFloat(record?.itemTax?.amount))?.toFixed(2) * record?.quantity || 0} `}</Text>
        },
    ]

    const formItemLayout = {
        labelCol: {
            span: 0,
        },
        wrapperCol: {
            span: 22,
        },
        layout: "vertical"
    }

    return (
        <div id="datosCuentaBanco">
            <Modal title={`Orden de venta ${order?.orderId || ''}`}
                visible={isModalVisible.state}
                onCancel={handleCancelModal}
                width={1200}
                centered
                destroyOnClose
                footer={footerButtons}>
                {
                    loadingItems ?
                        <div className="generic-spinner">
                            < Skeleton active />
                        </div > :
                        <Row>
                            {!['FBA', 'FBM'].includes(order?.fulfillmentChannel) ?
                                <Col span={24}>
                                    <Title level={2}>Próximamente</Title>
                                </Col> :
                                <>
                                    <Col span={5} xs={5} sm={5} md={5}>
                                        <Row><Text style={{ fontSize: "22px", marginBottom: "15px" }}>Detalles</Text></Row>
                                        <Row> <Text style={{ fontSize: "20px", color: "grey" }}>Fecha</Text></Row>
                                        <Row>
                                            <Col>
                                                <CalendarOutlined />
                                            </Col>
                                            <Text style={{ marginLeft: "5px" }}>{new Date(order?.purchaseDate)?.toLocaleString()}</Text>
                                        </Row>
                                        <Divider style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #ccc", margin: "1em 0", padding: 0 }} />
                                        <Text style={{ fontSize: "20px", color: "grey" }}>Estado</Text>
                                        <Row >
                                            {!order?.statusDetails[`${orderSaleStates.CANCELED}`] &&
                                                <>
                                                    <Col style={{ marginTop: "5px" }} span={24}>
                                                        {!order?.statusDetails[`${orderSaleStates.PAID}`] ?
                                                            <Loading3QuartersOutlined style={{ color: "grey", marginRight: "5px" }} /> :
                                                            <CheckCircleOutlined style={{ color: "green", marginRight: "5px" }} />
                                                        }
                                                        <Text>Pago</Text>
                                                    </Col>
                                                    <Col style={{ marginTop: "5px" }} span={24}>
                                                        {!order?.statusDetails[`${orderSaleStates.UNSHIPPED}`] ?
                                                            <Loading3QuartersOutlined style={{ color: "grey", marginRight: "5px" }} /> :
                                                            <CheckCircleOutlined style={{ color: "green", marginRight: "5px" }} />
                                                        }
                                                        <Text>Listo para enviar</Text>
                                                    </Col>
                                                    <Col style={{ marginTop: "5px" }} span={24}>
                                                        {!order?.statusDetails[`${orderSaleStates.SHIPPED}`] ?
                                                            <Loading3QuartersOutlined style={{ color: "grey", marginRight: "5px" }} /> :
                                                            <CheckCircleOutlined style={{ color: "green", marginRight: "5px" }} />
                                                        }
                                                        <Text >Enviado</Text>
                                                    </Col>
                                                </>
                                            }
                                            {order?.statusDetails[`${orderSaleStates.CANCELED}`] &&
                                                <Col style={{ marginTop: "5px" }} span={24}>
                                                    {!order?.statusDetails[`${orderSaleStates.CANCELED}`] ?
                                                        <Loading3QuartersOutlined style={{ color: "grey", marginRight: "5px" }} /> :
                                                        <CheckCircleOutlined style={{ color: "green", marginRight: "5px" }} />
                                                    }
                                                    <Text>Cancelado</Text>
                                                </Col>
                                            }
                                        </Row>
                                        <Divider style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #ccc", margin: "1em 0", padding: 0 }} />
                                        <Text style={{ fontSize: "20px", color: "grey" }}>Preferencia de envio</Text>
                                        <Row style={{ marginTop: "5px" }}>
                                            <Col>
                                                <FormOutlined style={{ marginRight: "5px" }} />
                                            </Col>
                                            <Text>{order?.orderType || 'n/a'}</Text>
                                        </Row>
                                        <Divider style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #ccc", margin: "1em 0", padding: 0 }} />
                                        <Text style={{ fontSize: "20px", color: "grey" }}>Direccion de envío</Text>
                                        <Row style={{ flexFlow: "no-wrap" }}>
                                            <Col span={2}><EnvironmentFilled /></Col>
                                            <Col span={18}>
                                                <Text >City: {order?.destinationAddress?.city || 'n/a'} </Text><br />
                                                <Text >Country Code: {order?.destinationAddress?.countryCode || 'n/a'}</Text><br />
                                                <Text >Postal Code: {order?.destinationAddress?.postalCode || 'n/a'}</Text><br />
                                                <Text >State Or Region: {order?.destinationAddress?.stateOrProvince || 'n/a'} </Text><br />
                                                {order?.destinationAddress?.address1 && <><Text >Dirección 1: {order?.destinationAddress?.address1} </Text><br /></>}
                                                {order?.destinationAddress?.address2 && <><Text >Dirección 2: {order?.destinationAddress?.address2} </Text><br /></>}
                                                {order?.destinationAddress?.address3 && <><Text >Dirección 3: {order?.destinationAddress?.address3} </Text><br /></>}
                                                {order?.destinationAddress?.phone && <><Text >Teléfono: {order?.destinationAddress?.phone} </Text></>}
                                            </Col>
                                        </Row>
                                        {(order?.buyerInfo?.name || order?.buyerInfo?.username || order?.buyerInfo?.email) &&
                                            <>
                                                <Divider style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #ccc", margin: "1em 0", padding: 0 }} />
                                                <Text style={{ fontSize: "20px", color: "grey" }}>Sold to</Text>
                                                <Row>
                                                    <Col span={2}>
                                                        <SmileFilled style={{ color: "grey" }} />
                                                    </Col>
                                                    <Col span={18}>
                                                        {order?.buyerInfo?.name && <Text style={{ marginLeft: "5px", width: 200, textTransform: "capitalize" }} ellipsis={{ tooltip: order?.buyerInfo?.name }}> {order?.buyerInfo?.name}</Text>}
                                                        {order?.buyerInfo?.username && <Text style={{ marginLeft: "5px", width: 200 }} ellipsis={{ tooltip: order?.buyerInfo?.username }}> {order?.buyerInfo?.username}</Text>}
                                                        {order?.buyerInfo?.email && <Text style={{ marginLeft: "5px", width: 200 }} ellipsis={{ tooltip: order?.buyerInfo?.email }}> {order?.buyerInfo?.email}</Text>}
                                                    </Col>
                                                </Row>
                                            </>
                                        }
                                        <Divider style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #ccc", margin: "1em 0", padding: 0 }} />
                                        <Text style={{ fontSize: "20px", color: "grey" }}>Canal de venta</Text>
                                        <Row>
                                            <Col>
                                                <ShoppingFilled style={{ color: "grey" }} />
                                            </Col>
                                            <Text style={{ marginLeft: "5px" }}>{order?.salesChannel || 'n/a'}</Text>
                                        </Row>
                                        <Divider style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #ccc", margin: "1em 0", padding: 0 }} />
                                    </Col>
                                    <Col span={1} xs={1} sm={1} md={1}></Col>
                                    <Col span={18} xs={18} sm={18} md={18}>
                                        {order?.shipment?.errors?.length > 0 &&
                                            <Alert style={{ marginBottom: 20 }}
                                                message={<Text>{`Debe crear el cumplimiento de manera manual debido a los siguientes errores ocurridos al intentar de manera automática.`}</Text>}
                                                description={order?.shipment?.errors.map(error => <><Text key={error}>{error}</Text><br /></>)}
                                                type="warning" showIcon />
                                        }
                                        <Text style={{ fontSize: "22px", }}>Items</Text>
                                        <Form form={form} {...formItemLayout} onFinish={doFulfillmentOutbound}>
                                            <Item hidden name={['id']} >
                                                <Input hidden />
                                            </Item>
                                            <Table
                                                className="home-listing-table"
                                                columns={columnsItems}
                                                dataSource={order?.orderItems?.map((item, index) => ({ ...item, key: index }))}
                                                pagination={false}
                                                size="small"
                                                scroll={{ x: 1300 }}
                                            />
                                            <Row style={{ justifyContent: "flex-end", marginTop: "10px", marginBottom: "10px" }}>
                                                <Col style={{ width: "220px" }}>
                                                    <Row style={{ justifyContent: "space-between", wrap: "nowrap" }}>
                                                        <Text>Subtotal</Text>
                                                        <Item style={{ marginBottom: "0" }} name={'subtotal'}>
                                                            <InputNumber precision={2} min="0" disabled
                                                                style={{ width: 120, marginLeft: "4px" }} onChange={calculateTotal}
                                                                formatter={value => `USD ${value}`} parser={value => parseFloat(value.replace('USD', ''))} />
                                                        </Item>
                                                    </Row>
                                                    {form.getFieldValue('shippingPrice') > 0 && <>
                                                        <Divider style={{ margin: "10px 0 5px 0" }} />
                                                        <Row style={{ justifyContent: "space-between", wrap: "nowrap" }}>
                                                            <Text>Shipping</Text>
                                                            <Item style={{ marginBottom: "0" }} rules={[{ required: true }]} name={'shippingPrice'}>
                                                                <InputNumber disabled onChange={calculateTotal}
                                                                    formatter={value => `USD ${value}`} parser={value => parseFloat(value.replace('USD', ''))}
                                                                    style={{ width: 120, marginLeft: "4px" }} precision={2} min="0"
                                                                />
                                                            </Item>
                                                        </Row>
                                                    </>}
                                                    {form.getFieldValue('taxPrice') > 0 && <>
                                                        <Divider style={{ margin: "10px 0 5px 0" }} />
                                                        <Row style={{ justifyContent: "space-between" }}>
                                                            <Text>Tax</Text>
                                                            <Item style={{ marginBottom: "0" }} rules={[{ required: true }]} name={'taxPrice'}>
                                                                <InputNumber disabled onChange={calculateTotal}
                                                                    style={{ width: 120, marginLeft: "4px" }} precision={2} min="0"
                                                                    formatter={value => `USD ${value}`} parser={value => parseFloat(value.replace('USD', ''))}
                                                                />
                                                            </Item>
                                                        </Row>
                                                    </>}
                                                    {form.getFieldValue('discount') > 0 && <>
                                                        <Divider style={{ margin: "10px 0 5px 0" }} />
                                                        <Row style={{ justifyContent: "space-between" }}>
                                                            <Text>Descuento</Text>
                                                            <Item style={{ marginBottom: "0" }} rules={[{ required: true }]} name={'discount'}>
                                                                <InputNumber disabled onChange={calculateTotal}
                                                                    style={{ width: 120, marginLeft: "4px" }} precision={2} min="0"
                                                                    formatter={value => `USD ${value}`} parser={value => parseFloat(value.replace('USD', ''))}
                                                                />
                                                            </Item>
                                                        </Row>
                                                    </>}
                                                    <Divider style={{ margin: "10px 0 5px 0" }} />
                                                    <Row style={{ justifyContent: "space-between" }}>
                                                        <Text>Total</Text>
                                                        <Item style={{ marginBottom: "0" }} name={'total'}>
                                                            <InputNumber disabled
                                                                precision={2} min="0" style={{ width: 120, marginLeft: "4px" }}
                                                                formatter={value => `USD ${value}`} parser={value => parseFloat(value.replace('USD', ''))} />
                                                        </Item>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Divider style={{ margin: "10px 0 5px 0" }} />

                                            <FormByFulfillmentType isReadOnly={isReadOnly}
                                                cancelFBAFulfillmentOutbound={cancelFBAFulfillmentOutbound}
                                                order={order} loadingShippment={loadingShippment}
                                                loadingSendFulfillment={loadingSendFulfillment}
                                                loadingUpdateFBA={loadingUpdateFBA}
                                                loadingCancelFBA={loadingCancelFBA}
                                                isModalVisible={isModalVisible}
                                                disabled={disabled} form={form} />
                                            <Row style={{ marginTop: 20 }}>
                                                <Row>
                                                    <Text style={{ fontSize: "22px", }}>Notas</Text>
                                                </Row>
                                                <Row>
                                                    <FormOutlined style={{ marginLeft: "7px", marginTop: "10px", fontSize: "14px" }} />
                                                </Row>
                                            </Row>
                                            <Row>
                                                <Item style={{ width: "100%" }} name={['note']} >
                                                    <TextArea rows={3} />
                                                </Item>
                                            </Row>
                                        </Form>
                                    </Col>
                                </>
                            }
                        </Row>
                }
            </Modal >
        </div >
    )
};

export default FulfillmentModal;