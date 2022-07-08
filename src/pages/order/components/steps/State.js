import React, { useEffect, useState } from 'react';
import {
    Affix, Row, Col, Divider, Input, Button, Menu, Tabs, Alert, Dropdown, Space, Popconfirm, Radio, Form, Select, Spin, Tooltip, Modal, Tag
} from 'antd';
import {
    LoadingOutlined, PrinterFilled, LeftOutlined, SendOutlined,
    WarningOutlined, ExportOutlined, EditOutlined, CheckCircleFilled, InfoCircleOutlined
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SvgCircleWarning from "../../../../utils/icons/SvgCircleWarning";
import SvgAirplane from "../../../../utils/icons/SvgAirplane";
import orderApi from '../../../../api/order';
import { openNotification } from '../../../../components/Toastr';
import { noteTypes } from '../../../../utils/const';
import { getErrorMessage } from '../../../../api/api';
import { Attachments } from '../Attachments';
import { orderSteps, orderStates, orderGeneralStates } from '../../../../utils/const';
import StateChangeModal from '../StateChangeModal';
import ModalRejectProposal from '../../../onboarding/components/steps/ModalRejectProposal';
import { saveAs } from 'file-saver';
import fulfillmentApi from '../../../../api/fulfillmentInbound';
import PrintLabelButton from '../PrintLabelButton';

const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

export const State = ({ orderId, setSelected, selected, setSteps, sentType }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm()

    const [tab, setTabs] = useState('Client');
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [statusReceived, setStatusReceived] = useState();
    const [audits, setAudits] = useState([]);
    const [noteToAdd, setNoteToAdd] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingSendByFedEX, setLoadingSendByFedEX] = useState({ index: null, status: false });
    const [modalStateChangeVisible, setModalStateChangeVisible] = useState(false);
    const [successfullyChanged, setSuccessfullyChanged] = useState(false);
    const [nextState, setNextState] = useState();
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [goBack, setGoBack] = useState(false);
    const [successfullyReverted, setSuccessfullyReverted] = useState(false);
    const [loadingExportable, setLoadingExportable] = useState(false);
    const [loadingExportableBoxes, setLoadingExportableBoxes] = useState(false);
    const [loadingLabels, setLoadingLabels] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [formData, setFormData] = useState({ x_unity: 'cm', x_shipping_amount: 0 });
    const [amazonStatus, setAmazonStatus] = useState({});
    const session = useSelector(store => store.Session.session);
    //const loading = useSelector(store => store.Partner.loading);

    const handleChangeTabs = (key) => setTabs(key);

    const state = statusReceived?.state;
    const step = statusReceived?.steps.find(step => step.step === orderSteps.ESTADO);
    const partnerId = statusReceived?.partnerId;

    useEffect(() => {
        getStatus();
    }, []);

    useEffect(() => {
        if (successfullyChanged) {
            setSuccessfullyChanged(false);
            setNextState(null);
            getStatus();
        }
    }, [successfullyChanged]);

    useEffect(() => {
        if (successfullyReverted) {
            setSuccessfullyReverted(false);
            setSteps((prevState) => {
                prevState.find(item => item.id === step.id).state = orderStates.PENDING;
            });
            setSelected(selected - 1);
        }
    }, [successfullyReverted]);

    const getStatus = async () => {
        setLoading(true);
        await orderApi.getStatus(orderId)
            .then((response) => {
                setStatusReceived(response.data);
                let statusRec = response.data;
                let loadingDetails = {};
                if (statusRec.state == orderGeneralStates.SHIPMENT_CREATED) {
                    statusRec.shipmentPlan.InboundShipmentPlans.map((shipment) => {
                        loadingDetails[shipment.ShipmentId] = { loading: true };
                    });
                    loadPlanDetails(statusRec.shipmentPlan.InboundShipmentPlans);
                }

                setAmazonStatus(loadingDetails);
                setAudits(response.data.notes);
                setSteps(response.data.steps);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoading(false);
    }

    const handleCancelForm = async () => {
        setGoBack(true);
        setRemakeModalVisible(true);
    }

    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }

    const handleAddNote = async () => {
        if (noteToAdd === "") {
            openNotification({ status: false, content: `Note can't be saved if it's empty.` });
        } else {
            setLoading(true);
            await orderApi.saveNote(orderId, { step: orderSteps.ESTADO, message: noteToAdd })
                .then((response) => {
                    openNotification({ status: true, content: 'Note added successfully' });
                    setNoteToAdd('');
                    getStatus();
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
        }
        setLoading(false);
    }

    const handleCreatePlan = async () => {
        setLoading(true);
        await orderApi.createPlan(orderId)
            .then((response) => {
                openNotification({ status: true, content: 'Plan created successfully' });
                getStatus();
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoading(false);
    }


    const handleCreateShipment = async () => {
        setLoading(true);
        await orderApi.createShipment(orderId)
            .then((response) => {
                openNotification({ status: true, content: 'Shipment created successfully' });
                getStatus();
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoading(false);
    }

    const sendByFedEX = async (idx) => {
        setLoadingSendByFedEX({ index: idx, status: true });
        await orderApi.sendByFedEX(orderId)
            .then((response) => {
                openNotification({ status: true, content: 'Send by FedEX successfully' });
                getStatus();
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingSendByFedEX({ index: null, status: false });
    }

    const handleChangeState = (text) => {
        setLoading(true);
        setNextState(text);
        setModalStateChangeVisible(true);
        setLoading(false);
    }

    const handleExport = async () => {

        setLoadingExportable(true);
        try {
            const { data } = await orderApi.getExcelReport([statusReceived.id]);
            const filename = `orders: ${new Date()}.xlsx`;
            let blob = new Blob([data], { type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            saveAs(blob, filename);
        } catch (error) {
            console.log('onClickExportHandler#Orders', error);
        } finally {
            setLoadingExportable(false);
        }
    };

    const handleExportBoxes = async () => {

        setLoadingExportableBoxes(true);
        try {
            const { data } = await orderApi.getExcelReportBoxes([statusReceived.id]);
            const filename = `orders: ${new Date()}.xlsx`;
            let blob = new Blob([data], { type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            saveAs(blob, filename);
        } catch (error) {
            console.log('onClickExportHandler#Orders', error);
        } finally {
            setLoadingExportableBoxes(false);
        }
    };


    const handlePrintLabels = async (type) => {
        setLoadingLabels(true);
        if (statusReceived.pallets < 1) {
            openNotification({ status: false, content: `ERROR. La orden con id: ${statusReceived.id} tiene menos de 1 pallets, y no es posible imprimir su etiqueta si tiene 0 pallets.` });
            setLoadingLabels(false);
            return;
        }
        if (!statusReceived.amazonId) {
            openNotification({ status: false, content: `ERROR. La orden con id: ${statusReceived.id} no tiene un SHIPING ID definido por lo que no es posbile imrimir su etiqueta.` });
            setLoadingLabels(false);
            return;
        }
        const values = {
            shipingId: statusReceived.amazonId,
            clientId: statusReceived.partnerId,
            pallets: statusReceived.palletCount,
            type: type ? type : 'PALLET',
            marketplace: "amazon"
        }
        session.userInfo.role == 'Admin' ?
            await fulfillmentApi.findShipmentLabelsAdmin(values)
                .then((response) => {
                    if (response.data != null && response.data != undefined) window.location.href = response.data;
                })
                .catch((error) => {
                    console.log("El error de getLabelsURL: ", error.message);
                    openNotification({ status: false, content: getErrorMessage(error) });
                })
            : await fulfillmentApi.findShipmentLabelsClient(values)
                .then((response) => {
                    if (response.data != null && response.data != undefined) window.location.href = response.data;
                })
                .catch((error) => {
                    console.log("El error de getLabelsURL: ", error.message);
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
        setLoadingLabels(false);
    }

    const loadPlanDetails = async (plans) => {
        let details = {}
        for (const plan of plans) {
            try {
                let response = await orderApi.getTransportDetails(orderId, plan.ShipmentId);
                details[plan.ShipmentId] = { ...response.data, loading: false };
            } catch (e) {
                details[plan.ShipmentId] = { loading: false, error: true };
            }
        }
        setAmazonStatus(details);
    }

    return !loading ? (
        <>
            <div id="boxes">
                <Row>
                    <Col span={14} xs={24} sm={12} md={12} className="text-align-left">
                        <h2 className="title-primary">{t('orders.newOrder.state.title')}</h2>
                        <span className="text-color-gray">{t('orders.newOrder.state.titleDescription')} </span>
                    </Col>
                    {session.userInfo.isAdmin &&
                        <Col span={14} xs={24} sm={12} md={12} className="text-align-right">
                            <Affix offsetTop={10}>
                                <Space>
                                    {
                                        statusReceived?.state == orderGeneralStates.CONFIRMED && <Button onClick={handleCreatePlan}>Crear plan</Button>
                                    }
                                    {
                                        statusReceived?.state == orderGeneralStates.PLAN_CREATED && <Button onClick={handleCreateShipment}>Crear Shipment</Button>
                                    }

                                    {statusReceived?.isPack ?
                                        <Button loading={loadingExportableBoxes} onClick={handleExportBoxes} icon={<ExportOutlined />} className="btn-primary">{t('orders.newOrder.exportButtonBoxes')}</Button>
                                        :
                                        <Button loading={loadingExportable} onClick={handleExport} icon={<ExportOutlined />} className="btn-primary">{t('orders.newOrder.exportButton')}</Button>
                                    }
                                    {statusReceived?.state == orderGeneralStates.SHIPMENT_CREATED && statusReceived.amazonId &&
                                        <PrintLabelButton boxes={statusReceived.boxes} pallets={statusReceived.palletCount} clientId={statusReceived.partnerId} shippingId={statusReceived.amazonId}></PrintLabelButton>
                                    }
                                    <Select value={state} bordered={false} onChange={(text) => { handleChangeState(text) }}
                                        disabled={[orderGeneralStates.ARRIVED_ERROR, orderGeneralStates.ARRIVED_OK].includes(state)}>
                                        <Option value={orderGeneralStates.DRAFT} disabled={state !== orderGeneralStates.CONFIRMED}>
                                            <EditOutlined /> {orderGeneralStates.DRAFT}
                                        </Option>
                                        <Option value={orderGeneralStates.CONFIRMED} disabled={![orderGeneralStates.SHIPPED, orderGeneralStates.DRAFT].includes(state)}>
                                            <CheckCircleFilled className=" primary" /> {orderGeneralStates.CONFIRMED}
                                        </Option>
                                        <Option value={orderGeneralStates.SHIPPED} disabled={state !== orderGeneralStates.CONFIRMED}>
                                            <SvgAirplane height={17} width={17} /> {orderGeneralStates.SHIPPED}
                                        </Option>
                                        <Option value={orderGeneralStates.ARRIVED_OK} disabled={state !== orderGeneralStates.SHIPPED}>
                                            <CheckCircleFilled className=" green" /> {orderGeneralStates.ARRIVED_OK}
                                        </Option>
                                        <Option value={orderGeneralStates.ARRIVED_ERROR} disabled={state !== orderGeneralStates.SHIPPED}>
                                            <SvgCircleWarning
                                                height={17}
                                                width={17}
                                                fill={"#D4485E"}
                                                strokeWarning={"#FFFF"}
                                            />
                                            {orderGeneralStates.ARRIVED_ERROR}
                                        </Option>
                                    </Select>

                                </Space>
                            </Affix>
                        </Col>
                    }
                </Row>
                {state === orderGeneralStates.DRAFT &&
                    <Alert className="sticky-alert-message" style={{ position: modalStateChangeVisible && 'relative', zIndex: modalStateChangeVisible && 0 }}
                        action={
                            <Space>
                                <Popconfirm
                                    title={t('orders.confirmGoBack')}
                                    onConfirm={handleCancelForm}
                                    onCancel={() => { }}
                                    icon={<WarningOutlined />}
                                    okText={t('yes')}
                                    cancelText={t('no')}
                                    okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                >
                                    <Button size="small" type="link" icon={<LeftOutlined />} disabled={state !== orderGeneralStates.DRAFT}>
                                        {t('orders.alertButtonGoBack')}</Button>
                                </Popconfirm>
                            </Space>
                        }
                    />
                }
                {statusReceived && (statusReceived.state == orderGeneralStates.PLAN_CREATED || statusReceived.state == orderGeneralStates.SHIPMENT_CREATED) &&
                    <Row style={{ textAlign: 'left' }}>
                        <Col span={24}>
                            <h3>Shipment plans</h3>
                            <Tabs>
                                {
                                    statusReceived.shipmentPlan.InboundShipmentPlans.map((plan, index) => {
                                        return (
                                            <TabPane tab={plan.ShipmentId} key={plan.ShipmentId} >
                                                <Row>
                                                    <Col span={6}>
                                                        {plan.ShipmentId}
                                                    </Col>
                                                    <Col span={10}>
                                                        {plan.ShipToAddress.AddressLine1}, {plan.ShipToAddress.City}, {plan.ShipToAddress.PostalCode}, {plan.ShipToAddress.StateOrProvinceCode}, {plan.ShipToAddress.CountryCode} ({plan.ShipToAddress.Name})
                                                    </Col>
                                                    <Col span={4}>
                                                        <Space direction="vertical" size="small">
                                                            {plan.Items.map((item) => {
                                                                return (
                                                                    <Space size="small">
                                                                        <span>{item.Quantity}</span>
                                                                        <span>{item.SellerSKU}</span>
                                                                    </Space>
                                                                )
                                                            })}
                                                        </Space>
                                                    </Col>
                                                    <Col span={2} />
                                                    <Col span={2} align="right">
                                                        <Tooltip title={t('orders.newOrder.state.sendByFedEX')} placement="top">
                                                            <Popconfirm
                                                                title={t('orders.newOrder.state.confirmSendByFedEX')}
                                                                onConfirm={() => sendByFedEX(index)}
                                                                onCancel={() => { }}
                                                                icon={<WarningOutlined />}
                                                                okText={t('yes')}
                                                                cancelText={t('no')}
                                                                okButtonProps={{ style: { backgroundColor: '#5365E3' } }}>
                                                                <Button
                                                                    style={{ marginRight: 15 }}
                                                                    loading={loadingSendByFedEX.index == index && loadingSendByFedEX.status}>
                                                                    FedEX</Button>
                                                            </Popconfirm>
                                                        </Tooltip>
                                                    </Col>
                                                </Row>
                                                {statusReceived.state == orderGeneralStates.SHIPMENT_CREATED && amazonStatus[plan.ShipmentId] && <>
                                                    <Divider></Divider>
                                                    <Row style={{ textAlign: 'left' }}>
                                                        <Col span={24}>
                                                            <Spin spinning={amazonStatus[plan.ShipmentId].loading} >
                                                                <Space>
                                                                    <h4>Shipping service</h4>
                                                                    {!amazonStatus[plan.ShipmentId].loading && !amazonStatus[plan.ShipmentId].error &&
                                                                        <Tag>{amazonStatus[plan.ShipmentId].TransportContent.TransportResult.TransportStatus}</Tag>
                                                                    }
                                                                </Space>
                                                                {!amazonStatus[plan.ShipmentId].loading && !amazonStatus[plan.ShipmentId].error &&
                                                                    <Form initialValues={amazonStatus[plan.ShipmentId]}>
                                                                        <Row>
                                                                            <Col span={24}>
                                                                                <Form.Item label="Shipping method" name={['TransportContent', 'TransportHeader', 'ShipmentType']}>
                                                                                    <Radio.Group>
                                                                                        <Space direction="vertical">
                                                                                            <Radio value={'SP'}>Small parcel (Paquetes individuales)</Radio>
                                                                                            <Radio value={'LTL'}>Less than truckload (Palletizado)</Radio>
                                                                                        </Space>
                                                                                    </Radio.Group>
                                                                                </Form.Item>
                                                                                <Form.Item label="Shipping type">
                                                                                    {statusReceived.shippingType}
                                                                                </Form.Item>
                                                                            </Col>
                                                                        </Row>
                                                                    </Form>
                                                                }
                                                                {!amazonStatus[plan.ShipmentId].loading && amazonStatus[plan.ShipmentId].error &&
                                                                    <Row>
                                                                        <Col span={24}>
                                                                            <Alert message={amazonStatus[plan.ShipmentId].description} type="error" />
                                                                        </Col>
                                                                    </Row>
                                                                }
                                                            </Spin>
                                                        </Col>
                                                    </Row>
                                                </>}
                                            </TabPane>
                                        )
                                    })
                                }
                            </Tabs>
                        </Col>
                    </Row>
                }

                <Divider className="divider-margin" orientation="left" />
                <Attachments orderId={orderId} partnerId={partnerId} state={state} sentType={sentType} />
                <Divider className="divider-margin" orientation="left" />
                <Row>
                    <Col xs={24} sm={12} md={16}>
                        <h2 className="title-primary" style={{ textAlign: 'left' }}>{t('orders.newOrder.state.subtitle2')}</h2>
                        <Divider className="divider-margin" orientation="left" />
                        {audits?.map(item => (
                            <div key={item.id} className="row-record">
                                <Row className="text-color-gray">
                                    <Col style={{ textAlign: 'left' }} span={12}>{item.date}</Col>
                                    <Col style={{ textAlign: 'right' }} span={12}>{item.step ? item.step : ''}</Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {`${item.author} `}
                                        <span style={{ color: '#5365E3', fontWeight: '600' }}>
                                            {item.type === noteTypes.ACCEPTED_PROPOSAL && 'ha aceptado la propuesta.'}
                                            {item.type === noteTypes.CREATE_ORDER && 'ha creado la orden.'}
                                            {item.type === noteTypes.NOTE && 'ha agregado una nota.'}
                                            {item.type === noteTypes.REJECTED_PROPOSAL && 'ha rechazado la propuesta.'}
                                            {item.type === noteTypes.SENT_PROPOSAL && 'ha enviado una propuesta.'}
                                            {item.type === noteTypes.STATE_CHANGE && `ha cambiado el estado de la orden a ${item.newState}.`}
                                            {item.type === noteTypes.GO_BACK && ((item.step && item.step === orderSteps.CONTENIDO) ? `ha cancelado la orden.` : `ha revertido un paso de la orden.`)}
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>{item.message ? item.message : ''}</Col>
                                </Row>
                            </div>
                        ))}
                    </Col>
                    <Col xs={24} sm={12} md={8} style={{ paddingLeft: 20 }}>
                        <h2 className="title-primary" style={{ textAlign: 'left' }}>{t('orders.newOrder.state.subtitle3')}</h2>
                        <Divider className="divider-margin" orientation="left" />
                        <Row>
                            <Col sxs={24} sm={24} md={24} >
                                <Input.TextArea
                                    rows={4}
                                    name="commentsLAP"
                                    onChange={(event) => { setNoteToAdd(event.currentTarget.value) }}
                                />
                                <Button type="primary" onClick={handleAddNote} disabled={state !== orderGeneralStates.DRAFT} style={{ marginTop: '20px', float: 'left' }}>{t('orders.buttonSave')}</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} sm={24} md={24}></Col>
                        </Row>
                    </Col>
                </Row>
                {session.userInfo.isAdmin &&
                    <Row justify="end">
                        <Col span={14} xs={24} sm={12} md={12} className="text-align-right">
                            <Affix offsetBottom={10}>
                                <Space>
                                    {statusReceived?.isPack ?
                                        <Button loading={loadingExportableBoxes} onClick={handleExportBoxes} icon={<ExportOutlined />} className="btn-primary">{t('orders.newOrder.exportButtonBoxes')}</Button>
                                        :
                                        <Button loading={loadingExportable} onClick={handleExport} icon={<ExportOutlined />} className="btn-primary">{t('orders.newOrder.exportButton')}</Button>
                                    }
                                    {statusReceived?.state == orderGeneralStates.SHIPPED && statusReceived.amazonId &&
                                        <PrintLabelButton boxes={statusReceived.boxes} pallets={statusReceived.palletCount} clientId={statusReceived.partnerId} shippingId={statusReceived.amazonId}></PrintLabelButton>
                                    }
                                    <Select value={state} bordered={false} onChange={(text) => { handleChangeState(text) }}
                                        disabled={[orderGeneralStates.ARRIVED_ERROR, orderGeneralStates.ARRIVED_OK].includes(state)}>
                                        <Option value={orderGeneralStates.DRAFT} disabled={state !== orderGeneralStates.CONFIRMED}>
                                            <EditOutlined /> {orderGeneralStates.DRAFT}
                                        </Option>
                                        <Option value={orderGeneralStates.CONFIRMED} disabled={![orderGeneralStates.SHIPPED, orderGeneralStates.DRAFT].includes(state)}>
                                            <CheckCircleFilled className=" primary" /> {orderGeneralStates.CONFIRMED}
                                        </Option>
                                        <Option value={orderGeneralStates.SHIPPED} disabled={state !== orderGeneralStates.CONFIRMED}>
                                            <SvgAirplane height={17} width={17} /> {orderGeneralStates.SHIPPED}
                                        </Option>
                                        <Option value={orderGeneralStates.ARRIVED_OK} disabled={state !== orderGeneralStates.SHIPPED}>
                                            <CheckCircleFilled className=" green" /> {orderGeneralStates.ARRIVED_OK}
                                        </Option>
                                        <Option value={orderGeneralStates.ARRIVED_ERROR} disabled={state !== orderGeneralStates.SHIPPED}>
                                            <SvgCircleWarning
                                                height={17}
                                                width={17}
                                                fill={"#D4485E"}
                                                strokeWarning={"#FFFF"}
                                            />
                                            {orderGeneralStates.ARRIVED_ERROR}
                                        </Option>
                                    </Select>

                                </Space>
                            </Affix>
                        </Col>
                    </Row>
                }
            </div>
            <StateChangeModal orderId={orderId} state={state} modalStateChangeVisible={modalStateChangeVisible} setModalStateChangeVisible={setModalStateChangeVisible} setSuccessfullyChanged={setSuccessfullyChanged} nextState={nextState} />
            <ModalRejectProposal remakeModalVisible={remakeModalVisible} setRemakeModalVisible={setRemakeModalVisible} partnerId={session.userInfo.partner_id[0]} listingId={null} formItemLayout={formItemLayout} setMyOrder={setStatusReceived} step={orderSteps.ESTADO} orderId={orderId} goBack={goBack} setGoBack={setGoBack} setSuccessfullyReverted={setSuccessfullyReverted} />
        </>
    ) : (
        <Row justify="center" align="middle" >
            <Col>
                <Spin size="large" />
            </Col>
        </Row>
    )
}