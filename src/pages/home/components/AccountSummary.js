import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { SendOutlined } from '@ant-design/icons';
import { Button, Row, Col, Card, Tooltip } from 'antd';
import { BarChartOutlined, TagsOutlined, InboxOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const AccountSummary = ({ }) => {

    return (
        <Row className="home-account-summary-parent">
            <Col span={24} xs={24} sm={24} md={24}>
                <Card className="home-account-summary-card">
                    <Row>
                        <Col className="home-account-summary-card-column" span={8} xs={24} sm={24} md={24}>
                            <span className="home-account-summary-card-title"><BarChartOutlined className="btn-primary home-account-summary-card-title-icon"/>Resumen de la cuenta</span>
                            <span className="home-account-summary-card-title-description">Lorem Ipsum is simply dummy text of the printing and ...</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} xs={24} sm={24} md={24}>
                            <Row>
                                <Col xs={24} sm={12} md={12}>
                                    <Card className="home-account-summary-cell-sales-card">
                                        <p className="home-account-summary-cell-sales-card-item"><DollarOutlined className="home-account-summary-cell-listings-card-item-icon" />Total Sales</p>
                                    </Card>
                                    <Card className="home-account-summary-cell-orders-card">
                                        <p className="home-account-summary-cell-orders-card-item"><ShoppingCartOutlined className="home-account-summary-cell-listings-card-item-icon" />Total Orders</p>
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={12}>
                                    <Card className="home-account-summary-cell-listings-card">
                                        <p className="home-account-summary-cell-listings-card-item"><TagsOutlined className="home-account-summary-cell-listings-card-item-icon" />Total Listings</p>
                                    </Card>
                                    <Card className="home-account-summary-cell-products-card">
                                        <p className="home-account-summary-cell-products-card-item"><InboxOutlined className="home-account-summary-cell-listings-card-item-icon" />Total Products</p>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    )
};

export default React.memo(AccountSummary);