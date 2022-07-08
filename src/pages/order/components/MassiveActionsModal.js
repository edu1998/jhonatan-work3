import { Col, Divider, Modal, Row, Tabs, Form, Input, Button, Select, Spin } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import orderApi from '../../../api/order';
import orderDocumentsApi from '../../../api/order-documents';
import { orderGeneralStates } from '../../../utils/const';
import { useSelector } from 'react-redux';
import SvgCircleWarning from "../../../utils/icons/SvgCircleWarning";
import SvgAirplane from "../../../utils/icons/SvgAirplane";

import {
    EditOutlined,
    CheckCircleFilled,
} from "@ant-design/icons";
const { Option } = Select;
const { TabPane } = Tabs;
const { Item } = Form;

export const MassiveActionsModal = ({ visible, setVisible, selectedOrders, getOrders }) => {

    const { t } = useTranslation();
    const session = useSelector((store) => store.Session.session);
    const [tab, setTabs] = useState('1');
    const [loadingOrderApi, setLoadingOrderApi] = useState(false);
    const [documents, setDocuments] = useState([]);

    const [transportDocumentsForm] = Form.useForm();
    const [changeStateForm] = Form.useForm();
    const [notificationsForm] = Form.useForm();

    useEffect(() => {
        changeStateForm.resetFields();
    }, [selectedOrders])

    const canChangeState = () => {
        let uniqueState = selectedOrders.every((val, i, arr) => val.state === selectedOrders[0].state)
        if (uniqueState && session?.userInfo?.isAdmin) {
            return true;
        }
        return false;
    }

    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }

    const handleFormOk = () => {
        switch (tab) {
            case '1':
                transportDocumentsForm.submit();
                break;
            case '2':
                changeStateForm.submit();
                break;
            case '3':
                notificationsForm.submit();
                break;
            default: break;
        };
    };

    const transportDocumentsSubmit = async (formFields) => {
        setLoadingOrderApi(true);
        await orderApi.updateShippingData(selectedOrders.map(order => (order.key)).join(','), { shippingDocumentId: formFields.document_id })
            .then((response) => {
                openNotification({ status: true, content: 'Datos cambiados con éxito.' });
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingOrderApi(false);
        getOrders();
        setVisible(false);
    }

    const changeStateSubmit = async (formFields) => {
        setLoadingOrderApi(true);
        await orderApi.changeState(selectedOrders.map(order => (order.key)).join(','), { state: formFields.x_state, amazonOrders: formFields.amazonOrders, note: formFields.x_note })
            .then((response) => {
                openNotification({ status: true, content: 'Datos cambiados con éxito.' });
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingOrderApi(false);
        getOrders();
        setVisible(false);
    }

    const notificationsSubmit = async (formFields) => {
        setLoadingOrderApi(true);
        await orderApi.saveNote(selectedOrders.map(order => (order.key)).join(','), { step: null, message: formFields.x_content })
            .then((response) => {
                openNotification({ status: true, content: 'Nota enviada con éxito.' });
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingOrderApi(false);
        setVisible(false);
    }

    useEffect(() => {
        getAllDocuments();
    }, []);

    const getAllDocuments = async () => {
        setLoadingOrderApi(true);
        await orderDocumentsApi.findAll()
            .then((response) => {
                setDocuments(response.data);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingOrderApi(false);
    }

    const handleChangeTabs = (key) => setTabs(key);

    return (
        <div>
            <Modal
                title={t('orders.newOrder.table.modal.title')}
                centered
                width={1000}
                visible={visible}
                onOk={handleFormOk}
                onCancel={() => setVisible(false)}
                cancelText={t('orders.newOrder.table.modal.buttonCancel')}
                okText={tab < 3 ? t('orders.newOrder.table.modal.buttonUpdate') : t('orders.newOrder.table.modal.buttonSend')}
                cancelButtonProps={tab < 3 ? { disabled: false } : { style: { display: 'none' } }}
                okButtonProps={((tab == 2 && !canChangeState()) || loadingOrderApi) ? { disabled: true } : {}}
            >
                {!loadingOrderApi ? (
                    <Row>
                        <Col span={24}>
                            <Tabs defaultActiveKey="1" onChange={handleChangeTabs}>
                                <TabPane tab={t('orders.newOrder.table.modal.tab1')} key="1">
                                    <h3>{t('orders.newOrder.table.modal.tab1Title')}</h3>
                                    <Divider className="divider-margin" orientation="left" />
                                    <Form name="formulario" form={transportDocumentsForm} {...formItemLayout} onFinish={transportDocumentsSubmit}>
                                        <Row>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item label={t('orders.newOrder.contents.input3')} name="document_id" rules={[{ required: true }]}>
                                                    <Select name="document_id" defaultValue="" style={{ width: '100%' }}>
                                                        {documents?.map((document) =>
                                                            <Option key={document.shippingDocId} value={document.id}>{document.shippingDocId}</Option>
                                                        )}
                                                    </Select>
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </TabPane>
                                <TabPane tab={t('orders.newOrder.table.modal.tab2')} key="2">
                                    <h3>{t('orders.newOrder.table.modal.tab2Title')}</h3>
                                    <Divider className="divider-margin" orientation="left" />
                                    <Form name="formulario" form={changeStateForm} {...formItemLayout} onFinish={changeStateSubmit}>
                                        <Row>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item
                                                    name="x_state" rules={[{ required: true }]}
                                                    label={t('orders.newOrder.table.modal.changeStateForm.stateInput')}
                                                    tooltip={{
                                                        title: t(`orders.newOrder.table.modal.changeStateForm.stateInputInfo`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Select disabled={!canChangeState()}>
                                                        <Option value="draft" disabled={true}>
                                                            <EditOutlined /> {orderGeneralStates.DRAFT}
                                                        </Option>
                                                        <Option value={orderGeneralStates.CONFIRMED} disabled={selectedOrders[0]?.state !== orderGeneralStates.DRAFT}>
                                                            <CheckCircleFilled className=" primary" /> {orderGeneralStates.CONFIRMED}
                                                        </Option>
                                                        <Option value={orderGeneralStates.SHIPPED} disabled={selectedOrders[0]?.state !== orderGeneralStates.CONFIRMED}>
                                                            <SvgAirplane height={17} width={17} /> {orderGeneralStates.SHIPPED}
                                                        </Option>
                                                        <Option value={orderGeneralStates.ARRIVED_OK} disabled={selectedOrders[0]?.state !== orderGeneralStates.SHIPPED}>
                                                            <CheckCircleFilled className=" green" /> {orderGeneralStates.ARRIVED_OK}
                                                        </Option>
                                                        <Option value={orderGeneralStates.ARRIVED_ERROR} disabled={selectedOrders[0]?.state !== orderGeneralStates.SHIPPED}>
                                                            <SvgCircleWarning
                                                                height={17}
                                                                width={17}
                                                                fill={"#D4485E"}
                                                                strokeWarning={"#FFFF"}
                                                            />
                                                            {orderGeneralStates.ARRIVED_ERROR}
                                                        </Option>
                                                    </Select>
                                                </Item>
                                            </Col>

                                            <Form.Item
                                                noStyle
                                                shouldUpdate={(prevValues, currentValues) => {
                                                    if (prevValues.x_state != orderGeneralStates.SHIPPED && currentValues.x_state == orderGeneralStates.SHIPPED) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }}
                                            >
                                                {({ getFieldValue }) =>
                                                    getFieldValue(['x_state']) === orderGeneralStates.SHIPPED ? (
                                                        <>
                                                        {selectedOrders.map((selOrder)=>{
                                                            return (
                                                                <Col xs={24} sm={24} md={24}>
                                                                    <Item label={"Amazon Order Id (" + selOrder.id + ")"} name={['amazonOrders', selOrder.id.toString()]} rules={[{ required: true }]}>
                                                                        <Input/>
                                                                    </Item>
                                                                </Col>
                                                            );
                                                        })}
                                                        </>
                                                    ) : null
                                                }
                                            </Form.Item>

                                            <Col xs={24} sm={24} md={24}>
                                                <Item
                                                    name="x_note" rules={[{ required: true }]}
                                                    label={t('orders.newOrder.table.modal.changeStateForm.noteTextArea')}
                                                    tooltip={{
                                                        title: t(`orders.newOrder.table.modal.changeStateForm.noteTextAreaInfo`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input.TextArea
                                                        rows={4}
                                                        name="x_note"
                                                    />
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </TabPane>
                                <TabPane tab={t('orders.newOrder.table.modal.tab3')} key="3">
                                    <h3>{t('orders.newOrder.table.modal.tab3Title')}</h3>
                                    <Divider className="divider-margin" orientation="left" />
                                    <Form name="formulario" form={notificationsForm} {...formItemLayout} onFinish={notificationsSubmit}>
                                        <Row>
                                            <Col xs={24} sm={24} md={24}>
                                                <Item
                                                    name="x_content" rules={[{ required: true }]}
                                                    label={t('orders.newOrder.table.modal.notificationsForm.contentTextArea')}
                                                    tooltip={{
                                                        title: t(`orders.newOrder.table.modal.notificationsForm.contentTextAreaInfo`),
                                                        icon: <InfoCircleOutlined />,
                                                    }}>
                                                    <Input.TextArea
                                                        rows={4}
                                                        name="x_content"
                                                    />
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                ) : (
                    <Row justify="center" align="middle" >
                        <Col>
                            <Spin size="large" />
                        </Col>
                    </Row>
                )}
            </Modal>
        </div>
    )
}
