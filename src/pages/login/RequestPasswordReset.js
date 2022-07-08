import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Alert, Divider, Row, Col, Button, Form, Input, Spin } from 'antd';
import newLogo from '../../assets/LAP_Marketplace.jpg';
import authApi from '../../api/auth';
import { useTranslation } from 'react-i18next';
import { keyPressSpaceBar } from '../../utils/functions';
import { openNotification } from '../../components/Toastr';
import { getErrorMessage } from '../../api/api';

import './login.css';

const formItemLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: -3,
    },
    layout: "vertical"
};

const { Item } = Form;

const RequestPasswordReset = ({ }) => {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [form] = Form.useForm();

    const onFinish = async (formValues) => {
        setError();
        const errorString = getErrors(formValues.email);
        if (errorString) {
            setError(errorString);
        } else {
            setLoading(true);
            await authApi.sendRecoveryEmail(formValues)
                .then(response => {
                    setLoading(false);
                    openNotification({ status: true, content: t('login.emailSent') });
                    setTimeout(() => {
                        window.location = '/login';
                    }, 1500);
                })
                .catch(error => {
                    setLoading(false);
                    setError(getErrorMessage(error));
                });   
        }
    };

    const getErrors = (email) => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return t('login.wrongEmail');
        }
        return null;
    };

    return (
        <div className="login-container">
            <Row justify="space-around" align="middle" className="login-layout">
                <Col span={8}>
                    <div className="login-logo-container">
                        <img src={newLogo} className="login-logo" />
                        <span className="login-title">{t('login.recoverPasswordTitle')}</span>
                    </div>
                    <Divider orientation="left" className="login-divider" />
                    <Form name="formulario"
                        {...formItemLayout}
                        onFinish={onFinish}
                        form={form}>
                        <Item className="login-email-item"
                            label=''
                            name='email'
                            rules={[{
                                required: true,
                                message: t('login.emailEmpty')
                            }]}
                        >
                            <Input name="email" placeholder="example@gmail.com" onKeyPress={(e) => keyPressSpaceBar(e)} />
                        </Item>
                        {error && 
                            <Col span={24} className="request-password-error">
                                <Alert message={error} type="error" />
                            </Col>
                        }
                        <Col span={24} className="login-button-container">
                            {loading ?
                                <Spin />
                            : 
                                <Button className="btn-primary" htmlType="submit">{t('login.send')}</Button>
                            }
                        </Col>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default React.memo(RequestPasswordReset);