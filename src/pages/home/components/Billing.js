import React from 'react';
import 'antd/dist/antd.css';
import { Button, Row, Col, Card } from 'antd';
import { ExportOutlined, BookOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';

const Billing = ({ }) => {

    return (
        <Row className="home-billing-parent">
            <Col span={24} xs={24} sm={24} md={24}>
                <Card className="home-billing-card">
                    <Row>
                        <Col span={8} xs={24} sm={12} md={18} >
                            <div className="home-billing-card-title">
                                <span className="home-billing-card-title-text"><BookOutlined className="btn-primary home-account-billing-card-title-icon" />Facturación</span>
                                <span className="home-billing-card-title-description">Lorem Ipsum is simply dummy text of the printing and ...</span>
                            </div>
                        </Col>
                        <Col span={6} xs={24} sm={12} md={6} className="home-billing-buttons">
                            <Button icon={<ExportOutlined />} className="btn-primary">Exportar</Button>
                        </Col>
                    </Row>
                    <Row className="home-billing-cell-parent">
                        {[...Array(4)].map((element, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <Card className="home-billing-cell-card">
                                    <span className="home-billing-cell-id"> {'12-02-2021 - #12345'}</span>
                                    <p className="home-billing-cell-title">Conceptos varios</p>
                                    <p className="home-billing-cell-amount">{'$12345'}</p>
                                    <div>
                                        <div className="home-billing-cell-status">
                                            <div>
                                                <span className="dot" />
                                                <span>Pendiente</span>
                                            </div>
                                            <Button className="home-billing-cell-button" icon={<VerticalAlignBottomOutlined />} type="text">Descargar</Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Row className="home-billing-cell-parent">
                        {[...Array(4)].map((element, index) => (
                            <Col xs={24} sm={12} md={6} key={index}>
                                <Card className="home-billing-cell-card">
                                    <span className="home-billing-cell-id"> {'12-02-2021 - #12345'}</span>
                                    <p className="home-billing-cell-title">Conceptos varios</p>
                                    <p className="home-billing-cell-amount">{'$12345'}</p>
                                    <div>
                                        <div className="home-billing-cell-status">
                                            <div>
                                                <span className="dot" />
                                                <span>Pendiente</span>
                                            </div>
                                            <Button className="home-billing-cell-button" icon={<VerticalAlignBottomOutlined />} type="text">Descargar</Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Col>
        </Row>
    )
};

export default React.memo(Billing);