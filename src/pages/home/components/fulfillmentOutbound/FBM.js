import React, { useState } from 'react';
import { Button, Row, Col, Form, Select, Input, Typography, Tooltip, InputNumber } from 'antd';
// import { useTranslation } from 'react-i18next';
import {
    InfoCircleOutlined, SearchOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import SenderAddressModal from '../SenderAddressModal';
import orderSalesApi from '../../../../api/order-sales';
import FulfillmentShipmentsTable from './FulfillmentShipmentsTable';

const { Item } = Form;
const { Option } = Select;
const { Text } = Typography;

const FBM = ({ form, order, isModalVisible,loadingShippment }) => {
    // const { t } = useTranslation();
console.log('pasa a tab FBM')
    const [canSendFBM, setCanSendFBM] = useState(false); // V2 
    const [senderAddresses, setSenderAddresses] = useState([]);
    const [shippingServices, setShippingServices] = useState([]);
    const [loadingSenderAddress, setLoadingSenderAddress] = useState(false);
    const [loadingShippingServices, setLoadingShippingServices] = useState(false);
    const [isSenderAddressModalVisible, setIsSenderAddressModalVisible] = useState({ state: false, data: [] });

    const handleSendAddress = () => {
        setIsSenderAddressModalVisible({ state: true, data: senderAddresses || [] })
    }

    const handleSearchCarrier = () => {
        let formData = form.getFieldsValue();
        setLoadingShippingServices(true);
        let values = {
            partnerId: isModalVisible?.order?.partnerId,
            marketplace: 'Amazon',
            body: {
                ShipmentRequestDetails: {
                    AmazonOrderId: order?.orderId,
                    ItemList: order?.orderItems?.map(item => ({
                        OrderItemId: item.OrderItemId,
                        Quantity: item.QuantityOrdered,
                    })),
                    ShipFromAddress: JSON.parse(formData?.Address),
                    PackageDimensions: formData?.PackageDimensions,
                    Weight: formData?.Weight,
                    ShippingServiceOptions: formData.ShippingServiceOptions
                }
            }
        }
        orderSalesApi.getShipmentServices(values).then((res) => {
            setShippingServices(res?.data?.ShippingServiceList);
            setLoadingShippingServices(false);
        }).catch((error) => {
            setLoadingShippingServices(false);
        });
    }

    const getSenderAddress = () => {
        setLoadingSenderAddress(true);
        let values = {
            partnerId: isModalVisible?.order?.partnerId,
            marketplace: 'Amazon',
        }
        orderSalesApi.getSenderAddressByMarketplace(values).then((res) => {
            setSenderAddresses(res.data);
            setLoadingSenderAddress(false);
        }).catch((error) => {
            setLoadingSenderAddress(false);
        });
    }

    const unitOfLength = (
        <Select name="Unit" placeholder="Unit">
            <Option value="inches">Inches</Option>
            <Option value="centimeters">Centimeters</Option>
        </Select >
    );

    const unitOfWeight = (
        <Select name="Unit" placeholder="Unit">
            <Option value="oz">Ounces</Option>
            <Option value="g">Grams</Option>
        </Select >
    );

    const deliveryExperience = (
        <Select name="DeliveryExperience" placeholder="Delivery Experience">
            <Option value="DeliveryConfirmationWithAdultSignature">Delivery confirmation with adult signature</Option>
            <Option value="DeliveryConfirmationWithSignature">Delivery confirmation with signature. Required for DPD (UK)</Option>
            <Option value="DeliveryConfirmationWithoutSignature">Delivery confirmation without signature</Option>
            <Option value="NoTracking">No tracking: No delivery confirmation</Option>
        </Select >
    );

    let carrierWillPickUpDescription = `When true, the carrier will pick up the package.\nNote: Scheduled carrier pickup is available only using Dynamex (US), DPD (UK), and Royal Mail (UK).`;
    const carrierWillPickUp = (
        <Select name="CarrierWillPickUp" placeholder="Carrier will pick up"
            allowClear suffixIcon={<Tooltip title={carrierWillPickUpDescription}><InfoCircleOutlined style={{ color: 'black' }} /></Tooltip>}>
            <Option value={true}>Delivery confirmation with adult signature</Option>
            <Option value={false}>No delivery confirmation</Option>
        </Select >
    );

    let carrierWillPickUpOptionDescription = `Carrier will pick up option.`;
    const carrierWillPickUpOption = (
        <Select name="CarrierWillPickUp" placeholder="Carrier will pick up option"
            allowClear suffixIcon={<Tooltip title={carrierWillPickUpOptionDescription}><InfoCircleOutlined style={{ color: 'black' }} /></Tooltip>}>
            <Option value={'CarrierWillPickUp'}>The carrier will pick up the package</Option>
            <Option value={'ShipperWillDropOff'}>The seller is responsible for arranging pickup or dropping off the package to the carrier</Option>
            <Option value={'NoPreference'}>No preference</Option>
        </Select >
    );

    return (
        <>
            {canSendFBM &&
                <>

                    <Text style={{ fontSize: "22px", }}>Shipment</Text>
                    <Row>
                        <Item hidden name={['id']} >
                            <Input hidden />
                        </Item>
                        <Col span={16}>
                            <Item name={["Address"]} style={{ width: '100%' }} label={'SHIPPED FROM'} >
                                <Select // onChange={(value) => { handleStateChange(value) }}
                                    filterOption={(input, option) =>
                                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    } showSearch={true}>
                                    {senderAddresses?.map((address, index) => (
                                        <Option key={index} value={JSON.stringify(address)}>{address?.name}</Option>
                                    ))}
                                </Select>
                            </Item>
                        </Col>
                        <Col span={8} >
                            <Button style={{ marginTop: 30 }} onClick={handleSendAddress}>Agregar / Editar</Button>
                        </Col>
                    </Row>
                    <Text style={{ fontSize: 14 }}>PACKAGE DIMENSIONS</Text>
                    <Row >
                        <Col span={16}>
                            <Row>
                                <Col span={5} >
                                    <Item rules={[{ required: true }]} name={['PackageDimensions', 'Width']} >
                                        <InputNumber min={0} style={{ width: '100%' }} placeholder={'Width'} />
                                    </Item></Col>
                                <Col span={5} >
                                    <Item rules={[{ required: true }]} name={['PackageDimensions', 'Length']} >
                                        <InputNumber min={0} style={{ width: '100%' }} placeholder={'Length'} />
                                    </Item></Col>
                                <Col span={5} >
                                    <Item rules={[{ required: true }]} name={['PackageDimensions', 'Height']} >
                                        <InputNumber min={0} style={{ width: '100%' }} placeholder={'Height'} />
                                    </Item></Col>
                                <Col span={8} style={{ width: '100%' }}>
                                    <Item rules={[{ required: true }]} name={['PackageDimensions', 'Unit']} >
                                        {unitOfLength}
                                    </Item></Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={7}>
                            <Row>
                                <Col span={11}>
                                    <Item rules={[{ required: true }]} name={['Weight', 'Value']} >
                                        <InputNumber min={0} style={{ width: '100%' }} placeholder={'Weight'} />
                                    </Item></Col>
                                <Col span={11}>
                                    <Item rules={[{ required: true }]} name={['Weight', 'Unit']} >
                                        {unitOfWeight}
                                    </Item></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Text style={{ fontSize: 14 }}>SHIPPING SERVICE OPTIONS	</Text>
                            <Row>
                                <Col span={7} >
                                    <Item rules={[{ required: true }]} style={{ width: "100%" }}
                                        name={['ShippingServiceOptions', 'DeliveryExperienceType']}>
                                        {deliveryExperience}
                                    </Item>
                                </Col>
                                <Col span={7} >
                                    <Item rules={[{ required: true }]} style={{ width: "100%" }}
                                        name={['ShippingServiceOptions', 'CarrierWillPickUp']}>
                                        {carrierWillPickUp}
                                    </Item>
                                </Col>
                                <Col span={9} >
                                    <Item rules={[{ required: true }]} style={{ width: "100%" }}
                                        name={['ShippingServiceOptions', 'CarrierWillPickUpOption']}>
                                        {carrierWillPickUpOption}
                                    </Item></Col>
                            </Row>
                        </Col>
                        <Col span={1} />
                        <Col span={7} >
                            <Text style={{ fontSize: 14 }}>CARRIER</Text>
                            <Row >
                                <Col span={18}>
                                    <Item rules={[{ required: true }]} name={['ShippingService']}>
                                        <Select style={{ width: "100%" }} disabled={!shippingServices || shippingServices?.length === 0}
                                            // onChange={(value) => { handleStateChange(value) }}
                                            // filterOption={(input, option) =>
                                            //     option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            // }
                                            loading={loadingShippingServices} showSearch={true}>
                                            {shippingServices?.map((spservice, index) => (
                                                <Option key={index} value={JSON.stringify(spservice)}>{spservice?.ShippingServiceName}</Option>
                                            ))}
                                        </Select>
                                    </Item>
                                </Col>
                                <Col span={5} >
                                    <Tooltip title="Buscar carrier">
                                        <Button onClick={handleSearchCarrier} icon={<SearchOutlined />} />
                                    </Tooltip>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <SenderAddressModal form={form} setSenderAddresses={setSenderAddresses}
                        isModalVisible={isSenderAddressModalVisible} setModalVisible={setIsSenderAddressModalVisible} />
                </>
            }
            <FulfillmentShipmentsTable order={order} loadingShippment={loadingShippment} />
        </>
    )
};

export default React.memo(FBM);