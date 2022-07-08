import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { useParams } from "react-router-dom";
import { Alert, Divider, Row, Col, Button, Form, Input, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import newLogo from '../../assets/LAP_Marketplace.jpg';
import { keyPressSpaceBar } from '../../utils/functions';
import { useTranslation } from 'react-i18next';
import authApi from '../../api/auth';
import { openNotification } from '../../components/Toastr';

import './login.css';
import { useSelector } from 'react-redux';

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

const ResetPassword = ({ }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [form] = Form.useForm();

    const { partnerId } = useParams();

    const onFinish = async (formValues) => {
        setError('');
        const errorString = getErrors(formValues);
        if (!errorString) {
            setLoading(true);
            await authApi.resetPassword(partnerId, formValues)
                .then(response => {
                    setLoading(false);
                    openNotification({ status: true, content: t('login.passwordChanged') });
                    setTimeout(() => {
                        window.location = '/login';
                    }, 1500);
                })
                .catch(error => {
                    setLoading(false);
                    setError(error.response.data.message);
                });
        } else {
            setError(errorString);
        }
    }

    const getErrors = (newPasswords) => {
        if (!newPasswords.newPassword || !newPasswords.newPasswordConfirm) {
            return t('login.passwordEmpty');
        } else if (newPasswords.newPassword !== newPasswords.newPasswordConfirm) {
            return t('login.passwordsDoesntMatch');
        } else if (newPasswords.newPassword.length < 5) {
            return t('login.passwordsMinLength');
        } else if (!newPasswords.newPassword.match(/[0-9]/g)) {
            return t('login.passwordNumber');
        }
        return null;
    };

    useEffect(() => {
        if (session?.userInfo?.id) {
            window.location = '/';
        }
    }, [session])

    return (
        <div className="login-container">
            <Row justify="space-around" align="middle" className="login-layout">
                <Col span={8}>
                    <div className="login-logo-container">
                        <img src={newLogo} className="login-logo" />
                        <span className="login-title">
                            {t('login.changePassword')}
                        </span>
                    </div>
                    <Divider orientation="left" className="login-divider" />
                    <Form name="formulario"
                        {...formItemLayout}
                        onFinish={onFinish}
                        form={form}>
                        <Item className="reset-password-item"
                            label=''
                            name='newPassword'
                            rules={[{
                                required: true,
                                message: t('login.passwordEmpty')
                            }]}
                        >
                            <Input.Password name="password" type="password" placeholder={t('login.passwordPlaceholder')}
                                onKeyPress={(e) => keyPressSpaceBar(e)} iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Item>
                        <Item className="reset-password-item"
                            label=''
                            name='newPasswordConfirm'
                            rules={[{
                                required: true,
                                message: t('login.passwordEmpty')
                            }]}
                        >
                            <Input.Password name="newPasswordConfirm" type="password" placeholder={t('login.confirmPasswordPlaceholder')}
                                onKeyPress={(e) => keyPressSpaceBar(e)} iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Item>
                        {error &&
                            <Col span={24} className="reset-password-error">
                                <Alert message={error} type="error" />
                            </Col>
                        }
                        <pre className="tip-password">{t('login.tipPassword')}</pre>
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

export default React.memo(ResetPassword);