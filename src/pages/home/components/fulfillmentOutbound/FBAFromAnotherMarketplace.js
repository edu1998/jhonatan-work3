import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Form, Select, Input, Typography, Tooltip, Popconfirm, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import orderSalesApi from '../../../../api/order-sales';
import {
    PlusOutlined,
    MinusCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import FulfillmentShipmentsTable from './FulfillmentShipmentsTable';

const { Item } = Form;
const { Option } = Select;
const { Text } = Typography;

const FBAFromAnotherMarketplace = ({ order, disabled, loadingShippment, form, isReadOnly, loadingSendFulfillment, loadingCancelFBA, loadingUpdateFBA, cancelFBAFulfillmentOutbound }) => {
    const { t } = useTranslation();

    const [cancellationReason, setCancellationReason] = useState([]);
    const [cancellationReasonLoading, setCancellationReasonLoading] = useState(false);
    const [modalCancellationReason, setModalCancellationReason] = useState(false);

    useEffect(() => {
        if (modalCancellationReason) {
            setCancellationReasonLoading(true);
            orderSalesApi.getCancellationReason(order.marketplace).then((res) => {
                setCancellationReason(res.data);
                setCancellationReasonLoading(false);
            }).catch((error) => {
                setCancellationReasonLoading(false);
            });
        }
    }, [modalCancellationReason])

    const handleCancel = () => {
        if (['Walmart', 'Ebay'].includes(order.marketplace)) {
            setModalCancellationReason(true)
        } else {
            cancelFBAFulfillmentOutbound();
            setModalCancellationReason(false);
        }
    }

    const shippingSpeedCategory = (
        <Select name="shippingSpeedCategory" disabled={disabled}>
            <Option value="Standard">Standard shipping method.</Option>
            <Option value="Expedited">Expedited shipping method.</Option>
            <Option value="Priority">Priority shipping method.</Option>
            <Option value="ScheduledDelivery">Scheduled Delivery shipping method.</Option>
        </Select >
    );

    

    return (
        <>
            <Text style={{ fontSize: "22px", }}>Shipment</Text>
            {!['Completed'].includes(order?.orderFulfillmentStatus) &&
                <>
                    <Row>
                        <Col span={8}>
                            <Item
                                label={<Text>Seller Fulfillment Order <Tooltip placement="bottom" title={'Un identificador de pedido de cumplimiento que crea el vendedor para realizar un seguimiento de su pedido. Debe ser único. Si el sistema del vendedor ya crea identificadores de pedidos únicos, entonces estos pueden ser buenos valores para que los utilicen.'}><InfoCircleOutlined style={{ color: 'black' }} /></Tooltip></Text>}
                                rules={[{ required: true }]} name={['shipment', 'sellerFulfillmentOrderId']} >
                                <Input maxLength={40} disabled={disabled} />
                            </Item>
                        </Col>
                        <Col span={8}>
                            <Item name={['shipment', 'marketplaceId']} style={{ width: '100%' }}
                                rules={[{ required: true }]} label={<Text>Amazon Marketplace</Text>}>
                                <Select defaultValue={'ATVPDKIKX0DER'} bordered={true} disabled={disabled} >
                                    <Option value={'ATVPDKIKX0DER'}> United States of America </Option>
                                    <Option value={'A2EUQ1WTGCTBG2'}> Canada </Option>
                                    <Option value={'A1AM78C64UM0Y8'}> Mexico </Option>
                                </Select>
                            </Item>
                        </Col>
                        <Col span={8}>
                            <Item name={['shipment', 'shippingSpeedCategory']} style={{ width: '100%' }}
                                rules={[{ required: true }]} label={<Text>Shipping Speed Category</Text>} >
                                {shippingSpeedCategory}
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item
                                label={<Text>Notification Emails <Tooltip placement="bottom" title={'Direcciones de correo electrónico que Amazon utiliza para enviar notificaciones de envío completo a los destinatarios.'}><InfoCircleOutlined style={{ color: 'black' }} /></Tooltip></Text>}
                            >
                                <Form.List name="notificationEmails">
                                    {(fields, { add, remove }, { errors }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Item key={field?.key}>
                                                    <Item {...field} label={'Email'} validateTrigger={['onChange', 'onBlur']} noStyle>
                                                        <Input type="email" style={{ width: '80%' }} disabled={disabled} />
                                                    </Item>
                                                    {fields.length > 0 && !disabled ? (
                                                        <MinusCircleOutlined style={{ margin: '0 8px', color: '#999', fontSize: 20 }} className="dynamic-delete-button" onClick={() => remove(field.name)} />
                                                    ) : null}
                                                </Item>
                                            ))}
                                            {!disabled &&
                                                <Item>
                                                    <Button
                                                        type="dashed" onClick={() => add()}
                                                        style={{ width: '60%' }} icon={<PlusOutlined />} disabled={disabled}>
                                                        {t('onboarding.add')} email
                                                    </Button>
                                                </Item>
                                            }
                                        </>
                                    )}
                                </Form.List>
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Row>
                                <Col span={24}>
                                    <Item
                                        label={<Text>Displayable Order Comment <Tooltip placement="bottom" title={'Texto específico del pedido que aparece en materiales orientados al destinatario, como el albarán del envío saliente.'}><InfoCircleOutlined style={{ color: 'black' }} /></Tooltip></Text>}
                                        rules={[{ required: true }]} name={['shipment', 'displayableOrderComment']} >
                                        <Input.TextArea maxLength={1000} rows={2} showCount disabled={disabled} />
                                    </Item>
                                </Col>
                            </Row>
                            <Row justify="end">
                                {!disabled &&
                                    <Col >
                                        {!isReadOnly && ['None'].includes(order?.orderFulfillmentStatus) &&
                                            <Popconfirm placement="top" title={'Desea crear ésta orden de cumplimiento (Fulfillment Outbound) con FBA?'} onConfirm={() => form.submit()} okText={t('yes')} cancelText={t('no')}>
                                                <Button loading={loadingSendFulfillment} className="btn-link-filled">
                                                    {order?.orderStatus === "FBA" ? "Enviar" : "Crear orden"}
                                                </Button>
                                            </Popconfirm>
                                        }
                                        {!isReadOnly && ['New', 'Received'].includes(order?.orderFulfillmentStatus) &&
                                            <Popconfirm placement="top" title={'Desea actualizar ésta orden de cumplimiento (FBA)?'} onConfirm={() => form.submit()} okText={t('yes')} cancelText={t('no')}>
                                                <Button loading={loadingUpdateFBA} className="btn-link-filled" >Actualizar orden</Button>
                                            </Popconfirm>
                                        }
                                    </Col>
                                }
                                <Col>
                                    {['New', 'Received', 'Planning', 'Processing'].includes(order?.orderFulfillmentStatus)
                                        && ['Shipped', 'Unshipped'].includes(order?.orderStatus)
                                        && order?.shipment?.sellerFulfillmentOrderId
                                        && !isReadOnly
                                        && <Popconfirm placement="top" title={t('home.sale-order.confirmCancel')} onConfirm={handleCancel} okText={t('yes')} cancelText={t('no')}>
                                            <Button loading={loadingCancelFBA} className="btn-link-filled"
                                                style={{ marginLeft: 5 }} >Cancelar orden</Button>
                                        </Popconfirm>
                                    }
                                </Col>
                            </Row>
                            <Modal title="Motivo de cancelación de pedido" centered width={1000}
                                visible={modalCancellationReason}
                                onOk={() => {
                                    setModalCancellationReason(false)
                                    cancelFBAFulfillmentOutbound(form.getFieldValue('cancellationReasonCode'))
                                }}
                                onCancel={() => setModalCancellationReason(false)}>
                                <Item style={{ width: '100%' }} name={['cancellationReasonCode']}
                                    rules={[{ required: true }]} label={<Text>Motivo</Text>}>
                                    <Select loading={cancellationReasonLoading}>
                                        {cancellationReason?.map((rson, index) => (
                                            <Option value={rson.cancellationReasonCode} key={index}>{rson?.description?.es}</Option>
                                        ))}
                                    </Select>
                                </Item>
                            </Modal>
                        </Col>
                    </Row>
                </>
            }
            <FulfillmentShipmentsTable order={order} loadingShippment={loadingShippment}/>
        </>
    )
};

export default React.memo(FBAFromAnotherMarketplace);