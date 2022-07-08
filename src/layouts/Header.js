import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import newLogo from '../assets/LAP_Marketplace.jpg';
import { nameToSlug } from '../utils/functions';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Headers = ({widthMenu}) => {

    const margin = {
        marginTop: widthMenu.marginTop,
        marginLeft: widthMenu.marginLeft,
    }

    return (
        <div style={{ display: 'inline-flex', width: '100%' }}>
            <div className="logo LayoutHeaderLogo" style={margin} >
                <Link to="/" >
                    <img src={newLogo} className="logo" alt="logo de LAP MKT" height={widthMenu.widthLogo} />
                </Link>
            </div>
        </div>
    )
}

export default Headers