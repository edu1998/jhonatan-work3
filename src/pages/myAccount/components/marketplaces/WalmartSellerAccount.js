import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Button, Input, Modal } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import accessKeysApi from '../../../../api/aws-access-keys'
import { openNotification } from '../../../../components/Toastr';
import * as Actions from '../../../../redux/session/action';
import { useDispatch } from 'react-redux';

const { Item } = Form;

export default (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [loadingIsValidAccount, setLoadingIsValidAccount] = useState(false)
    const {
        tab,
        mySellerAccount,
        session } = props;

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 0,
        },
    }

    useEffect(() => {
        if (mySellerAccount) {
            form.setFieldsValue(mySellerAccount?.credentials);
        }
    }, [mySellerAccount]);

    const checkMyWalmartSellerAccount = async (mySellerAccount) => {
        setLoadingIsValidAccount(true)
        try {
            let credentials = form.getFieldsValue();
            const response = await accessKeysApi.verifyCredentials(session?.userInfo?.commercial_partner_id[0], tab, credentials);
            if (response.data) {
                setLoadingIsValidAccount(false);
                openNotification({ status: response.data, content: 'Credenciales de Walmart verificadas' })
            } else {
                throw 'Las credenciales son incorrectas';
            }
        } catch (error) {
            setLoadingIsValidAccount(false)
            openNotification({ status: false, content: error })
        }
    }

    const saveCredentials = (credentials) => {
        setLoadingIsValidAccount(true);
        accessKeysApi.saveCredentials(session?.userInfo?.commercial_partner_id[0], tab, credentials).then((resp) => {
            Modal.success({
                content: 'Se asocio la cuenta exitosamente',
            });
            dispatch(Actions.updateSellerAccountStatusSession(true));
            setLoadingIsValidAccount(false);
        }).catch(() => {
            setLoadingIsValidAccount(false);
            openNotification({ status: false, content: 'No se pudo validar la cuenta' });
        });
    }

    return (
        <Form name="walmart-form" {...formItemLayout} form={form} onFinish={saveCredentials}>
            <Col xs={24} sm={24} md={24}>
                <Item
                    label="Client ID"
                    name="client_id"
                    rules={[{ required: true }]}
                    tooltip={{
                        title: t('myAccount.sellerAccount.WalmartInputs.input1Desciption'),
                        icon: <InfoCircleOutlined />,
                    }}
                >
                    <Input />
                </Item>
                <Item
                    label="Secret Key"
                    name="secret_key"
                    rules={[{ required: true }]}
                    tooltip={{
                        title: t('myAccount.sellerAccount.WalmartInputs.input2Desciption'),
                        icon: <InfoCircleOutlined />,
                    }}
                >
                    <Input />
                </Item>
            </Col>
            <Row xs={24} sm={24} md={24}>
                <Button type="primary" htmlType="submit" loading={loadingIsValidAccount}>
                    {t('myAccount.checkSP')}
                </Button>
            </Row>
        </Form>
    )
}
