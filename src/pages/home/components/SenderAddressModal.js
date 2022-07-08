import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Row, Col, Space, Divider, Form, Input, Select, Table, InputNumber, Skeleton, Typography } from 'antd';
import {
    SaveFilled, EditOutlined, CloseOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import orderSalesApi from '../../../api/order-sales';

const { Text } = Typography;
const { Item } = Form;
const { Option } = Select;

const SenderAddressModal = ({ isModalVisible, setModalVisible, setSenderAddress }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingSenderAddress, setLoadingSenderAddress] = useState(false);
    const [order, setOrder] = useState();
    const [btnUpdate, setBtnUpdate] = useState(false);
    const [stateCodes, setStateCodes] = useState([]);
    const [loadingStateCodes, setLoadingStateCodes] = useState(false);
    const session = useSelector(store => store.Session.session);

    const handleSave = () => {
        setLoading(true);
        //console.log("El form a guardar: ", form);
        setTimeout(() => {
            console.log("HAciendo el save");
        }, 2000);
        setLoading(false);
    }

    useEffect(() => {
        form.setFieldsValue({ countryCode: 'US' })
        handleCountryCode('US');
    }, [])

    const doCreateOrUpdateAddress = async (values) => {
        values.partnerId = !session?.userInfo?.isAdmin ? session?.userInfo?.commercial_partner_id[0] : null
        if (values?.id) {
            setLoadingSenderAddress(true);
            let res = await orderSalesApi.createSenderAddress(values);

            console.log('addres create', res)
            setLoadingSenderAddress(false);
        } else {
            createAddress(values);
        }
        setBtnUpdate(false);
    }

    const updateAddress = (address) => {
        setLoadingSenderAddress(true);
        orderSalesApi.createSenderAddress(address).then((res) => {
            console.log('addres update', res.data)
            if (res?.data?.success) {
                let index = isModalVisible?.data?.indexOf(e => e.id === address.id);
                if (index !== -1) {
                    let newSenderAddress = isModalVisible?.data;
                    newSenderAddress[index] = address;
                    setModalVisible({ ...isModalVisible, data: newSenderAddress });
                }
            }
            form.resetFields();
            setLoadingSenderAddress(false);
        }).catch((error) => {
            setLoadingSenderAddress(false);
        });
    }

    const createAddress = async (address) => {
        setLoadingSenderAddress(true);
        let res = await orderSalesApi.createSenderAddress(address);
        if (res?.data) {
            address.id = res.data;
            setModalVisible({ ...isModalVisible, data: [...isModalVisible?.data, address.id] });
        }
        console.log('addres create', res)
        form.resetFields();
        setLoadingSenderAddress(false);
    }


    const deleteAddress = (address) => {
        setLoadingSenderAddress(true);
        orderSalesApi.deleteSenderAddress(address).then((res) => {
            console.log('addres delete', res.data)
            if (res?.data?.success) {
                let index = isModalVisible?.data?.indexOf(e => e.id === address.id);
                if (index !== -1) {
                    setModalVisible({ ...isModalVisible, data: isModalVisible?.data?.split(index, 1) });
                }
            }
            setLoadingSenderAddress(false);
        }).catch((error) => {
            setLoadingSenderAddress(false);
        });
    }

    const handleCancel = () => {
        setModalVisible({ state: false, data: [] });
    }

    const columns = [
        {
            title: "Nombre", dataIndex: 'name', key: 'name', width: 120,
            render: (value, record) => <Text ellipsis={{ tooltip: value }}>{value}</Text>
        },
        {
            title: "Dirección", dataIndex: 'address', key: 'address', width: 120,
            render: (value, record) => <Text style={{ width: 120 }} ellipsis={{ tooltip: value }}>{value}</Text>
        },
        {
            title: "Email", dataIndex: 'email', key: 'email', width: 190,
            render: (value, record) => <Text style={{ width: 190 }} ellipsis={{ tooltip: value }}>{value}</Text>
        },
        {
            title: "Ciudad", dataIndex: 'city', key: 'city', width: 30,
            render: (value, record) => <Text ellipsis={{ tooltip: value }}>{value}</Text>
        },
        {
            title: "Código postal", dataIndex: 'postalCode', key: 'postalCode', width: 40,
            render: (value, record) => <Text ellipsis={{ tooltip: value }}> {value} </Text>
        },
        {
            title: "Código de país", dataIndex: 'countryCode', key: 'countryCode', width: 40,
            render: (value, record) => <Text ellipsis={{ tooltip: value }}> {value} </Text>
        },
        {
            title: "Teléfono", dataIndex: 'phone', key: 'phone', width: 130,
            render: (value, record) => <Text ellipsis={{ tooltip: value }}>{value}</Text>
        },
        {
            title: "State", dataIndex: 'stateOrProvinceCode', key: 'stateOrProvinceCode', width: 130,
            render: (value, record) => <Text>{value}</Text>
        },
        {
            title: "Acciones", dataIndex: '-', key: '-',
            render: (value, record) => <Row >
                <Col>
                    <Space>
                        <Button
                            type="text" disabled={!session?.userInfo?.isAdmin && !record.partnerId}
                            onClick={() => { form.setFieldsValue(record); setBtnUpdate(true); }}
                            icon={<EditOutlined style={{ fontSize: '16px' }} />}
                            style={{ width: 85, color: !session?.userInfo?.isAdmin && !record.partnerId ? 'grey' : 'blue' }}>
                            Actualizar
                        </Button>
                        <Button type="text" disabled={!session?.userInfo?.isAdmin && !record.partnerId}
                            onClick={() => deleteAddress(record)}
                            icon={<CloseOutlined style={{ fontSize: '16px' }} />}
                            style={{ width: 85, color: !session?.userInfo?.isAdmin && !record.partnerId ? 'grey' : 'red' }}>
                            Eliminar
                        </Button>
                    </Space>
                </Col>
            </Row>
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
    const handleCountryCode = (value) => {
        setLoadingStateCodes(true);
        orderSalesApi.getStateOrProvinceCode(value).then((res) => {
            setStateCodes(res.data);
            setLoadingStateCodes(false);
        }).catch((error) => {
            setLoadingStateCodes(false);
        });
    }

    const countryCodes = (
        <Select defaultValue="US" onChange={handleCountryCode}>
            <Option value="CA">Canada</Option>
            <Option value="US">United States of America</Option>
            <Option value="MX">Mexico</Option>
        </Select >
    );

    return (
        <Modal title="Dirección del Remitente"
            visible={isModalVisible?.state}
            onCancel={handleCancel}
            width={1200}
            centered
            destroyOnClose
            footer={[
                <Button
                    key="cancel"
                    disabled={loading}
                    onClick={handleCancel}>
                    Cerrar
                </Button>
            ]}>
            <Form form={form} {...formItemLayout} onFinish={doCreateOrUpdateAddress}>
                <Row>
                    <Item hidden name="id">
                        <Input hidden={true} />
                    </Item>
                    <Col span={8}>
                        <Item rules={[{ required: true }]} label={'Nombre'} name="name">
                            <Input />
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item rules={[{ required: true }]} label={'Dirección'} name="address">
                            <Input />
                        </Item>
                    </Col>
                    <Col span={8}>
                        <Item rules={[{ required: true }]} label={'Email'} name="email">
                            <Input />
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={4}>
                        <Item rules={[{ required: true }]} label={'Ciudad'} name="city">
                            <Input />
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item rules={[{ required: true }]} label={'Código Postal'} name="postalCode">
                            <Input />
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item rules={[{ required: true }]} label={'Código País'} name="countryCode">
                            {countryCodes}
                        </Item>
                    </Col>
                    <Col span={4}>
                        <Item rules={[{ required: true }]} label={'Código Estado/Provincia'} name="stateOrProvinceCode">
                            <Select loading={loadingStateCodes}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } showSearch={true}>
                                {stateCodes?.map((st, index) => (
                                    <Option key={index} value={st?.code}>{st?.state}</Option>
                                ))}
                            </Select >
                        </Item>
                    </Col>
                    <Col span={5}>
                        <Item rules={[{ required: true }]} label={'Teléfono'} name="phone">
                            <Input />
                        </Item>
                    </Col>
                    <Col span={3}>
                        {btnUpdate ?
                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                                style={{ width: '100%', marginTop: 30 }} loading={loadingSenderAddress}   >
                                Actualizar
                            </Button> :
                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                                style={{ width: '100%', marginTop: 30 }} loading={loadingSenderAddress}   >
                                Agregar
                            </Button>
                        }
                    </Col>
                </Row>
                {loadingSenderAddress ?
                    <div className="generic-spinner">
                        <Skeleton active />
                    </div> :
                    <Row>
                        <Col span={24}>
                            <Text style={{ fontSize: "22px", }}>Direcciones</Text>
                            <Table
                                className="home-listing-table"
                                columns={columns}
                                dataSource={isModalVisible?.data?.map((item, index) => ({ ...item, key: index }))}
                                pagination={false}
                                size="small"
                                scroll={{ x: 800 }}
                            />
                        </Col>
                    </Row>
                }
            </Form>
        </Modal>
    )
};

export default SenderAddressModal;