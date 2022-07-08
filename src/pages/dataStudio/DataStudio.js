import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Menu, Row, Col, Avatar, Layout } from 'antd';
import { UserOutlined, LeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Content, Sider } = Layout;
export const DataStudio = () => {
    
    const session = useSelector(store => store.Session.session);
    const { url } = useParams();

    return (
        <div className="content-div dataStudio">
            <Row>
            <iframe width="600" height="338" src={`https://datastudio.google.com/embed/u/0/reporting/${url}`}  />
            </Row>
        </div>
    )
}