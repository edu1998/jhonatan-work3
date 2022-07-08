import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Form, Input, Select, Button, Switch, Alert, Space } from 'antd';
import {  initialProductVariant, validateMessages } from '../../../utils/const';
import {  InfoCircleOutlined, DownloadOutlined, CloseOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { useTranslation } from 'react-i18next';

const { Item } = Form;
const { Option } = Select;

const maxLength13 = 13;
const maxLength200 = 200;
const maxLength500 = 500;
const maxLength2000 = 2000;

export const EditVariant = ({ currentVariant, toggleModalEditVariant, attributes, tab, currentTab, setFormPerVariant, maxLength, disabled }) => {

    const { t } = useTranslation();

    console.log('currentVariant', currentVariant);

    const [form] = Form.useForm();

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            ...currentVariant
        });
    }, [currentVariant]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setVariant({
    //         ...variant,
    //         [name]: value
    //     });

    // };

    // const handleSelect = (name, value) => {
    //     setVariant({
    //         ...variant,
    //         [name]: JSON.parse(value)
    //     })
    // }

    const handleChangeSwitch = (checked) => {
        // console.log(`switch to ${checked}`);
    }

    const onFinish = () => {
        const formFields = form.getFieldsValue();
        setFormPerVariant((prevState) => {
            let currentVariantIndex = 0;
            prevState[`${tab}-${currentTab}`].find((variant, index) => {
                if (variant.id === currentVariant.id) {
                    currentVariantIndex = index;
                    return true;
                } else {
                    return false;
                }
            });
            prevState[`${tab}-${currentTab}`][currentVariantIndex] = {
                ...currentVariant,
                ...formFields
            };
            return {
                ...prevState
            };
        });
        closeModal();
    }

    const closeModal = () => {
        form.resetFields();
        toggleModalEditVariant();
    };

    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 18,
        },
    }

    return (
        <div id="">

            <>
                <Alert message={t('modalAddProductVariant.alertMessage')} action={
                    <Space>
                        <Button size="small" type="link" icon={<CloseOutlined />} onClick={closeModal}>{t('onboarding.alertButtonClose')}</Button>
                        <Button className="btn-primary" icon={<DownloadOutlined />} onClick={onFinish} disabled={disabled}>{t('onboarding.alertButtonSave')}  </Button>
                    </Space>
                } />
                <Form name="formulario" form={form} {...formItemLayout} onFinish={onFinish}
                    validateMessages={validateMessages} className="text-align-left"
                >
                    <Row  >
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input5')} className="input-form-margin-bottom" name="title" rules={[{ required: true }, { max: maxLength.title }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input5Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input.TextArea rows={2} name="title" maxLength={maxLength.title} disabled={disabled}/>
                            </Item>
                            <p className="home-support-form-item-textarea-length">{`${currentVariant.title ? currentVariant.title.length : 0}/${maxLength.title}`}</p>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input8')} className="input-form-margin-bottom" name="bulletPoint1" rules={[{ required: false }, { max: maxLength.bp1 }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input7Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input.TextArea rows={3} name="bulletPoint1" maxLength={maxLength.bp1} disabled={disabled}/>
                            </Item>
                            <p className="home-support-form-item-textarea-length">{`${currentVariant.bulletPoint1 ? currentVariant.bulletPoint1.length : 0}/${maxLength.bp1}`}</p>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input9')} className="input-form-margin-bottom" name="bulletPoint2" rules={[{ required: false }, { max: maxLength.bp2 }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input8Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input.TextArea rows={3} name="bulletPoint2" maxLength={maxLength.bp2} disabled={disabled}/>
                            </Item>
                            <p className="home-support-form-item-textarea-length">{`${currentVariant.bulletPoint2 ? currentVariant.bulletPoint2.length : 0}/${maxLength.bp2}`}</p>

                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input10')} className="input-form-margin-bottom" name="bulletPoint3" rules={[{ required: false }, { max: maxLength.bp3 }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input9Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input.TextArea rows={3} name="bulletPoint3" maxLength={maxLength.bp3} disabled={disabled}/>
                            </Item>
                            <p className="home-support-form-item-textarea-length">{`${currentVariant.bulletPoint3 ? currentVariant.bulletPoint3.length : 0}/${maxLength.bp3}`}</p>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input11')} className="input-form-margin-bottom" name="bulletPoint4" rules={[{ required: false }, { max: maxLength.bp4 }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input10Description'),
                                    icon: <InfoCircleOutlined />
                                }}>
                                <Input.TextArea rows={3} name="bulletPoint4" maxLength={maxLength.bp4} disabled={disabled}/>
                            </Item>
                            <p className="home-support-form-item-textarea-length">{`${currentVariant.bulletPoint4 ? currentVariant.bulletPoint4.length : 0}/${maxLength.bp4}`}</p>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input12')} className="input-form-margin-bottom" name="bulletPoint5" rules={[{ required: false }, { max: maxLength.bp5 }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input11Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input.TextArea rows={3} name="bulletPoint5" maxLength={maxLength.bp5} disabled={disabled}/>
                            </Item>
                            <p className="home-support-form-item-textarea-length">{`${currentVariant.bulletPoint5 ? currentVariant.bulletPoint5.length : 0}/${maxLength.bp5}`}</p>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input13')} className="input-form-margin-bottom" name="description" rules={[{ required: true }, { max: maxLength.descripcion }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input12Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input.TextArea rows={5} name="description" maxLength={maxLength.descripcion} disabled={disabled}/>
                            </Item>
                            <p className="home-support-form-item-textarea-length">{`${currentVariant.description ? currentVariant.description.length : 0}/${maxLength.descripcion}`}</p>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input15')} className="input-form-margin-bottom" name={`weight`} rules={[{ required: true }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input15Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input name={`weight`} type="number" style={{ width: '35%' }} disabled={disabled}/>
                            </Item>
                            <Item label={t('onboarding.order.step1Input15-1')} className="input-form-margin-bottom" name={`unity`} rules={[{ required: true }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input15-1Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                    <Select value="gr" style={{ width: '15%' }} name={`unity`} disabled={disabled}>
                                            <Option value="gr">gr.</Option>
                                            <Option value="kg">kg.</Option>
                                            <Option value="oz." >oz.</Option>
                                    </Select>
                            </Item>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input17')} className="input-form-margin-bottom" name="referencePrice" rules={[{ required: true }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input17Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input name="referencePrice" type="number" style={{ width: '30%' }} disabled={true} />
                            </Item>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input18')} className="input-form-margin-bottom" name="sku" rules={[{ required: true }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input18Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input name="sku" type="text" style={{ width: '30%' }} disabled={true} />
                            </Item>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input19')} className="input-form-margin-bottom" name="code_ean_upc" rules={[{ required: true }, { max: maxLength.ean }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input19Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Input name="code_ean_upc" style={{ width: '30%' }} maxLength={maxLength.ean} disabled={disabled} />
                            </Item>
                            <p className="home-support-form-item-textarea-length p-max-length">{`${currentVariant.code_ean_upc ? currentVariant.code_ean_upc.length : 0}/${maxLength.ean}`}</p>
                        </Col>
                        <Divider className="divider-margin" />
                        <Col xs={24} sm={24} md={24}>
                            <Item label={t('onboarding.order.step1Input20')} className="input-form-margin-bottom" name="pack" rules={[{ required: true }]}
                                tooltip={{
                                    title: t('onboarding.order.step1Input20Description'),
                                    icon: <InfoCircleOutlined />,
                                }}>
                                <Switch name="pack" defaultChecked onChange={handleChangeSwitch} className="item-inline" disabled={disabled} />
                                <p className="item-inline">Individual</p>
                            </Item>
                        </Col>
                        {attributes && attributes.length > 0 && (
                            <>
                                <Divider orientation="left"><span className="text-divide">{t('onboarding.order.divider1').toUpperCase()} </span></Divider>
                                {attributes.map(element => (
                                    <Col xs={24} sm={24} md={24} key={element.attribute.id}>
                                        <Item label={element.attribute.name} className="input-form-margin-bottom" name={`${element.attribute.name.toLowerCase()}`} rules={[{ required: true }, { max: 300 }]}
                                            tooltip={{
                                                title: element.attribute.name,
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <Input name={`${element.attribute.name.toLowerCase()}`} disabled={disabled} />
                                        </Item>
                                        <Divider className="divider-margin" />
                                    </Col>
                                ))}
                            </>
                        )}
                    </Row>
                </Form>
            </>
        </div>
    )
}