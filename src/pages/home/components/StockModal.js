import React, { useState } from 'react';
import { Modal, Button, Row, Col, Divider, Form, Input, Select } from 'antd';
import 'antd/dist/antd.css';

const { Item } = Form;
const { Option } = Select;

const StockModal = ({ isModalVisible, handleOk, handleCancel }) => {
    const [form] = Form.useForm();

    //estilo para alinear el formulario
    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 0,
        },
        layout: "vertical"
    }

    return (
        <div id="datosCuentaBanco">
            <Modal title="Stock" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
            // footer={[
            //     <Button key="back" onClick={this.handleCancel}>
            //       Return
            //     </Button>,
            //     <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            //       Submit
            //     </Button>,
            //     <Button
            //       key="link"
            //       href="https://google.com"
            //       type="primary"
            //       loading={loading}
            //       onClick={this.handleOk}
            //     >
            //       Search on Google
            //     </Button>,
            //   ]}
            >
                <Form name="formulario"
                    {...formItemLayout}
                    // onFinish={onFinish}
                    initialValues={{
                        prefix: '56',
                    }}
                    form={form}
                >
                    <Row gutter={[12, 2]}>
                        <Col span={24} >
                            <Item label="Listing"
                                name="listing"
                                rules={[{
                                    required: true,
                                    message: "Por favor seleccione un listing"
                                }]}
                            >
                                <Select placeholder="Seleccione un listing">
                                    <Option value="china">China</Option>
                                    <Option value="usa">U.S.A</Option>
                                </Select>
                            </Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 4]}>
                        <Col span={12} style={{ backgroundColor: '#F8F8F9', color: '#6F7D89' }}>
                            <span className="text-color-gray">Detalle del listing </span>
                            <Row className="listing-details">
                                <Col span={24} className="home-stock-modal-listing-column">
                                    <span>SKU</span>
                                    <span>No disponible</span>
                                </Col>
                            </Row>
                            <Row className="listing-details">
                                <Col span={24} className="home-stock-modal-listing-column">
                                    <span>CATEGORÍA</span>
                                    <span>No disponible</span>
                                </Col>
                            </Row>
                            <Row className="listing-details">
                                <Col span={24} className="home-stock-modal-listing-column">
                                    <span>PRECIO</span>
                                    <span>No disponible</span>
                                </Col>
                            </Row>
                            <Row className="listing-details">
                                <Col span={24} className="home-stock-modal-listing-column">
                                    <span>ACTIVO EN</span>
                                    <span>No disponible</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <span className="text-color-gray">Pedido de Actualización</span>
                            <Row className="listing-details">
                                <Col span={24} className="home-stock-modal-stock-order">
                                    <span>Stock actual</span>
                                    <span className="text-color-gray">No disponible</span>
                                </Col>
                            </Row>
                            <Row className="listing-details">
                                <Col span={24}>
                                    <Row>
                                        <Col span={12} className="home-stock-modal-stock-add">
                                            <span>Agregar stock</span>
                                            <span className="text-color-gray">No disponible</span>
                                        </Col>
                                        <Col span={12}>
                                            <Item className="home-stock-modal-stock-add-input"
                                                name="stock"
                                                rules={[{
                                                    required: true,
                                                    message: "Por favor ingresa stock"
                                                }]}
                                            >
                                                <Input className="home-stock-modal-stock-add-item-input" name="stock" type="number"/>
                                            </Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="listing-details">
                                <Col span={24} className="home-stock-modal-stock-result">
                                    <span>Resultado</span><br />
                                    <span className="text-color-gray">No disponible</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    )
};

export default React.memo(StockModal);