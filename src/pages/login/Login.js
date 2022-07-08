import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Row, Divider, Col, Button, Form, Input, Alert, Spin, Typography, Checkbox } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import newLogo from '../../assets/LAP_Marketplace.jpg';
import { useTranslation } from 'react-i18next';
import authApi from '../../api/auth';
import { useDispatch, useSelector } from "react-redux";
import * as Actions from '../../redux/session/action';
import { keyPressSpaceBar } from '../../utils/functions';
import { useLocation } from 'react-router'
import * as queryString from 'query-string';

import './login.css';

const { Item } = Form;

export const Login = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const error = useSelector(store => store.Session.error);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { Title, Text } = Typography;
    const [form] = Form.useForm();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value.trim()
        });
    };

    async function login() {
        setLoading(true);
        dispatch(Actions.login());
        let creds = {...credentials}
        let qs = queryString.parse(location.search);
        if(qs && qs.link) {
            creds.link = qs.link;
        }
        authApi.login(creds)
            .then(res => {
                if (res.status === 200 && res.data.success) {
                    dispatch(Actions.loginSucces(res.data));
                    return window.location = "/";
                } else {
                    dispatch(Actions.loginFailed(res.data.message));
                }
                setLoading(false);
            })
            .catch(error => {
                dispatch(Actions.loginFailed(error.data.message));
                setLoading(false);
            })
    }

    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: -3,
        },
        layout: "vertical"
    }

    const plainOptions = ['Recordar contraseña'];
    const options = [
        {
            label: 'Recordar contraseña',
            value: 'Apple',
        }
    ];    

    return (
        <div className="login-container">

            <Row className="login-layout">
                <Col span={12} className="login-left">
                    <div className="login-content-texts">
                        <div className="login-logo-container">
                            <Title style={{ textAlign: 'left', color: 'white' }} white level={2}>Transformando vendedores locales en <span style={{ color: '#00e5a6' }}>Negocios Globales</span></Title>
                            <hr className="login-hr-texts" />
                            <Text style={{ textAlign: 'left', color: 'white', marginRight: 22 }} className="login-title">Posicionamos tu marca y vendemos tus productos en marketplaces internacionales</Text>
                        </div>
                    </div>                        
                </Col>            
                <Col span={12}>
                    <div className="login-content-inputs">
                    <Spin spinning={loading}>
                        <div className="login-logo-container">
                            <img src={newLogo} className="login-logo" />
                            <Text className="login-title">Ingresa tus datos para iniciar sesión</Text>
                        </div>
                        <Divider orientation="left" className="login-divider" />
                        <Form name="formulario"
                            {...formItemLayout}
                            onFinish={login}
                            form={form}>
                            <Item className="login-email-item"
                                label='Correo'
                                name='email'
                                rules={[{
                                    required: false,
                                    message: t('login.emailEmpty')
                                }, { type: 'email' }]}
                            >
                                <Input name="username" type="email" placeholder={t('login.emailPlaceholder')}
                                    onChange={(e) => handleChange(e)} onKeyPress={(e) => keyPressSpaceBar(e)} />
                            </Item>
                            <Item className="login-password-item"
                                label='Contraseña'
                                name='password'
                                rules={[{
                                    required: false,
                                    message: t('login.passwordEmpty')
                                }]}
                            >
                                <Input.Password name="password" type="password" placeholder="********"
                                    onChange={(e) => handleChange(e)} onKeyPress={(e) => keyPressSpaceBar(e)}
                                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Item>
                            {error && (
                                <Col span={24} className="login-error">
                                    <Alert message={error} type="error" />
                                </Col>
                            )}
                            <Col span={24} className="login-button-container CheckboxRememberPassword">
                                <Checkbox.Group className="CheckboxRememberPassword" options={plainOptions} defaultValue={['Apple']} />
                                <Button style={{ marginLeft: -1 }} loading={loading} className="btn-primary-darkBlue" htmlType="submit" disabled={!credentials.username || !credentials.password}>{t('login.enter')}</Button>
                            </Col>
                            <Col span={24} className="login-button-container">
                                <Link to="/recover-password" className="recoverPassword">
                                    <Button type="link" className="btn-primary">{t('login.recoverPassword')}</Button>
                                </Link>
                            </Col>
                        </Form>
                    </Spin>
                    </div>
                </Col>
            </Row>

        </div>
    )
}
