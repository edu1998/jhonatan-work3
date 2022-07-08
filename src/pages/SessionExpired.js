import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'antd/dist/antd.css';
import { Row, Col, Button } from 'antd';
import session_expired from '../assets/clock.png';
import * as sessionActions from '../redux/session/action';

export const SessionExpired = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(sessionActions.logout());
        setTimeout(() => {
            window.location = '/login';
        }, 5000);
    }, []);

    return (
        <div className="content-div">
            <Row justify="center">
                <Col xs={24} sm={24} md={24} >
                    <img src={session_expired} style={{ maxHeight: 350, width: 'auto' }} />
                </Col>
                <Col xs={24} sm={24} md={24} style={{ paddingTop: 10 }}>
                    <h1 >Sesión expirada</h1>
                </Col>
            </Row>
        </div >
    )
}