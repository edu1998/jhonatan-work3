import React, { useState } from 'react';
import './analytics.css';
import 'antd/dist/antd.css';
import { useTranslation } from 'react-i18next';
import { Row, Col, Layout } from 'antd';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { FileTextFilled, LeftOutlined, UnorderedListOutlined, ExportOutlined, PlusOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import Sales from './components/Sales';
import Stock from './components/Stock';
import Marketing from './components/Marketing';
import Visits from './components/Visits';
import AnalyticsFilter from './components/AnalyticsFilter';
import DashboardTable from './components/DashboardTable';

export const Analytics = () => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    let partnerId = 1; // admin
    const isAdmin   = session.userInfo.isAdmin;
    if (!isAdmin) {
        partnerId = session.userInfo.commercial_partner_id[0]; 
    }
 
    return (
        <div className="content-div">            
            <Row>
                <Col xs={8} sm={8} md={4}>
                    <Link to="/" >
                        <LeftOutlined className="side-bar-icon-back" />
                    </Link>
                    <FileTextFilled className="icon-order-size" />
                </Col>
                <Col xs={16} sm={16} md={20} className="text-align-left">
                    <span className="font-size-20">{t('analytics.title')}</span><br />
                    <span>{t('analytics.subtitle')}</span>
                </Col>
            </Row>
        
            <Row>
                <Layout className="padding-layout" style={{ width: '100%' }}>
                    <div className="site-layout-background padding-layout-content content-padding" style={{ width: '100%' }}>
                        <Col span={24} xs={24} sm={24} md={24}>
                            <AnalyticsFilter isAdmin={isAdmin} partnerId={partnerId} /> 
                        </Col>
                    </div>
                </Layout>
            </Row>
            <Row>
            <Layout className="padding-layout" style={{ width: '100%' }}>
                    <div className="site-layout-background padding-layout-content content-padding" style={{ width: '100%' }}>
                        <Col span={24} xs={24} sm={24} md={24}>
                            <DashboardTable></DashboardTable>
                        </Col>
                    </div>
                </Layout>
            </Row>
        </div >
    )
}
