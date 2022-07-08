import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, AutoComplete, Button, Form } from 'antd';
import 'antd/dist/antd.css';
import { validateMessages } from '../../../utils/const';
import { SearchOutlined } from '@ant-design/icons';

const { Item } = Form;

export const OrderSearch = ({ }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm();

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 0,
        },
    }
    return (
        <div id="">
            <Row>
                <Col span={24}>
                    <Form name="formulario" {...formItemLayout} form={form}
                        validateMessages={validateMessages} className="text-align-left"
                    // onFinish={onFinish}
                    >
                        <Row gutter={[12, 2]}>
                            <Col span={18} >
                                <Item label={t('orders.inputSearch')}
                                    // name="bank"
                                    rules={[{ required: true }]}>
                                    <AutoComplete
                                        className="input-width-100-percent"
                                        placeholder="Tipea el nombre" style={{ width: '100%' }}
                                    // options={banksList}
                                    // onKeyPress={(e) => keyPressSpaceBar(e)}
                                    // onSelect={handleSelect}
                                    // filterOption={(inputValue, option) =>
                                    //     option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    // }
                                    />
                                </Item>
                            </Col>
                            <Col span={6} >
                                <Button icon={<SearchOutlined />} className="btn-primary" >
                                    {t('orders.buttonSearch')}
                                </Button>
                            </Col>

                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}