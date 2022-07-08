import React from 'react';
import 'antd/dist/antd.css';
import { Row, Col, Button } from 'antd';
import error from '../assets/error.png';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

export const NotFound = () => {


    return (
        <div className="content-div">
            <Row justify="center">
                <Col xs={24} sm={24} md={24} >
                    <img src={error} style={{ maxHeight: 350, width: 'auto' }} />
                </Col>
                <Col xs={24} sm={24} md={24} style={{ paddingTop: 10 }}>
                    <h1 >Página no encontrada</h1>
                    <Link to="/">
                        <Button icon={<ArrowLeftOutlined />} className="btn-primary"> Volver a inicio</Button>
                    </Link>
                </Col>
            </Row>
        </div >
    )
}