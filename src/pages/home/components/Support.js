import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { SendOutlined } from '@ant-design/icons';
import SvgSupport from '../../../utils/icons/SvgSupport';
import { Button, Row, Col, Card, Form, Input, Select, Tooltip, Typography, Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import { openNotification } from '../../../components/Toastr';
import areasAPI from '../../../api/areas';
import supportAPI from '../../../api/support';
import { getErrorMessage } from '../../../api/api';

const { Item } = Form;
const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;

const maxLength = 1000;

const Support = ({ listingId }) => {

    const { t } = useTranslation();

    useEffect(async () => {
        await areasAPI.getAll()
            .then((result) => {
                setAreas(result.data);
                if (listingId) {
                    let onboardingArea = result.data.find((area) => area.name == 'Onboarding');
                    form.setFieldsValue({ selectedArea: onboardingArea.value });
                }
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    }, []);

    const [remainingLength, setRemainingLength] = useState(maxLength);
    const [areas, setAreas] = useState([]);
    const [loadingAPI, setLoadingAPI] = useState(false);

    const [form] = Form.useForm();

    //estilo para alinear el formulario
    const formItemLayout = {
        labelCol: {
            span: 9,
        },
        wrapperCol: {
            span: 0,
        },
        layout: "vertical"
    }

    const onFinish = async (formInputFields) => {
        if (formInputFields.enteredMessage && formInputFields.selectedArea) {
            const objectToInsert = { message: formInputFields.enteredMessage, area: formInputFields.selectedArea, listingId: listingId };
            setLoadingAPI(true);
            await supportAPI.insert(objectToInsert)
                .then((result) => {
                    openNotification({ status: true, content: t('support.submited') });
                    form.resetFields();
                    if (listingId) {
                        let onboardingArea = result.data.find((area) => area.name == 'Onboarding');
                        form.setFieldsValue({ selectedArea: onboardingArea.value });
                    }
                    setRemainingLength(maxLength);
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
            setLoadingAPI(false);
        } else {
            openNotification({ status: false, content: t('support.allFields') });
        }
    }

    return (
        <Row className="home-support-parent">
            <Col span={24} xs={24} sm={24} md={24}>
                <Card className="home-support-card">
                    <Row>
                        <Col span={8} xs={24} sm={24} md={24} className="home-support-title-content">
                            <div className="home-support-card-title">
                                <SvgSupport className="btn-primary home-support-card-title-icon" /><span className="home-support-card-title-text">{t('support.title')}</span>
                                <span className="home-support-card-title-description">{t('support.description')}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row className="home-support-main-row">
                        <Col span={6} xs={12} sm={12} md={6} className="home-support-chile-branch">
                            <p className="home-support-branch-title">Santiago</p>
                            <p className="home-support-branch-info">Roger de Flor 2950, piso 5, Las Condes</p>
                            <p className="home-support-branch-info">Santiago, Chile</p>
                            <p className="home-support-branch-info">+56233402983</p>
                            <p className="home-support-branch-info">info@lapmarketplace.com</p>
                        </Col>
                        <Col span={6} xs={12} sm={12} md={6} className="home-support-eeuu-branch">
                            <p className="home-support-branch-title">New York</p>
                            <p className="home-support-branch-info">12-01 34th Avenue, Long Island, City</p>
                            <p className="home-support-branch-info">New York, Estados Unidos</p>
                            <p className="home-support-branch-info">+19179293403</p>
                            <p className="home-support-branch-info">info@lapimport.com</p>
                        </Col>
                        <Col span={12} xs={12} sm={12} md={10} className="home-support-send-message">
                            {!loadingAPI ? (
                                <>
                                    <h4 className="home-support-form-title">{t('support.message')}</h4>
                                    <Form name="formulario"
                                        className="home-support-form"
                                        {...formItemLayout}
                                        onFinish={onFinish}
                                        form={form}>
                                        <div className="home-support-form-item-divider">
                                            <Item
                                                className="home-support-form-item-message"
                                                name="selectedArea">
                                                <Select name="area" size="small" style={{ fontSize: '10pt' }} placeholder={t('support.area')}>
                                                    {areas.map((area) => {
                                                        return (
                                                            <Select.Option key={area.value} value={area.value}>{area.name}</Select.Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Item>
                                            <Item
                                                className="home-support-form-item-message"
                                                name="enteredMessage"
                                                rules={[{
                                                    message: t('support.emptyMessage')
                                                }]}>
                                                <Input.TextArea
                                                    className="home-support-form-item-textarea"
                                                    placeholder={t('support.messagePlaceholder')}
                                                    maxLength={maxLength}
                                                    showCount={true}
                                                />
                                            </Item>
                                        </div>
                                        <Item className="home-support-form-item-button">
                                            <Tooltip placement="bottomLeft" title={t('support.messageButtonTooltip')}>
                                                <Button className="home-support-form-button" htmlType="submit" icon={<SendOutlined />}>
                                                    {t('support.messageButton')}
                                                </Button>
                                            </Tooltip>
                                        </Item>
                                    </Form>
                                </>
                            ) : (
                                <div className="generic-spinner">
                                    <Spin />
                                </div>
                            )}
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    )
};

export default React.memo(Support);
