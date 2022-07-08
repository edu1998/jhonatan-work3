import React, { useEffect, useState } from 'react';
import {
    Row, Col, Divider, Input, Button, Spin, Tabs, Alert, Space, Popconfirm, Form, Select,
    InputNumber, Table, Radio, Card, Progress, Tooltip, DatePicker, Typography, Affix, Collapse
} from 'antd';
import {
    LoadingOutlined, InfoCircleOutlined, DownloadOutlined, LeftOutlined, SendOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { ReactReduxContext, useSelector } from 'react-redux';
import 'antd/dist/antd.css';
import '../../../onboarding/onboarding.css';
import { useTranslation } from 'react-i18next';
import { maxLength2000, orderGeneralStates, orderStates, orderSteps, shippingTypes, validateMessages } from '../../../../utils/const';
import { openNotification } from '../../../../components/Toastr';
import orderApi from '../../../../api/order';
import { Attachments } from '../Attachments';
import useOrderBoxes from '../../hooks/useOrderBoxes';
import Notes from '../Notes';
import Pending from '../../../onboarding/components/steps/Pending';
import ModalRejectProposal from '../../../onboarding/components/steps/ModalRejectProposal';
import ProposalAlert from '../../../onboarding/components/steps/ProposalAlert';
import AcceptedProposalAlert from '../../../onboarding/components/steps/AcceptedProposalAlert';
import { canEdit } from '../../../../utils/functions';
import { createGlobalStyle } from 'styled-components';
import moment from 'moment';
const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;
const { Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;


export const Boxes = ({ orderId, setSelected, selected, setSteps, setSentType }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm()
    const [formPerSku] = Form.useForm()
    const [formPerBox] = Form.useForm()
    const session = useSelector(store => store.Session.session)

    const [tab, setTabs] = useState(session?.userInfo?.isAdmin ? 'LAP' : 'Client');
    const [canSave, setCanSave] = useState(true);
    const [canEditItem, setCanEditItem] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState();
    const [columnsSkuPerBox, setColumnsSkuPerBox] = useState([]);
    const [goBack, setGoBack] = useState(false);
    const [successfullyReverted, setSuccessfullyReverted] = useState(false);
    const [currentTab, setCurrentTab] = useState("Amazon");

    const handleChangeTabs = (key) => setTabs(key);

    const {
        formData,
        setFormData,
        newRowDataBox,
        newRowSkuPerBox,
        skuPerBoxPercent,
        skuPerCasePercent,
        loading,
        LAPComment,
        setLAPComment,
        handleSaveDraft,
        handleSendBoxes,
        onFinishFailed,
        dataBoxes,
        setDataBoxes,
        orderBoxesData,
        dataSkuPerBox,
        orderBoxesRetrieved,
        setOrderBoxesRetrieved,
        setDataSkuPerBox,
        setOrderBoxesData,
        /* handle modal Proposal */
        acceptedProposal,
        setAcceptedProposal,
        onClickAcceptProposal,
        onClickRejectProposal,
        remakeModalVisible,
        setRemakeModalVisible,
        /* handle data boxes*/
        handleOnChangeDataByBox,
        handleOnChangeDataByBoxByProducts,
        calculateSkuPerBoxPercent,
        checkTotalQuantityPerSkuPerSingleCase,
        isValidTotalQuantityPerSku
    } = useOrderBoxes({ orderId, tab, form, formPerBox, formPerSku, setSteps });

    const step = orderBoxesRetrieved?.steps.find(step => step.step === orderSteps.CAJAS);
    console.log(step,'box')
    const state = orderBoxesRetrieved?.state;

    useEffect(() => {
        if (session && tab && step?.state) {
            setCanEditItem(!canEdit(session, tab, step?.state));
        }
    }, [session, tab, step?.state])

    useEffect(() => {
        setColumnsSkuPerBox([...skuPerBoxPackColumns])
        setLAPComment(step?.LAPComment)
    }, [])

    useEffect(() => {
        if (orderBoxesRetrieved && Object.entries(orderBoxesRetrieved).length > 0) {       
            const boxesToUse = orderBoxesRetrieved?.owners[0];
            const productsForm = {};
            if (orderBoxesRetrieved.steps.find(step => step.step === orderSteps.CAJAS).state === orderStates.COMPLETED) {
                setAcceptedProposal(true);
            }
            const lapComment = step.LAPComment;
            setSelectedPartner(boxesToUse.clientId);
            form.setFieldsValue({
                commentLAP: lapComment
            });
        }
    }, [loading]);

    useEffect(() => {
        if (successfullyReverted) {
            setSuccessfullyReverted(false);
            setSteps((prevState) => {
                prevState.find(item => item.id === step.id).state = orderStates.PENDING;
            });
            setSelected(selected - 1);
        }
    }, [successfullyReverted]);

    const handleAddColumn = () => {
        const columns = skuPerBoxPackColumns
        let newColumns = []
        formData?.orderBoxesDto?.forEach((item, boxIndex) => {
            newColumns.push({
                title: "CAJA " + (boxIndex + 1),
                dataIndex: item.id,
                key: item.id,
                render: (text, record, productIndex) => {
                    return (
                        <Item onChange={() => {
                            calculateSkuPerBoxPercent(formPerSku.getFieldsValue().allProducts);
                        }} label={''} initialValue={0} name={['allProducts', productIndex, 'boxes', boxIndex]} rules={[{ required: false }]}>
                            <InputNumber min={0} max={record.quantity} className="step-boxes-dinamic-columns" style={{ width: '100%' }}
                                disabled={canEditItem || state !== orderGeneralStates.DRAFT} />
                        </Item>
                    )
                }
            })

        })
        setColumnsSkuPerBox([...columns, ...newColumns])
    }

    const handleCancelForm = async () => {
        setGoBack(true);
        setRemakeModalVisible(true);
    }

    const updateStep = (updatedSteps) => {
        let newSteps = [...orderBoxesRetrieved.steps];
        for (const stp of newSteps) {
            let updated = updatedSteps.find((updatedStep) => { return updatedStep.step === stp.step });
            if (updated) {
                stp.state = updated.state;
            }
        }
        setSteps(newSteps);
    }

    useEffect(() => {
        if (dataBoxes?.length > 0)
            handleAddColumn()
    }, [dataBoxes])

    useEffect(() => {
        formData?.pack == true ? setSentType(true) : setSentType(false)        
        let indexOwners = orderBoxesRetrieved?.owners?.findIndex(e => e.owner === tab)
        let currentOwner = orderBoxesRetrieved?.owners[indexOwners]
        if (formData?.boxQuantity > 0 && formData?.pack) {
            let list = []
            if (currentOwner?.orderBoxesDto?.length === formData?.boxQuantity) {
                const newvalue = currentOwner?.orderBoxesDto?.map((item, index) => ({
                    ...item,
                    quantity_per_box: 0,
                    id: `${newRowDataBox.id}${index + 1}`,
                    width: item?.width,
                    length: item?.length, weight: item?.weight, height: item?.height, quantity: item?.quantity
                }))
                setDataBoxes(newvalue);
            } else if (currentOwner?.orderBoxesDto?.length < formData?.boxQuantity) {
                list = currentOwner?.orderBoxesDto?.map((item, index) => ({
                    ...item,
                    quantity_per_box: 0,
                    id: `${newRowDataBox.id}${index + 1}`,
                    width: item?.width, length: item?.length, weight: item?.weight, height: item?.height, quantity: item?.quantity
                }))
                const amountRest = formData?.boxQuantity - list.length
                for (let index = 0; index < amountRest; index++) {
                    list.push({
                        ...newRowDataBox,
                        id: `${newRowDataBox.id}${list.length + 1}`,
                        width: null, length: null, weight: null, height: null, quantity: null
                    })
                }
                setDataBoxes(list)
            } else if (currentOwner?.orderBoxesDto?.length > formData?.boxQuantity) {
                list = currentOwner?.orderBoxesDto?.slice(0, formData?.boxQuantity)
                const newvalue = list.map((item, index) => ({
                    ...item,
                    quantity_per_box: 0,
                    id: `${newRowDataBox.id}${index + 1}`,
                    width: item?.width, length: item?.length, weight: item?.weight, height: item?.height, quantity: item?.quantity
                }))
                setDataBoxes(newvalue)
            } else {
                return
            }
        } else { }
    }, [formData])

    const boxDataColumns = [
        {
            title: t('orders.newOrder.boxes.boxDataColumns.id'),
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: (text, record, index) => <a>CAJA {index + 1}</a>
        },
        {
            title: <Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.width')} ({formData?.unity?.toUpperCase()})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.medidasTooltip')}</span> </Space>,
            dataIndex: 'width',
            key: 'width',
            render: (text, record, index) => {
                return (
                    <Item name={['orderBoxesDto', index, "width"]} rules={[{ required: true }]}>
                        <InputNumber min={0} max={formData?.unity?.toUpperCase() == "CM" ? 63.5 : 25} disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT} min={0} style={{ width: '100%' }} />
                    </Item>
                )
            }
        },
        {
            title: <Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.height')} ({formData?.unity?.toUpperCase()})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.medidasTooltip')}</span> </Space>,
            dataIndex: 'height',
            key: 'height',
            render: (text, record, index) => {
                return (
                    <Item name={['orderBoxesDto', index, "height"]} rules={[{ required: true }]}>
                        <InputNumber min={0} max={formData?.unity?.toUpperCase() == "CM" ? 63.5 : 25} style={{ width: '100%' }} name="height" disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>
                );
            }
        },
        {

            title: <Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.long')} ({formData?.unity?.toUpperCase()})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.medidasTooltip')}</span> </Space>,
            dataIndex: 'length',
            key: 'length',
            render: (text, record, index) => {
                return (
                    <Item name={['orderBoxesDto', index, "length"]} rules={[{ required: true }]}>
                        <InputNumber min={0} max={formData?.unity?.toUpperCase() == "CM" ? 63.5 : 25} style={{ width: '100%' }} name="length" disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>
                );
            }
        },
        {
            title: <Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.weight')} ({formData?.unity?.toUpperCase() == "CM" ? "KG" : "LBS"})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.pesoTooltip')}</span> </Space>,
            dataIndex: 'weight',
            key: 'weight',
            render: (text, record, index) => {
                return (
                    <Item name={['orderBoxesDto', index, "weight"]} rules={[{ required: true }]}>
                        <InputNumber min={0} max={formData?.unity?.toUpperCase() == "CM" ? 22.69 : 50} style={{ width: '100%' }} name="weight" disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>
                );
            }
        },
        {
            title: '',
            dataIndex: 'weight',
            key: 'weight',
            width: 800,
        },
    ];

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < moment().add(1, 'years').endOf('day');
    }

    const skuPerBoxPackColumns = [
        {
            title: t('orders.newOrder.boxes.skuPerBoxColumns.sku'),
            dataIndex: 'sku',
            key: 'sku',
            width: 200,
            render: (text, record, index) => <a>
                {text}
                <Item name={["allProducts", index, "sku"]} hidden>
                    <Input type="hidden"></Input>
                </Item>
                <Item name={["allProducts", index, "quantity"]} hidden>
                    <Input type="hidden"></Input>
                </Item>
            </a>
        },
        {
            title: t('orders.newOrder.boxes.skuPerBoxColumns.units'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
        },
        {
            title: "FECHA DE VENCIMIENTO",
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            width: 150,
            render: (text, record, index) => (
                <Item initialValue={text ? moment(text) : null} name={["allProducts", index, "expiration_date"]} rules={[{ required: false }]}>
                    <DatePicker format={'DD/MM/yyyy'} defaultPickerValue={moment().add(1, 'years')} disabledDate={disabledDate} disabled={tab!='Client' ||canEditItem || state !== orderGeneralStates.DRAFT} />
                </Item>
            )
        },
        {
            title: "CODIGO ARANCELARIO",
            dataIndex: 'tax_code',
            key: 'tax_code',
            width: 150,
            render: (text, record, index) => (
                <Item name={["allProducts", index, "tax_code"]} rules={[{ required: false }]}>
                    <Input disabled={tab!='Client' ||canEditItem || state !== orderGeneralStates.DRAFT}></Input>
                </Item>
            )
        },
        {
            title: "",
            dataIndex: 'units_pack',
            key: 'units_pack',
            width: 200,
        },

    ];  

    const skuPerBoxSingleCaseColumns = [
        {
            title: t('orders.newOrder.boxes.skuPerBoxColumns.sku'),
            dataIndex: 'sku',
            key: 'sku',
            width: 200,
            render: text => <Typography.Link>{text}</Typography.Link>,
        },
        {
            title: t('orders.newOrder.boxes.skuPerBoxColumns.amountBoxes'),
            dataIndex: 'boxes',
            key: 'boxes',
            render: (text, record, index) => {
                return (
                    <Item onChange={() => { checkTotalQuantityPerSkuPerSingleCase(formPerSku.getFieldsValue().allProducts) }} name={["allProducts", index, "boxes"]} rules={[{ required: true }]}>
                        <InputNumber min={0} max={150} style={{ width: '100%' }} disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>
                )
            }
        },
        {
            title: "Fecha de vencimiento",
            dataIndex: 'expiration_date',
            key: 'expiration_date',
            width: 150,
            render: (text, record, index) => (
                <Item initialValue={text ? moment(text) : null} name={["allProducts", index, "expiration_date"]} rules={[{ required: false }]}>
                    <DatePicker format={'DD/MM/yyyy'} defaultPickerValue={moment().add(1, 'years')} disabledDate={disabledDate} disabled={tab!='Client' || (canEditItem || state !== orderGeneralStates.DRAFT)} />
                </Item>
            )
        },
        {
            title: "CÓDIGO ARANCELARIO",
            dataIndex: 'tax_code',
            key: 'tax_code',
            width: 150,
            render: (text, record, index) => (
                <Item name={["allProducts", index, "tax_code"]} rules={[{ required: false }]}>
                    <Input disabled={tab!='Client' ||canEditItem || state !== orderGeneralStates.DRAFT}></Input>
                </Item>
            )
        },        
        {
            title: t('orders.newOrder.boxes.skuPerBoxColumns.units'),
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record, index) => <a>
                {text}
                <Item hidden name={["allProducts", index, "quantity"]}>
                    <Input type="hidden"></Input>
                </Item>
                <Item hidden name={["allProducts", index, "sku"]}>
                    <Input type="hidden"></Input>
                </Item>
            </a>,
        },
        {

            title: <Tooltip title={t('orders.newOrder.boxes.medidasTooltip')}>
                {`${t('orders.newOrder.boxes.skuPerBoxColumns.unitsPerBox')}`}<InfoCircleOutlined />
            </Tooltip>,
            dataIndex: 'perBox',
            key: 'perBox',
            render: (text, record, index) => {
                return (
                    <Item name={["allProducts", index, "perBox"]} rules={[{ required: true }]}>
                        <InputNumber onChange={calculateSkuPerBoxPercent} onChange={() => { checkTotalQuantityPerSkuPerSingleCase(formPerSku.getFieldsValue().allProducts) }} min={0} max={150} style={{ width: '100%' }} disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>
                )
            }
        },
        {
            title: t('orders.newOrder.boxes.skuPerBoxColumns.box'),
            dataIndex: 'box',
            key: 'box',
            render: (text, record, index) => <a>{'CAJA' + (index + 1)}</a>
        },
        {
            title:<Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.width')} ({formData?.unity?.toUpperCase()})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.medidasTooltip')}</span> </Space>,
            dataIndex: 'width',
            key: 'width',
            render: (text, record, index) => {
                return (
                    <Item name={["allProducts", index, "width"]} rules={[{ required: true }]}>
                        <InputNumber precision={2} min={0} max={formData?.unity?.toUpperCase() == "CM" ? 63.5 : 25} style={{ width: '100%' }} disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>
                )
            }
        },
        {
            title: <Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.height')} ({formData?.unity?.toUpperCase()})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.medidasTooltip')}</span> </Space>,
            dataIndex: 'height',
            key: 'height',
            render: (text, record, index) => {
                return (
                    <Item name={["allProducts", index, "height"]} rules={[{ required: true }]}>
                        <InputNumber precision={2} min={0} max={formData?.unity?.toUpperCase() == "CM" ? 63.5 : 25} style={{ width: '100%' }} disabled={tab!='Client' ||canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>
                )
            }
        },
        {
            title: <Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.long')} ({formData?.unity?.toUpperCase()})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.medidasTooltip')}</span> </Space>,
            dataIndex: 'length',
            key: 'length',
            render: (text, record, index) => {
                return (
                    <Item name={["allProducts", index, "length"]} rules={[{ required: true }]}>
                        <InputNumber precision={2} min={0} max={formData?.unity?.toUpperCase() == "CM" ? 63.5 : 25} style={{ width: '100%' }} disabled={tab!='Client' ||canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>

                )
            }

        },
        {
            title: <Space direction="vertical"><span>{t('orders.newOrder.boxes.boxDataColumns.weight')} ({formData?.unity?.toUpperCase() == "CM" ? "KG" : "LBS"})</span><span style={{fontSize:12}}> {t('orders.newOrder.boxes.pesoTooltip')}</span> </Space>,
            dataIndex: 'weight',
            key: 'weight',
            render: (text, record, index) => {
                return (
                    <Item name={["allProducts", index, "weight"]} rules={[{ required: true }]}>
                        <InputNumber precision={2} min={0} max={formData?.unity?.toUpperCase() == "CM" ? 22.69 : 50} style={{ width: '100%' }} disabled={tab!='Client' ||canEditItem || state !== orderGeneralStates.DRAFT} />
                    </Item>

                )
            }
        },

    ];

    const formItemLayout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    }

    return (
        <div id="boxes" className="text-align-left">
            <Spin spinning={loading}>
                <Row>
                    <Col span={14} xs={24} sm={12} md={12} className="">
                        <h2 className="title-primary">{t('orders.newOrder.boxes.title')}</h2>
                        <span className="text-color-gray">{t('orders.newOrder.boxes.titleDescription')} </span>
                    </Col>
                    <Col span={14} xs={24} sm={12} md={12} className="text-align-right">
                        {/* <Button icon={<ExportOutlined />} className="btn-primary"  >{t('orders.newOrder.exportButton')}</Button>
                            <Button icon={<FormOutlined />} className="btn-primary margin-left-10"   >{t('orders.newOrder.draftButton')}</Button> */}
                    </Col>
                </Row>
                <Divider orientation="left" />
                {!acceptedProposal && state === orderGeneralStates.DRAFT && !session.userInfo.isAdmin && step.state === orderStates.PENDING_ACKNOWLEDGE && <ProposalAlert onClickAccept={onClickAcceptProposal} onClickReject={onClickRejectProposal} />}
                {acceptedProposal && state === orderGeneralStates.DRAFT && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />}
                {!session.userInfo.isAdmin && step?.state === orderStates.PENDING_LAP ?
                    <Pending /> :
                    <>
                        {canEdit(session, tab, step?.state) &&
                        <Affix offsetTop={10}>
                            <Alert className="sticky-alert-message"
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
                                            <Button size="small" type="link" icon={<LeftOutlined />} disabled={!canSave}>
                                                {t('orders.alertButtonGoBack')}</Button>
                                        </Popconfirm>
                                        <Button className="btn-primary" icon={<DownloadOutlined />} disabled={!canSave} onClick={handleSaveDraft}>
                                            {t('orders.alertButtonSave')}</Button>
                                        <Button className="btn-link-filled" icon={<SendOutlined />} onClick={() => form.submit()} disabled={!canSave}>
                                            {t('orders.alertButtonSend')}</Button>
                                    </Space>
                                }
                            />
                            </Affix>
                        }
                        {session.userInfo.isAdmin && step?.state === orderStates.PENDING_LAP ? (
                            <Card className="text-align-left">
                                <Row>
                                    <Col span={6}>
                                        <p style={{ fontWeight: 'bold' }}>Comentarios Cliente</p>
                                    </Col>
                                    <Col span={18}>
                                        <p style={{ fontStyle: 'italic' }}>{step.clientMessage}</p>
                                    </Col>
                                </Row>
                            </Card>
                        ) : !session.userInfo.isAdmin && [orderStates.PENDING_ACKNOWLEDGE, orderStates.COMPLETED].includes(step?.state) && (
                            <Card className="text-align-left">
                                <Row>
                                    <Col span={6}>
                                        <p style={{ fontWeight: 'bold' }}>Comentarios LAP</p>
                                    </Col>
                                    <Col span={18}>
                                        <p style={{ fontStyle: 'italic' }}>{step.LAPComment}</p>
                                    </Col>
                                </Row>
                            </Card>
                        )}

                        {true &&
                            <Tabs defaultActiveKey={tab} onChange={handleChangeTabs} >
                                <TabPane
                                    tab={<span>Client </span>}
                                    disabled={session.userInfo.isAdmin ? true : false}
                                    key="Client">
                                </TabPane>
                                <TabPane
                                    tab={<span>LAP</span>}
                                    disabled={!session.userInfo.isAdmin ? true : false }
                                    key="LAP">
                                </TabPane>
                            </Tabs>
                        }
                        <Form name="formulario" form={form} {...formItemLayout}
                            onFinish={handleSendBoxes} onFinishFailed={onFinishFailed}
                            validateMessages={validateMessages} className=" form-padding-top">
                            <Row>
                                <Col xs={24} sm={24} md={24}>
                                    <Item label={t('orders.newOrder.boxes.radioGroup1')} className="input-form-margin-bottom" name="pack"
                                        rules={[{ required: true }]}
                                        tooltip={{
                                            title: t('orders.newOrder.boxes.radioGroup1Description'),
                                            icon: <InfoCircleOutlined />,
                                        }}>
                                        <Radio.Group
                                            onChange={(e) => setFormData({ ...formData, pack: e?.target?.value })}
                                            defaultValue={formData?.pack} disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT}
                                            className="card-radio-group" name="pack">
                                            <Card className="card-radio-inline">
                                                <div className="card-content-div">
                                                    <Radio value={false} >
                                                        <p className="text-card-radio">Case Packed</p>
                                                    </Radio>
                                                </div>
                                                <span className="span-card-radio">{t('orders.newOrder.boxes.radioGroup1Checkbox1')}</span>
                                            </Card>
                                            <Card className="card-radio-inline">
                                                <div className="card-content-div">
                                                    <Radio value={true} >
                                                        <p className="text-card-radio">Case Mixed</p>
                                                    </Radio>
                                                    <span className="span-card-radio">{t('orders.newOrder.boxes.radioGroup1Checkbox2')}</span>
                                                </div>
                                            </Card>
                                        </Radio.Group>
                                    </Item>
                                </Col>
                            </Row>
                            {formData?.shippingType === shippingTypes.BARCO &&
                                <>
                                    <Divider />
                                    <Row>

                                        <Col xs={24} sm={24} md={24}>
                                            <Item label={t('orders.newOrder.contents.input3')} name="pallets" rules={[{ required: true }]}>
                                                <InputNumber onChange={(e) => setFormData({ ...formData, pallets: e })} style={{ width: '10%' }} min={0} disabled={tab == 'LAP' || !canEdit(session, tab, step.state) || state !== orderGeneralStates.DRAFT}
                                                    placeholder={'Cantidad de pallets'}
                                                />
                                            </Item>
                                        </Col>

                                    </Row>
                                </>

                            }

                            {tab == 'Client' &&
                                <>
                                    <Divider />
                                    <Row>
                                        <Col xs={24} sm={24} md={24}>
                                            <Item label={t('orders.newOrder.contents.input6')} name="shippingAmount" rules={[{ required: false }]}>
                                                <InputNumber onChange={(e) => setFormData({ ...formData, shippingAmount: e })} style={{ width: '10%' }} min={0} precision={2} formatter={value => `$ ${orderBoxesRetrieved ? orderBoxesRetrieved.owners[1].shippingAmount ? orderBoxesRetrieved.owners[1].shippingAmount : '' : value}`} parser={value => parseFloat(value.replace('$', '') )} disabled={!canEdit(session, tab, step ? step.state : '') || state === orderGeneralStates.DRAFT}
                                                    placeholder={'Monto en Dólares'} />
                                            </Item>

                                            <Item>
                                            <Collapse style={{ marginBottom: 24 }} bordered={false}>
                                                <Panel styles={{ textAlign: 'left' }} header={'Información'} key={1}>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Text>
                                                            {
                                                                formData?.shippingType === shippingTypes.BARCO ?
                                                                    <>
                                                                    <span>
                                                                        - Para el contenedor LAP Export es el exportador y quien genera factura de exportaci&oacute;n hacia Lap Import (proforma) con los precios FOB correspondientes por marca.</span><br/><span> 
                                                                        - Cada marca debe generar factura comercial hacia LAP Export para que coincidan los precios FOB de exportaci&oacute;n. </span><br/><span>
                                                                        - El costo de env&iacute;o de cada pallet ser&aacute; cobrado por Diego Leal (CEO Lap Imports Corp) una vez que el contenedor salga del puerto.</span><br/><span>
                                                                        - Cualquier costo incurrido en las bodegas de Estados Unidos por concepto de storage, etiquetado, out, rearmado de pallet, entre otros, ser&aacute; cobrado por Diego Leal (CEO Lap Imports Corp).</span><br/><br/><span>  <strong>Costos Bodega: </strong> </span><br/><span> </span><br/><span> &bull; Out: usd 12.5 x Pallet </span><br/><span> &bull; Labeling: usd 0.50 x etiqueta </span><br/><span> &bull; Almacenaje: 30 d&iacute;as libres y despu&eacute;s usd 30 x pallet </span><br/><span> &bull; Rearmado de pallet: usd 45 x pallet </span><br/><span> &bull; Otros costos.   Formato Paletizado Amazon </span><br/><span> &bull; Pallet Americano (Madera Fumigada o Pl&aacute;stico): 100*120 cm. </span><br/><span> &bull; Peso M&aacute;ximo: 680 kg, con pallet incluido (no excluyente, dar aviso). </span><br/><span> &bull; Altura M&aacute;xima: 182 cm, pallet incluido (no excluyente, dar aviso). </span><br/><span> &bull; Sellado del pallet con pl&aacute;stico film.</span><br/>

                                                                    </>
                                                                :
                                                                    <>
                                                                    <span>
                                                                    <br/>
                                                                        - El costo de env&iacute;o depende del peso y volumen de las cajas. </span><br/><span>
                                                                        - Para todo env&iacute;o a&eacute;reo hacia Estados Unidos con valor FOB mayor a 2500 d&oacute;lares y/o con entrada regulada por entidad gubernamental (FDA, FWS, etc) se requiere importador. En caso de no tener, se ofrece servicio de nuestro partner Lap Imports Corp por un valor de 49.90 d&oacute;lares. </span><br/><span>
                                                                        - Para todo env&iacute;o a&eacute;reo desde Chile con valor FOB mayor a 3000 d&oacute;lares se requiere contratar agente de aduanas (dar aviso). </span><br/><span>
                                                                        - Para el env&iacute;o por avi&oacute;n cada marca es la exportadora y quien genera factura de exportaci&oacute;n hacia Amazon con los precios FOB correspondientes. </span>
                                                                    </>
                                                            }
                                                            </Text>
                                                        </Col>
                                                    </Row>
                                                </Panel>
                                            </Collapse>                                          
                                            </Item>                                       
                                        </Col>
                                    </Row>
                                </>

                            }

                            {tab == 'LAP' &&
                                <>
                                    <Divider />
                                    <Row>
                                        <Col xs={24} sm={24} md={24}>
                                            <Item label={t('orders.newOrder.contents.input6')} name="shippingAmount" rules={[{ required: true }]}>
                                                <InputNumber onChange={(e) => setFormData({ ...formData, shippingAmount: e })} style={{ width: '10%' }} min={0} precision={2} formatter={value => `$ ${value}`} parser={value => parseFloat(value.replace('$', ''))} disabled={!canEdit(session, tab, step ? step.state : 'Pendiente LAP') || state !== orderGeneralStates.DRAFT}
                                                    placeholder={'Monto en Dólares'}
                                                />
                                            </Item>
                                            <Item>
                                            {
                                                formData?.shippingType === shippingTypes.BARCO ?
                                                    <>
                                                    <span>
                                                        - Para el contenedor LAP Export es el exportador y quien genera factura de exportaci&oacute;n hacia Lap Import (proforma) con los precios FOB correspondientes por marca.</span><br/><span> 
                                                        - Cada marca debe generar factura comercial hacia LAP Export para que coincidan los precios FOB de exportaci&oacute;n. </span><br/><span>
                                                        - El costo de env&iacute;o de cada pallet ser&aacute; cobrado por Diego Leal (CEO Lap Imports Corp) una vez que el contenedor salga del puerto.</span><br/><span>
                                                        - Cualquier costo incurrido en las bodegas de Estados Unidos por concepto de storage, etiquetado, out, rearmado de pallet, entre otros, ser&aacute; cobrado por Diego Leal (CEO Lap Imports Corp).  Costos Bodega </span><br/><span> &bull; Out: usd 12.5 x Pallet </span><br/><span> &bull; Labeling: usd 0.50 x etiqueta </span><br/><span> &bull; Almacenaje: 30 d&iacute;as libres y despu&eacute;s usd 30 x pallet </span><br/><span> &bull; Rearmado de pallet: usd 45 x pallet </span><br/><span> &bull; Otros costos.   Formato Paletizado Amazon </span><br/><span> &bull; Pallet Americano (Madera Fumigada o Pl&aacute;stico): 100*120 cm. </span><br/><span> &bull; Peso M&aacute;ximo: 680 kg, con pallet incluido (no excluyente, dar aviso). </span><br/><span> &bull; Altura M&aacute;xima: 182 cm, pallet incluido (no excluyente, dar aviso). </span><br/><span> &bull; Sellado del pallet con pl&aacute;stico film.</span><br/>

                                                    </>
                                                :
                                                    <>
                                                    <span>
                                                    <br/>
                                                        - El costo de env&iacute;o depende del peso y volumen de las cajas. </span><br/><span>
                                                        - Para todo env&iacute;o a&eacute;reo hacia Estados Unidos con valor FOB mayor a 2500 d&oacute;lares y/o con entrada regulada por entidad gubernamental (FDA, FWS, etc) se requiere importador. En caso de no tener, se ofrece servicio de nuestro partner Lap Imports Corp por un valor de 49.90 d&oacute;lares. </span><br/><span>
                                                        - Para todo env&iacute;o a&eacute;reo desde Chile con valor FOB mayor a 3000 d&oacute;lares se requiere contratar agente de aduanas (dar aviso). </span><br/><span>
                                                        - Para el env&iacute;o por avi&oacute;n cada marca es la exportadora y quien genera factura de exportaci&oacute;n hacia Amazon con los precios FOB correspondientes. </span>
                                                    </>
                                            }                                                
                                            </Item>                                            
                                        </Col>
                                    </Row>
                                </>

                            }


                            <Divider className="divider-margin" orientation="left" />
                            <Row>
                                <Col xs={24} sm={24} md={24}>
                                    <Item label={t('orders.newOrder.boxes.radioGroup2')} name="unity" rules={[{ required: true }]}>
                                        <Radio.Group
                                            onChange={(e) => setFormData({ ...formData, unity: e?.target?.value })}
                                            defaultValue={formData?.unity} disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT}
                                            className="card-radio-group" name="unity">
                                            <Card className="card-radio-inline">
                                                <div className="card-content-div card-radio-inline">
                                                    <Radio value={'cm'} >
                                                        <p className="text-card-radio">CM/KG</p>
                                                    </Radio>
                                                </div>
                                            </Card>
                                            <Card className="card-radio-inline">
                                                <div className="card-content-div card-radio-inline">
                                                    <Radio value={'inch'} >
                                                        <p className="text-card-radio">IN/LB</p>
                                                    </Radio>
                                                </div>
                                            </Card>
                                        </Radio.Group>
                                    </Item>
                                </Col>
                            </Row>
                            {formData?.pack &&
                                <>
                                    <Divider className="divider-margin" orientation="left" />
                                    <Row>
                                        <Col xs={24} sm={24} md={24}>
                                            <Item label={t('orders.newOrder.boxes.input1')} name="boxQuantity" rules={[{ required: true }]}>
                                                <InputNumber min={0} defaultValue={formData.boxQuantity} style={{ width: '10%' }}
                                                    value={formData?.orderBoxesDto?.length} disabled={tab!='Client' || canEditItem || state !== orderGeneralStates.DRAFT}
                                                    parser={value => value.replace(/\$.\s?|(,*)/g, '')}
                                                    onChange={(value) => {
                                                        let bq = parseInt(value);
                                                        let newBoxes = [formData.orderBoxesDto];
                                                        if (bq > newBoxes.length) {
                                                            for (let index = newBoxes.length; index < bq; index++) {
                                                                newBoxes.push({ products: [] });
                                                            }
                                                        } else {
                                                            newBoxes = newBoxes.slice(0, bq);
                                                        }
                                                        setFormData({ ...formData, orderBoxesDto: newBoxes, boxQuantity: bq })
                                                    }}
                                                    name="boxQuantity"
                                                />
                                            </Item>
                                        </Col>
                                    </Row>
                                </>}
                        </Form>
                        {formData?.pack &&
                            <>
                                <Divider className="divider-margin" />
                                <h2 className="title-primary ">{t('orders.newOrder.boxes.subtitle1')}</h2>
                                <span className="text-color-gray ">{t('orders.newOrder.boxes.subtitleDescription1')} </span>
                                <Divider className="divider-margin" />
                                <Row>
                                    <Col xs={24} sm={24} md={24} >
                                        <Form
                                            form={formPerBox}
                                            layout="flex"
                                            style={{ width: '100%' }}
                                        >
                                            <Table className={"order-form-table"} columns={boxDataColumns} pagination={false} dataSource={formData.orderBoxesDto} scroll={{ x: 1300 }} />
                                        </Form>
                                    </Col>
                                </Row>
                            </>}
                        <Divider className="divider-margin" orientation="left" />
                        <Row>
                            <Col xs={8} sm={8} md={8}>
                                <h2 className="title-primary ">{t('orders.newOrder.boxes.subtitle2')}</h2>
                            </Col>
                            <Col xs={16} sm={16} md={16}>
                                <Row>
                                    <Col xs={8} sm={8} md={8}>{t('orders.newOrder.boxes.subtitle2text1')}: {skuPerBoxPercent?.total}</Col>
                                    <Col xs={8} sm={8} md={8}>
                                        {isValidTotalQuantityPerSku ?
                                            <Progress status={skuPerBoxPercent?.status} percent={skuPerBoxPercent?.percent ? skuPerBoxPercent.percent.toFixed(2) : 0} className="progress" />
                                            : <Progress percent={100} status="exception" className="progress" />}
                                    </Col>
                                    <Col xs={8} sm={8} md={8}>{t('orders.newOrder.boxes.subtitle2text2')}: {skuPerBoxPercent?.totalInBoxes ? skuPerBoxPercent.totalInBoxes : 0}</Col>
                                </Row>
                            </Col>
                        </Row>
                        <span className="text-color-gray">{t('orders.newOrder.boxes.subtitleDescription2')} </span>
                        <Divider className="divider-margin" orientation="left" />
                        <Row>
                            <Col xs={24} sm={24} md={24}>
                                {formData?.pack ?
                                    <Form
                                        form={formPerSku}
                                        layout="flex"
                                        initialValues={formData}
                                        style={{ width: '100%' }}
                                    >

                                        <Table className={"order-form-table"} columns={columnsSkuPerBox} dataSource={formData.allProducts}
                                            scroll={{ x: 1300 }}
                                            pagination={false}
                                            footer={() =>
                                                <Row>
                                                </Row>
                                            }
                                        />
                                    </Form>
                                    :
                                    <Form
                                        form={formPerSku}
                                        layout="flex"
                                        initialValues={formData}
                                        style={{ width: '100%' }}
                                    >
                                        <Table className={"order-form-table"} columns={skuPerBoxSingleCaseColumns} dataSource={formData?.allProducts} />
                                    </Form>
                                }
                            </Col>
                            <Divider className="divider-margin" />
                        </Row>

                        {session?.userInfo?.isAdmin && tab === 'LAP' &&
                            <Row>
                                <Col xs={24} sm={24} md={24}>
                                    <Item label={t('orders.newOrder.boxes.LAPComment')}
                                        name="commentsLAP"
                                        tooltip={{
                                            title: t(`orders.newOrder.boxes.LAPCommentDescription`),
                                            icon: <InfoCircleOutlined />,
                                        }}
                                    >
                                        <Input.TextArea
                                            rows={3}
                                            showCount
                                            maxLength={maxLength2000}
                                            name="commentsLAP"
                                            defaultValue={LAPComment}
                                            onChange={(event) => setLAPComment(event.target.value)}
                                        />
                                    </Item>
                                </Col>
                            </Row>}
                        <Notes orderId={orderId} tab={tab} step={step} state={state} />
                        <Divider className="divider-margin" orientation="left" />
                    </>}

                    {canEdit(session, tab, step?.state) &&
                    <Row justify="end" style={{ marginTop: 24 }}>
                    <Col>
                        <Affix offsetBottom={10}>
                        <Alert className="sticky-alert-message"
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
                                            <Button size="small" type="link" icon={<LeftOutlined />} disabled={!canSave}>
                                                {t('orders.alertButtonGoBack')}</Button>
                                        </Popconfirm>
                                        <Button className="btn-primary" icon={<DownloadOutlined />} disabled={!canSave} onClick={handleSaveDraft}>
                                            {t('orders.alertButtonSave')}  </Button>
                                        <Button className="btn-link-filled" icon={<SendOutlined />} onClick={() => form.submit()} disabled={!canSave}>
                                            {t('orders.alertButtonSend')}</Button>
                                    </Space>
                                }
                            />

                        </Affix>

                    </Col>
                </Row>

                        }



                <ModalRejectProposal updateStep={updateStep} remakeModalVisible={remakeModalVisible} setRemakeModalVisible={setRemakeModalVisible} partnerId={session.userInfo.partner_id[0]} listingId={null} formItemLayout={formItemLayout} setMyOrder={setOrderBoxesRetrieved} step={orderSteps.CAJAS} orderId={orderId} goBack={goBack} setGoBack={setGoBack} setSuccessfullyReverted={setSuccessfullyReverted} />
            </Spin>

        </div >
    )
}