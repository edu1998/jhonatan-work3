import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Form, Input, Button, Select, Alert, AutoComplete, Spin, Tooltip , Typography} from 'antd';
import { keyPressSpaceBar, clsAlphaNoOnly, checkProperties } from '../../../../utils/functions';
import { validateMessages } from '../../../../utils/const';
import banksList from '../../../../utils/json/banksList.json';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import 'antd/dist/antd.css';

const { Item } = Form;
const { Option } = Select;
const antIcon = <LoadingOutlined className="spin-loading-outlined" spin />;

export const BankAccountData = ({ toSellerAccount, myBankAccountData, setMyBankAccountData, setSelected, selected, handleSubmit }) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const partner = useSelector(store => store.Partner);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMyBankAccountData({
            ...myBankAccountData,
            [name]: value.trim()
        });
    };

    const handleSelect = (e) => {
        setMyBankAccountData({
            ...myBankAccountData,
            bank: e
        })
    }

    const onFinish = () => {
        setLoading(true);
        // call the submit method in MyAccount
        handleSubmit();
    }
    useEffect(() => {
        setLoading(false);
    }, [])

    useEffect(() => {
        loading && setLoading(partner.loading);
    }, [partner.loading])

    useEffect(() => {
        console.log(myBankAccountData)
        myBankAccountData && form.setFieldsValue({
            bank: myBankAccountData.bank,
            acc_number: myBankAccountData.acc_number,
            x_routing_number: myBankAccountData.x_routing_number,
        });
    }, [myBankAccountData])


    const formItemLayout = {
        labelCol: {
            span: 5,
            md: 7,
            sm: 12,
            xs: 12
        },
        wrapperCol: {
            span: 0,
        },
    }
    return (
        <div id="datosCuentaBanco">
            <Row>
                <Col className="text-align-left">
                    <h2 className="title-primary">{t('myAccount.title2')}</h2>
                    <span className="text-color-gray">{t('myAccount.bankSubtitle')} </span>
                </Col>
                <Divider></Divider>
            </Row>
            <Form name="formulario" {...formItemLayout} onFinish={onFinish} form={form}
                validateMessages={validateMessages} className="text-align-left">
                <Row gutter={[12, 2]}>
                    <Col span={18} >
                        <Item label={t('myAccount.banks.bank')}
                            name="bank"
                            rules={[{ required: false }]}>
                            <AutoComplete
                                className="input-width-100-percent"
                                placeholder="Tipea el nombre"
                                options={banksList}
                                onKeyPress={(e) => keyPressSpaceBar(e)}
                                onSelect={handleSelect}
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                            />
                        </Item>
                    </Col>
                </Row>
                <Row gutter={[12, 2]}>
                    <Col span={18}>
                        <Item label={t('myAccount.banks.accountNumber')} name="acc_number" rules={[{ required: false }, { max: 100 }]}>
                            <Input name="acc_number"
                                onKeyPress={(e) => { keyPressSpaceBar(e); clsAlphaNoOnly(e) }} onChange={(e) => handleChange(e)} />
                        </Item>
                    </Col>
                </Row>
                <Row gutter={[12, 2]}>
                    <Col span={18}>
                        <Item label={'Routing number'} name="x_routing_number" rules={[{ required: false }, { max: 50 }]}>
                            <Input name="x_routing_number" onChange={(e) => handleChange(e)} />
                        </Item>
                    </Col>
                </Row>
                <Row gutter={[12, 2]}>
                    <Col span={24}>
                        <Alert
                            description={<><Typography.Text>{t('myAccount.banks.alert')}</Typography.Text> <a href="http://tracking.payoneer.com/aff_c?offer_id=509&aff_id=42280&url_id=1050" target="_blank">Ir a Payoneer</a> </>}
                            type="warning"
                            showIcon
                            closable
                        />
                    </Col>
                </Row>
                <Divider></Divider>
                <Row>
                    {selected === 1 && (
                        <>
                            <Col span={12} className="text-align-left">
                                <Button className="btn-primary"
                                    onClick={() => setSelected(selected - 1)}
                                >{t('myAccount.return')}</Button>

                                <Button className="btn-link-filled-margin"
                                    type="primary" htmlType="submit"
                                    disabled={form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
                                >
                                    {checkProperties(partner?.partner) ? t('myAccount.update') : t('myAccount.save')}
                                    {loading && <Spin indicator={antIcon} className="spin-inside-button" />}
                                </Button>
                            </Col>
                            <Col span={12} className="text-align-right">
                                <Tooltip> {/* title={!checkProperties(partner.partner) && t('myAccount.tooltip1')}> */}
                                    <Button className="btn-link-filled-margin"
                                        type="primary"
                                        disabled={false} //!checkProperties(partner.partner)}
                                        onClick={() => setSelected(selected + 1)}
                                    >
                                        {t('myAccount.next')}
                                    </Button>
                                </Tooltip>
                            </Col>
                        </>
                    )}
                </Row>
            </Form>
        </div>
    )
}