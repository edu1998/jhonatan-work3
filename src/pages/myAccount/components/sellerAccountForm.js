import React, { useEffect } from 'react'
import { Col, Divider, Form, Row, Select, Switch, Card, Button, Tooltip, Spin, Avatar, Input } from 'antd'
import { InfoCircleOutlined, CheckCircleFilled, SyncOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { marketplaces, sellerMarketplaces, URL_SP_AWS, validateMessages } from '../../../utils/const';
import useMySellerAccount from '../hooks/useMySellerAccount';
import { checkProperties } from '../../../utils/functions';
import { useTranslation } from 'react-i18next'

const { Item } = Form;
const { Option } = Select;
const { Meta } = Card;
const antIcon = <LoadingOutlined className="spin-loading-outlined" spin />;

export const SellerAccountForm = (props) => {
    const { t } = useTranslation();

    const [form] = Form.useForm();

    const {
        session, selected,
        mySellerAccount, handleSwitch,
        handleSelect, handleChange, onFinish,
        tab, setSelected, loadingMySellerAccount } = props;

    const {
        isValidAccount,
        setIsValidAccount,
        checkMySellerAccount,
        loadingIsValidAccount,
        loadingGetLapSellerAccounts } = useMySellerAccount();

    useEffect(() => {
        if (mySellerAccount) form.setFieldsValue(mySellerAccount);
    }, [mySellerAccount])

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 0,
        },
    }

    return (
        <>
            {mySellerAccount &&
                <Form name="formulario" {...formItemLayout} form={form}
                    validateMessages={validateMessages} className="text-align-left"
                    onFinish={onFinish}
                >
                    <Row gutter={[12, 2]} className="text-align-left">
                        <Col span={5}>{t('myAccount.sellerAccount.input2')}</Col>
                        <Col>{(tab === sellerMarketplaces.AMAZON) && (isValidAccount || (mySellerAccount.x_cuenta_amazon)) ? (
                            <>
                                <CheckCircleFilled className="green" /> {t('myAccount.sellerAccount.input2Description2.1')}
                            </>
                        ) : (
                            <>
                                <Row>
                                    <Col span={24}><SyncOutlined className="orange" /> {t('myAccount.sellerAccount.input2Description1.1')}</Col>
                                    <Col span={24}><span className="orange">{t('myAccount.sellerAccount.input2Description1.2')}</span></Col>
                                </Row>
                            </>
                        )}</Col>
                    </Row>
                    <Divider />
                    {loadingGetLapSellerAccounts ? (
                        <Row justify="center" align="middle" className="generic-spinner-padding">
                            <Col >
                                <Spin size="large" />
                            </Col>
                        </Row>
                    ) : (
                        <Row gutter={[12, 2]}>
                            {(mySellerAccount && !mySellerAccount.x_seller_lap) && (
                                <>
                                    <Divider orientation="left"><span className="text-divider" >{t('myAccount.sellerAccount.divider1')}</span></Divider>
                                    {tab === sellerMarketplaces.AMAZON && (
                                        <>
                                            <Col span={24}>
                                                <p>{t('myAccount.sellerAccount.credentials.description1')}
                                                    <a target="_blank" href={URL_SP_AWS + "#registering-as-a-developer"}> {t('myAccount.sellerAccount.credentials.step1')}</a>
                                                    <br />{t('myAccount.sellerAccount.credentials.description2')}<a target="_blank" href={URL_SP_AWS + "#step-1-create-an-aws-account"}> {t('myAccount.sellerAccount.credentials.step2')}</a>
                                                </p>
                                            </Col>
                                            <Col span={24}>
                                                <p>{t('myAccount.sellerAccount.credentials.description3')}<br />
                                                    <a target="_blank" href={URL_SP_AWS + "#step-2-create-an-iam-user"}> {t('myAccount.sellerAccount.credentials.step3')}</a>
                                                </p>
                                            </Col>
                                            {/* <Col span={24}>
                                                <Item label="Marketplace" name="x_marketplace_aws" rules={[{ required: true }]}>
                                                    <Select className="input-width-40-percent" disabled={isValidAccount}
                                                        onChange={(value) => handleSelect('x_marketplace_aws', value)} >
                                                        {marketplaces.map(element => (
                                                            <Option key={JSON.stringify(element.marketplaceId)} value={element.marketplaceId}>{element && element.country}</Option>
                                                        ))}
                                                    </Select>
                                                </Item>
                                            </Col> */}
                                        </>
                                    )}
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label="ID" name="x_client_id" rules={[{ required: true }]}
                                            tooltip={{
                                                title: t(`myAccount.sellerAccount.${tab}Inputs.input3Description`),
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <Input onChange={handleChange} name="x_client_id" className="input-width-40-percent" disabled={isValidAccount} />
                                        </Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label="Access Key" name="x_acc_key" rules={[{ required: true }]}
                                            tooltip={{
                                                title: t(`myAccount.sellerAccount.${tab}Inputs.input4Description`),
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <Input onChange={handleChange} name="x_acc_key" disabled={isValidAccount} />
                                        </Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
                                        <Item label="Access Secret" name="x_acc_secret" rules={[{ required: true }]}
                                            tooltip={{
                                                title: t(`myAccount.sellerAccount.${tab}Inputs.input5Description`),
                                                icon: <InfoCircleOutlined />,
                                            }}>
                                            <Input name="x_acc_secret" onChange={handleChange} disabled={isValidAccount} />
                                        </Item>
                                    </Col>
                                    {tab === sellerMarketplaces.AMAZON && (
                                        <>

                                            <Col span={24}>
                                                <p>{t('myAccount.sellerAccount.credentials.description4')}
                                                    <br /><a target="_blank" href={URL_SP_AWS + "#step-3-create-an-iam-policy"}>{t('myAccount.sellerAccount.credentials.step4')}</a>
                                                </p>
                                            </Col>
                                            <Col span={24}>
                                                <p>{t('myAccount.sellerAccount.credentials.description5')}<br />
                                                    <a target="_blank" href={URL_SP_AWS + "#step-4-create-an-iam-role"}> S{t('myAccount.sellerAccount.credentials.step5')}</a>
                                                </p>
                                            </Col>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item label="AWS Role Name" name="x_aws_role_name" rules={[{ required: true }]}
                                                    tooltip={{
                                                        title: t(`myAccount.sellerAccount.${tab}Inputs.input6Description`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input name="x_aws_role_name" onChange={handleChange} className="input-width-40-percent" disabled={isValidAccount} />
                                                </Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item label="AWS Role ARN" name="x_aws_role_arn" rules={[{ required: true }]}
                                                    tooltip={{
                                                        title: t(`myAccount.sellerAccount.${tab}Inputs.input7Description`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input name="x_aws_role_arn" onChange={handleChange} disabled={isValidAccount} />
                                                </Item>
                                            </Col>
                                            <Col span={24}>
                                                <p>{t('myAccount.sellerAccount.credentials.description6')}<br />
                                                    <a target="_blank" href={URL_SP_AWS + "#step-5-add-an-aws-security-token-service-policy-to-your-iam-user"} >{t('myAccount.sellerAccount.credentials.step6')}</a>
                                                </p>
                                            </Col>
                                            <Divider orientation="left"><span className="text-divider" >{t('myAccount.sellerAccount.divider2')}</span></Divider>
                                            <Col span={24}>
                                                <p>{t('myAccount.sellerAccount.credentials.description7')}
                                                    <br /><a target="_blank" href={URL_SP_AWS + "#registering-your-application"} > {t('myAccount.sellerAccount.credentials.step7')}</a>
                                                </p>
                                            </Col>
                                            <Col span={24}>
                                                <p>{t('myAccount.sellerAccount.credentials.description8')}
                                                    <a target="_blank" href={URL_SP_AWS + "#viewing-your-developer-information"} > {t('myAccount.sellerAccount.credentials.step8')}</a>
                                                </p>
                                            </Col>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item label="SP Seller ID" name="x_sp_seller_id" rules={[{ required: true }]}
                                                    tooltip={{
                                                        title: t(`myAccount.sellerAccount.${tab}Inputs.input8Description`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input name="x_sp_seller_id" onChange={handleChange} disabled={isValidAccount} />
                                                </Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item label="SP Client ID" name="x_sp_acc_key" rules={[{ required: true }]}
                                                    tooltip={{
                                                        title: t(`myAccount.sellerAccount.${tab}Inputs.input9Description`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input name="x_sp_acc_key" onChange={handleChange} disabled={isValidAccount} />
                                                </Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item label="SP Client Secret" name="x_sp_acc_secret" rules={[{ required: true }]}
                                                    tooltip={{
                                                        title: t(`myAccount.sellerAccount.${tab}Inputs.input9Description`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input name="x_sp_acc_secret" onChange={handleChange} disabled={isValidAccount} />
                                                </Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item label="SP Refresh Token" name="x_sp_ref_token" rules={[{ required: true }]}
                                                    tooltip={{
                                                        title: t(`myAccount.sellerAccount.${tab}Inputs.input9Description`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input name="x_sp_ref_token" onChange={handleChange} disabled={isValidAccount} />
                                                </Item>
                                            </Col>
                                        </>
                                    )}
                                    {tab === sellerMarketplaces.AMAZON &&
                                        <Col xs={24} sm={24} md={24}>
                                            <Button type="primary" className="btn-link-filled"
                                                disabled={!checkProperties(mySellerAccount)}
                                                onClick={() => checkMySellerAccount(mySellerAccount)}
                                            >{t('myAccount.checkSP')}
                                                {loadingIsValidAccount && <Spin indicator={antIcon} className="spin-inside-button" />}
                                            </Button>
                                        </Col>
                                    }
                                </>
                            )}
                        </Row>
                    )}
                    <Row>
                        <Col span={24}>
                            <Card className="my-seller-account-card">
                                <Meta
                                    avatar={
                                        <Avatar icon={<LockOutlined />} className="background-green" />
                                    }
                                    title="Card title"
                                    description="This is the description"
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        {selected === 2 && (
                            <>
                                <Col span={20} className="text-align-left-margin-top">
                                    <Button className="btn-primary-margin"
                                        onClick={() => setSelected(selected - 1)}
                                    >{t('myAccount.return')}</Button>
                                    <Tooltip title={(!isValidAccount && !mySellerAccount?.x_seller_lap) && t('myAccount.tooltip2')}>
                                        <Button className="btn-link-filled-padding"
                                            type="primary" htmlType="submit"
                                            disabled={!isValidAccount && tab === sellerMarketplaces.AMAZON}>
                                            {t('myAccount.finish')}
                                            {loadingMySellerAccount && <Spin indicator={antIcon} />}
                                        </Button>
                                    </Tooltip>
                                </Col>
                                <Col span={4} className="col-align-rigth-margin-top">
                                    <Button className={`btn-link-${mySellerAccount.x_cuenta_amazon ? 'filled' : 'empty'}`}
                                        type="primary"
                                        disabled={!mySellerAccount.x_cuenta_amazon}
                                        onClick={() => setSelected(selected + 1)}
                                    >
                                        {t('myAccount.next')}
                                    </Button>
                                </Col>
                            </>)}
                    </Row>
                </Form>}
        </>
    )
}