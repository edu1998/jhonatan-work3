import React, { useEffect, useState } from 'react';
import { capitalizeFirstLetter, keyPressSpaceBar, clsAlphaOnly, keyPressPhoneNumber, padLeadingZeros, checkProperties } from '../../../../utils/functions';
import { Row, Col, Divider, Form, Input, Select, DatePicker, Button, Spin } from 'antd';
import { dateFormatList, validateMessages } from '../../../../utils/const';
import { openNotification } from '../../../../components/Toastr';
import { LoadingOutlined, InfoCircleOutlined } from '@ant-design/icons';
import industryApi from '../../../../api/industry';
import countryApi from '../../../../api/country';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'antd/dist/antd.css';
import phones from '../../../../utils/json/phones.json'
import { useTranslation } from 'react-i18next';

const { Item } = Form;
const { Option } = Select;
const antIcon = <LoadingOutlined className="font-size-14" spin />;

export const CompanyData = ({ loadingMyAccount, myAccountData, setMyAccountData, setSelected, selected, handleSubmit }) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [industries, setIndustries] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loadingGetIndustries, setLoadingGetIndustries] = useState(false);
    const [loadingGetCountries, setLoadingGetCountries] = useState(false);
    const session = useSelector(store => store.Session.session);
    const partner = useSelector(store => store.Partner);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setMyAccountData({
                ...myAccountData,
                [name]: form.getFieldValue('prefix') + value.trim()
            })
        } else {
            setMyAccountData({
                ...myAccountData,
                [name]: value.trim()
            });
        }
    };

    const handleChangePrefix = (value) => {
        setMyAccountData({
            ...myAccountData,
            phone: value + form.getFieldValue('phone')
        });
    };

    const handleChangeDate = (name, dateString) => {
        setMyAccountData({
            ...myAccountData,
            [name]: dateString
        })
    }

    const handleSelect = (name, value) => {
        setMyAccountData({
            ...myAccountData,
            [name]: JSON.parse(value)
        })
    }

    const onFinish = async () => {
        setLoading(true);
        await handleSubmit();
        setLoading(false);
    }

    useEffect(() => {
        industries.length === 0 && getIndustries();
        countries.length === 0 && getCountries();
        myAccountData && form.setFieldsValue({
            ...myAccountData,
            industry_id: myAccountData.industry_id &&
                JSON.stringify(myAccountData.industry_id.id ? myAccountData.industry_id.display_name : myAccountData.industry_id[1]),
            prefix: myAccountData.phone ? myAccountData.phone.substring(0, 4) : '0056',
            birthday: myAccountData?.birthday && moment(myAccountData.birthday, dateFormatList[2]),
            name: myAccountData?.name,
            passport_id: myAccountData?.passport_id,
            x_fantasy_name: myAccountData?.x_fantasy_name,
            x_employees_number: myAccountData?.x_employees_number,
            x_sales_range: myAccountData?.x_sales_range,
            x_project_name: myAccountData?.x_project_name,
            phone: myAccountData?.phone?.substring(4, myAccountData.phone.length).trim(),
            country_id: myAccountData.country_id &&
                JSON.stringify(myAccountData.country_id.id ? myAccountData.country_id.display_name : myAccountData.country_id[1]),
        });
    }, [myAccountData])

    useEffect(() => {
        session && form.setFieldsValue({
            company_name: session && session.userInfo.company_id[1],
        });
    }, [session])

    const getIndustries = () => {
        setLoadingGetIndustries(true);
        industryApi.getAll()
            .then(res => {
                setIndustries(res.data);
                setLoadingGetIndustries(false);
            })
            .catch(error => {
                setLoadingGetIndustries(false);
                const message = error.response.data.message;
                openNotification({ status: false, content: message ? `${message}` : 'Error al guardar los datos de la cuenta!' });
            })
    }
    const getCountries = () => {
        setLoadingGetCountries(true);
        countryApi.getAll()
            .then(res => {
                setCountries(res.data);
                setLoadingGetCountries(false);
            })
            .catch(error => {
                setLoadingGetCountries(false);
                const message = error.response.data.message;
                openNotification({ status: false, content: message ? `${message}` : 'Error al guardar los datos de la cuenta!' });
            })
    }

    const formItemLayout = {
        labelCol: {
            span: 0,
        },
        wrapperCol: {
            span: 0,
        },
        layout: "vertical"
    }

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>     
            <Select 
                className="contentOptionsPhone"
                showSearch onChange={(value) => handleChangePrefix(value)}
                optionFilterProp="children"
                filterOption={(input, option) =>
                      option?.children?.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                    optionA?.children?.toString().toLowerCase().localeCompare(optionB.children.toString().toLowerCase())
                }
            >
                {phones.length > 0 && phones.map((element, i) => (
                    <Option className="flag" value={padLeadingZeros(element.dial_code, 4)} key={i}>{element.name} (+{element.dial_code})</Option>
                ))}
            </Select>
        </Form.Item>
    );
    return (
        <div id="datosEmpresa">
            <Row>
                <Col className="text-align-left">
                    <h2 className="title-primary">{t('myAccount.title1')}</h2>
                    <span className="text-color-gray">{t('myAccount.subtitle')} </span>
                </Col>
            </Row>

            {loadingMyAccount || partner.loading ? (
                <Row justify="center" align="middle" className="generic-spinner-padding">
                    <Col >
                        <Spin size="large" />
                    </Col>
                </Row>
            ) : (
                <>
                    <Divider orientation="left"><span className="text-divider">{t('myAccount.divider1')} </span></Divider>
                    <Form name="formulario" form={form} {...formItemLayout} onFinish={onFinish}
                        initialValues={{ prefix: '056' }} validateMessages={validateMessages} className="text-align-left"
                    >
                        <Row gutter={[12, 2]} >
                            <Col xs={24} sm={24} md={10}>
                                <Item label={t('myAccount.companyName')}
                                    normalize={value => capitalizeFirstLetter(value)} >
                                    <Input readOnly={true} value={session?.userInfo?.isAdmin ?
                                        session?.userInfo?.company_id[1] : myAccountData?.parent_id ? myAccountData?.parent_id[1] : myAccountData?.display_name}
                                        onChange={(e) => handleChange(e)} onKeyPress={(e) => keyPressSpaceBar(e)} />

                                </Item>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Item label={t('myAccount.nif')} name="ref" rules={[{ required: true }, { min: 7 }]}
                                    // normalize={value => clsNif(value)}
                                    tooltip={{
                                        title: "Debe constar de mínimo 7 digitos.",
                                        icon: <InfoCircleOutlined />,
                                    }}>
                                    <Input name="ref" placeholder="12345678-9" pattern="{9}"
                                        onChange={(e) => setMyAccountData({
                                            ...myAccountData,
                                            ref: e?.target?.value
                                        })}
                                        onKeyPress={(e) => { keyPressSpaceBar(e) }}
                                        title="Debe constar de 9 números" />
                                </Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Item label={t('myAccount.area')} name="industry_id" rules={[{ required: true }]}>
                                    <Select onChange={(value) => handleSelect('industry_id', value)}>
                                        {industries.length > 0 && industries.map(element => (
                                            <Option key={JSON.stringify(element)}>{element && element.display_name}</Option>
                                        ))}
                                        {loadingGetIndustries && (
                                            <Option key="0"><Spin indicator={antIcon} /></Option>
                                        )}
                                    </Select>
                                </Item>
                            </Col>
                        </Row>
                        <Row gutter={[12, 2]} >
                            <Col xs={24} sm={24} md={10}>
                                <Item label={t('myAccount.fantasyName')} name="x_fantasy_name" rules={[{ required: true }, { max: 30 }]}>
                                    <Input name="x_fantasy_name" onKeyPress={(e) => keyPressSpaceBar(e)} 
                                        onChange={(e) => setMyAccountData({
                                            ...myAccountData,
                                            x_fantasy_name: e?.target?.value
                                        })}
                                    />
                                </Item>
                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Item label={t('myAccount.employeesNumber.name')} name="x_employees_number" rules={[{ required: true }]}>
                                    <Select onChange={(value) => setMyAccountData({
                                            ...myAccountData,
                                            x_employees_number: value
                                        })}>
                                        <Option key="to1" value="to1">{t('myAccount.employeesNumber.to1')}</Option>
                                        <Option key="2to5" value="2to5">{t('myAccount.employeesNumber.to5')}</Option>
                                        <Option key="6to10" value="6to10">{t('myAccount.employeesNumber.to10')}</Option>
                                        <Option key="11to25" value="11to25">{t('myAccount.employeesNumber.to25')}</Option>
                                        <Option key="26to50" value="26to50">{t('myAccount.employeesNumber.to50')}</Option>
                                        <Option key="51to200" value="51to200">{t('myAccount.employeesNumber.to200')}</Option>
                                        <Option key="201to1000" value="201to1000">{t('myAccount.employeesNumber.to1000')}</Option>
                                    </Select>
                                </Item>
                            </Col>
                            <Col xs={24} sm={24} md={6}>
                                <Item label={t('myAccount.salesRange.name')} name="x_sales_range" rules={[{ required: true }]}>
                                    <Select onChange={(value) => setMyAccountData({
                                            ...myAccountData,
                                            x_sales_range: value
                                        })}>
                                        <Option key="10to100" value="10to100">{t('myAccount.salesRange.10to100')}</Option>
                                        <Option key="101to200" value="101to200">{t('myAccount.salesRange.101to200')}</Option>
                                        <Option key="201to500" value="201to500">{t('myAccount.salesRange.201to500')}</Option>
                                        <Option key="501to1000" value="501to1000">{t('myAccount.salesRange.501to1000')}</Option>
                                    </Select>
                                </Item>
                            </Col>
                        </Row>
                        <Row gutter={[12, 2]}>
                            <Col xs={24} sm={24} md={6}>
                                <Item label={t('myAccount.country')} name="country_id" rules={[{ required: true }]}>
                                    <Select onChange={(value) => handleSelect('country_id', value)}
                                        optionFilterProp="children"
                                        showSearch
                                        filterOption={(input, option) =>
                                              option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        filterSort={(optionA, optionB) => {
                                            if(optionA&&optionB) {
                                                return optionA?.children?.toString().toLowerCase().localeCompare(optionB?.children?.toString().toLowerCase());
                                            }
                                        }
                                            
                                        }
                                    >
                                        {countries.length > 0 && countries.map(element => (
                                            <Option key={JSON.stringify(element)}>{element && element.display_name}</Option>
                                        ))}
                                        {loadingGetCountries && (
                                            <Option key="0"><Spin indicator={antIcon} /></Option>
                                        )}
                                    </Select>
                                </Item>
                            </Col>
                            <Col xs={24} sm={24} md={8}>
                                <Item label={t('myAccount.address')} name="street" rules={[{ required: true }, { max: 30 }]} normalize={value => capitalizeFirstLetter(value)}>
                                    <Input name="street" placeholder="Davinci 55 - Ciudad del Este"
                                        onChange={(e) => setMyAccountData({
                                            ...myAccountData,
                                            street: e.target.value ? e.target.value.replace(/\b\w/g, l => l.toUpperCase()) : null
                                        })} />
                                </Item>
                            </Col>
                            <Col xs={24} sm={12} md={4}>
                                <Item label={t('myAccount.zip')} name="zip" rules={[{ min: 6 }, { max: 10 }]}>
                                    <Input name="zip" placeholder="1030000"
                                        onChange={(e) => handleChange(e)} onKeyPress={(e) => keyPressSpaceBar(e)} />
                                </Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Item label="Email" name="email" rules={[{ required: true }, { type: 'email' }, { max: 100 }]}>
                                    <Input name="email" placeholder="example@......"
                                        onChange={(e) => handleChange(e)} onKeyPress={(e) => keyPressSpaceBar(e)} />
                                </Item>
                            </Col>
                        </Row>
                        {<Divider orientation="left"><span className="text-divider">{t('myAccount.divider2')}</span></Divider>}
                        <Row gutter={[12, 2]}>
                            <Col xs={24} sm={12} md={6}>
                                <Item label={t('myAccount.fullName')} name="name" rules={[{ required: true }, { max: 20 }]}
                                // normalize={value => capitalizeFirstLetter(value)}
                                >
                                    <Input name="name" onKeyPress={(e) => clsAlphaOnly(e)}
                                        onChange={(e) => {
                                            setMyAccountData({
                                                ...myAccountData,
                                                name: e.target.value ? e.target.value.replace(/\b\w/g, l => l.toUpperCase()) : null
                                            })
                                        }} />
                                </Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Item label={t('myAccount.passport')} name="passport_id" rules={[{ required: true }, {min: 6}, { max: 50 }]}>
                                    <Input name="passport_id" onKeyPress={(e) => keyPressSpaceBar(e)}
                                        onChange={(e) => handleChange(e)} />
                                </Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Item label={t('myAccount.phone')} name="phone" rules={[{ required: true },{min: 6}, { max: 15 }]}>
                                    <Input addonBefore={prefixSelector} name="phone" placeholder="959605820"
                                        onKeyPress={(e) => keyPressPhoneNumber(e)}
                                        onChange={(e) => handleChange(e)} />
                                </Item>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <Item label={t('myAccount.birthday')} name="birthday" rules={[{ required: true }]}>
                                    <DatePicker name="birthday" className="input-width-100-percent"
                                        disabledDate={d => !d || d.isAfter(moment()) || d.isSameOrBefore("1940-01-01")}
                                        onChange={(date, dateString) => handleChangeDate('birthday', dateString)}
                                        format={dateFormatList[2]} />
                                </Item>
                            </Col>
                        </Row>
                        <Row gutter={[12, 2]}>
                            <Col span={12} className="float-right">
                                <Item className="text-align-left">
                                    <Button type="secondary" onClick={() => form.resetFields()}>
                                        {t('myAccount.cancel')}
                                    </Button>
                                </Item>
                            </Col>
                            <Col span={12} className="text-align-right">
                                    <Button className="btn-link-filled-margin" loading={loading}
                                        type="primary" onClick={() => form.submit()} >
                                        {checkProperties(partner?.partner) ? t('myAccount.update') : t('myAccount.save')}
                                        {/* {loading && <Spin indicator={antIcon} className="spin-inside-button" />} */}
                                    </Button>
                            </Col>
                        </Row>
                    </Form>
                </>
            )}
        </div>
    )
}
