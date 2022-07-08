import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PageHeader, Affix, Row, Radio, Col, Typography, Form, Input, Button, Spin, Tabs, Space, Card, Select, Collapse, Popconfirm, Divider } from 'antd';
import { validateMessages } from '../../../../utils/const';
import { LeftOutlined, InfoCircleOutlined, DownloadOutlined, SendOutlined, WarningOutlined } from '@ant-design/icons';
import '../../onboarding.css';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../../../../api/api';
import partnerApi from '../../../../api/partner';
import { openNotification } from '../../../../components/Toastr';
import { listingStates, formItemLayout } from '../../../../utils/const.js';
import { canEdit } from '../../../../utils/functions';
import ModalRejectProposal from './ModalRejectProposal';
import Pending from './Pending';
import ProposalAlert from './ProposalAlert';
import AcceptedProposalAlert from './AcceptedProposalAlert';
import SupportRequests from './SupportRequests';

const { Item } = Form;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Title, Text } = Typography;
const Fulfillment = ({ supportRequests, setSupportRequests, prevStep, listingId, step, updateStep, nextStep, setSelected, selected, marketplaces, setSteps }) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();
    const [tab, setTabs] = useState('Client');
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [sending, setSending] = useState(false);
    const [fulfillment, setFulfillment] = useState();
    const [acceptedProposal, setAcceptedProposal] = useState(false);
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [justSent, setJustSent] = useState(false);
    const [loadingAcceptProposal, setLoadingAcceptProposal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const session = useSelector(store => store.Session.session);

    useEffect(() => {
        getFulfillment();
    }, []);

    useEffect(() => {
        if (step && step.state === listingStates.COMPLETED)
            setAcceptedProposal(true);
    }, [step]);

    const handleChangeTabs = (key) => {
        setTabs(key);
    }

    const getFulfillment = async () => {
        setLoading(true);
        await partnerApi.getFulfillment(session.userInfo.partner_id[0], listingId)
            .then(res => {
                if (res.status === 200 && res.data) {
                    res.data.Client.selectedMarketplaces = Object.keys(res.data.Client.listingPerMarketplace);
                    res.data.LAP.selectedMarketplaces = Object.keys(res.data.LAP.listingPerMarketplace);
                    setFulfillment(res.data);
                    form.setFieldsValue(res.data);
                    setLoading(false);
                }
            })
            .catch(error => {
                setLoading(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    }

    const onFinish = async (formFields) => {
        let flag = true;
        let mkts = Object.keys(fulfillment[tab].listingPerMarketplace);
        mkts.forEach(mkt => {
            if (!formFields[tab].listingPerMarketplace[mkt]?.fulfillmentType) {
                openNotification({ status: false, content: `Recuerde seleccionar un fulfillmentType en ${mkt}` });
                flag = false;
            }
        });

        if (!flag) {
            return;
        }

        setSending(true);
        await partnerApi.sendFulfillment(session.userInfo.partner_id[0], listingId, formFields)
            .then((response) => {
                openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                setJustSent(true);
                updateStep([{
                    ...step,
                    state: session.userInfo.isAdmin ? listingStates.PENDING_ACKNOWLEDGE : listingStates.PENDING_LAP
                }]);
                setSending(false);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
                setSending(false);
            });
    }

    const onSaveDraft = async () => {
        const currentFormFields = form.getFieldsValue();
        setSavingDraft(true);
        await partnerApi.updateFulfillment(session.userInfo.partner_id[0], listingId, currentFormFields)
            .then((response) => {
                openNotification({ status: true, content: t('onboarding.draftSavedSuccessfully') });
                setSavingDraft(false);
            })
            .catch((error) => {
                setSavingDraft(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    }

    const onClickAcceptProposal = async () => {
        setLoadingAcceptProposal(true);
        await partnerApi.acceptProposal(session.userInfo.partner_id[0], listingId, { step, nextStep })
            .then((response) => {
                updateStep([{ ...step, state: listingStates.COMPLETED }, { ...nextStep, state: listingStates.PENDING_CLIENT }]);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingAcceptProposal(false);
        setAcceptedProposal(true);
    };

    const onClickRejectProposal = () => {
        setRemakeModalVisible(true);
    };

    const onClickCancel = async () => {
        setLoadingDelete(true);
        let data = { step: prevStep };
        await partnerApi.revertListing(session.userInfo.partner_id[0], listingId, data)
            .then((response) => {
                updateStep(response.data);
                setSelected(selected - 1);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingDelete(false);
    }


    return (
        <PageHeader extra={
            <Affix offsetTop={10}>
                <Space style={{ backgroundColor: 'white' }}>
                    <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                    {canEdit(session, tab, step?.state) &&
                        <>
                            <Popconfirm
                                title={t('onboarding.confirmGoBack')}
                                onConfirm={onClickCancel}
                                onCancel={() => { }}
                                icon={<WarningOutlined />}
                                okText={t('yes')}
                                cancelText={t('no')}
                                okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                            >
                                <Button loading={loadingDelete} className="btn-basic-white" type="link" icon={<LeftOutlined />}>{t('onboarding.alertButtonGoBack')}  </Button>
                            </Popconfirm>
                            <Button className="btn-basic-white" loading={savingDraft} ghost icon={<DownloadOutlined />} disabled={!canEdit(session, tab, step?.state)} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                            <Button className="btn-basic-green" loading={sending} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEdit(session, tab, step?.state)}>{t('onboarding.alertButtonSend')}dd</Button>
                        </>
                    }
                </Space>
            </Affix>
        } subTitle={t('onboarding.fulfillment.titleDescription')} title={<span className="title-primary">{t('onboarding.fulfillment.title')}</span>}>
            <Spin spinning={loading || savingDraft || sending || loadingAcceptProposal || loadingDelete || !fulfillment} size="large" >
                <Form form={form} {...formItemLayout} validateMessages={validateMessages} onFinish={onFinish} className="text-align-left">
                    <Tabs onChange={handleChangeTabs}>
                        <TabPane tab={session.userInfo.role !== 'Admin' ? session.userInfo.name : t('onboarding.tab1')} key="Client">
                            {!acceptedProposal && !session.userInfo.isAdmin && step?.state === listingStates.PENDING_ACKNOWLEDGE && <ProposalAlert onClickAccept={onClickAcceptProposal} onClickReject={onClickRejectProposal} />}
                            {acceptedProposal && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />}
                            {!session.userInfo.isAdmin && step?.state === listingStates.PENDING_LAP ? (
                                <Pending />) :

                                <Row>
                                    <Col span={24}>
                                        {fulfillment?.Client?.selectedMarketplaces.length > 0 &&
                                            <Tabs>
                                                {fulfillment?.Client?.selectedMarketplaces.map(selectedMarketplace => (
                                                    <TabPane tab={selectedMarketplace} key={selectedMarketplace}>
                                                        <Row>
                                                            <Col span={8}>
                                                                <Space direction="vertical" size="small">
                                                                    <Title level={5} className="title-primary">{t('onboarding.fulfillment.type')}</Title>
                                                                    <Text type="secondary">{t('onboarding.fulfillment.typeDescription')}</Text>
                                                                </Space>
                                                            </Col>
                                                            <Col span={16}>

                                                                <Item className="input-form-margin-bottom" name={["Client", "listingPerMarketplace", selectedMarketplace, "fulfillmentType"]}
                                                                    rules={[{ required: true, message: 'Fulfillment es requerido' }]}
                                                                    initialValue="FBM"
                                                                    tooltip={{
                                                                        title: t('onboarding.order.step1Input3Description'),
                                                                        icon: <InfoCircleOutlined />,
                                                                    }}>
                                                                    <Radio.Group className="card-radio-group">
                                                                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                                                            <>
                                                                                <Radio style={{ marginTop: 12 }} value={'FBA'} disabled={!canEdit(session, 'Client', step?.state)}>
                                                                                    <Space direction="vertical">
                                                                                        <p className="text-card-radio">{t('onboarding.fulfillment.FBA')}</p>
                                                                                        <Text type="secondary">{t('onboarding.fulfillment.FBADescription')}</Text>
                                                                                    </Space>
                                                                                </Radio>
                                                                                <Divider style={{ margin: 0 }} />
                                                                            </>
                                                                            { form.getFieldValue([tab, 'listingPerMarketplace', selectedMarketplace, 'fulfillmentType']) === 'FBL' &&
                                                                                <> 
                                                                                <Radio value={'FBL'} disabled={!canEdit(session, 'Client', step?.state)}>
                                                                                    <Space direction="vertical">
                                                                                        <p className="text-card-radio">{t('onboarding.fulfillment.FBL')}</p>
                                                                                        <Text type="secondary">{t('onboarding.fulfillment.FBLDescription')}</Text>
                                                                                    </Space>
                                                                                </Radio>
                                                                                <Divider style={{ margin: 0 }} />
                                                                                </>
                                                                            }
                                                                            <>
                                                                                <Radio value={'FBM'} disabled={!canEdit(session, 'Client', step?.state)}>
                                                                                    <Space direction="vertical">
                                                                                        <p className="text-card-radio">{t('onboarding.fulfillment.FBM')}</p>
                                                                                        <Text type="secondary">{t('onboarding.fulfillment.FBMDescription')}</Text>
                                                                                    </Space>
                                                                                </Radio>
                                                                            </>
                                                                        </Space>
                                                                    </Radio.Group>
                                                                </Item>



                                                            </Col>

                                                        </Row>
                                                    </TabPane>))}
                                            </Tabs>
                                        }
                                    </Col>
                                </Row>

                            }

                        </TabPane>
                        <TabPane tab={t('onboarding.tab2')} key="LAP" >
                            {!acceptedProposal && !session.userInfo.isAdmin && step?.state === listingStates.PENDING_ACKNOWLEDGE && <ProposalAlert onClickAccept={onClickAcceptProposal} onClickReject={onClickRejectProposal} />}
                            {acceptedProposal && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />}
                            {session.userInfo.isAdmin ? step?.state === listingStates.PENDING_LAP && (
                                step.clientComment && <Card className="text-align-left">
                                    <Row>
                                        <Col span={6}>
                                            <p style={{ fontWeight: 'bold' }}>Comentarios Cliente</p>
                                        </Col>
                                        <Col span={18}>
                                            <p style={{ fontStyle: 'italic' }}>{step.clientComment}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            ) : [listingStates.PENDING_ACKNOWLEDGE, listingStates.COMPLETED].includes(step?.state) && (
                                step.lapComment && <Card className="text-align-left">
                                    <Row>
                                        <Col span={6}>
                                            <p style={{ fontWeight: 'bold' }}>Comentarios LAP</p>
                                        </Col>
                                        <Col span={18}>
                                            <p style={{ fontStyle: 'italic' }}>{step.lapComment}</p>
                                        </Col>
                                    </Row>
                                </Card>
                            )}

                            <Row>
                                <Col span={24}>
                                    {fulfillment?.LAP?.selectedMarketplaces.length > 0 &&
                                        <Tabs>
                                            {fulfillment?.LAP?.selectedMarketplaces.map(selectedMarketplace => (
                                                <TabPane tab={selectedMarketplace} key={selectedMarketplace}>
                                                    <Row>
                                                        <Col span={8}>
                                                            <Space direction="vertical" size="small">
                                                                <Title level={5} className="title-primary">{t('onboarding.fulfillment.type')}</Title>
                                                                <Text type="secondary">{t('onboarding.fulfillment.typeDescription')}</Text>
                                                            </Space>
                                                        </Col>
                                                        <Col span={16}>

                                                            <Item className="input-form-margin-bottom" name={["LAP", "listingPerMarketplace", selectedMarketplace, "fulfillmentType"]}
                                                                rules={[{ required: true }]}
                                                                tooltip={{
                                                                    title: t('onboarding.order.step1Input3Description'),
                                                                    icon: <InfoCircleOutlined />,
                                                                }}>
                                                                <Radio.Group className="card-radio-group">
                                                                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                                                                        <>
                                                                            <Radio style={{ marginTop: 12 }} value={'FBA'} disabled={!canEdit(session, 'LAP', step?.state)}>
                                                                                <Space direction="vertical">
                                                                                    <p className="text-card-radio">{t('onboarding.fulfillment.FBA')}</p>
                                                                                    <Text type="secondary">{t('onboarding.fulfillment.FBADescription')}</Text>
                                                                                </Space>
                                                                            </Radio>
                                                                            <Divider style={{ margin: 0 }} />
                                                                        </>
                                                                        <>
                                                                            <Radio value={'FBM'} disabled={!canEdit(session, 'LAP', step?.state)}>
                                                                                <Space direction="vertical">
                                                                                    <p className="text-card-radio">{t('onboarding.fulfillment.FBM')}</p>
                                                                                    <Text type="secondary">{t('onboarding.fulfillment.FBMDescription')}</Text>
                                                                                </Space>
                                                                            </Radio>
                                                                        </>
                                                                        { form.getFieldValue([tab, 'listingPerMarketplace', selectedMarketplace, 'fulfillmentType']) === 'FBL' &&
                                                                            <>
                                                                                <Radio value={'FBL'} disabled={!canEdit(session, 'LAP', step?.state)}>
                                                                                    <Space direction="vertical">
                                                                                        <p className="text-card-radio">{t('onboarding.fulfillment.FBL')}</p>
                                                                                        <Text type="secondary">{t('onboarding.fulfillment.FBLDescription')}</Text>
                                                                                    </Space>
                                                                                </Radio>
                                                                                <Divider style={{ margin: 0 }} />
                                                                            </>
                                                                        }
                                                                    </Space>
                                                                </Radio.Group>
                                                            </Item>



                                                        </Col>

                                                    </Row>
                                                </TabPane>))}
                                        </Tabs>
                                    }
                                </Col>
                            </Row>


                            {session.userInfo.isAdmin && tab === 'LAP' && (
                                <>
                                    <Divider className="divider-margin" />
                                    <Row>
                                        <Col xs={24} sm={24} md={24}>
                                            <Item type="hidden" name={"step", "id"} rules={[{ required: false }]}></Item>
                                            <Item label={t('onboarding.fulfillment.LAPComment')} name={"lapComment"} rules={[{ required: false }, { max: 2000 }]}
                                                tooltip={{
                                                    title: t('onboarding.fulfillment.LAPCommentDescription'),
                                                    icon: <InfoCircleOutlined />,
                                                }}>
                                                <Input.TextArea rows={10} maxLength={2000} showCount={true} disabled={!canEdit(session, 'LAP', step?.state)} />
                                            </Item>
                                        </Col>
                                    </Row>
                                </>
                            )}


                        </TabPane>

                    </Tabs>
                </Form>
            </Spin>
            <ModalRejectProposal updateStep={updateStep} step={step} remakeModalVisible={remakeModalVisible} setRemakeModalVisible={setRemakeModalVisible} partnerId={session.userInfo.partner_id[0]} listingId={listingId} formItemLayout={formItemLayout} />
            <Row justify="end" style={{ marginTop: 24 }}>
                <Col>
                    <Affix offsetBottom={10}>
                        <Space style={{ backgroundColor: 'white' }}>
                            <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                            {canEdit(session, tab, step?.state) &&
                                <>
                                    <Popconfirm
                                        title={t('onboarding.confirmGoBack')}
                                        onConfirm={onClickCancel}
                                        onCancel={() => { }}
                                        icon={<WarningOutlined />}
                                        okText={t('yes')}
                                        cancelText={t('no')}
                                        okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                    >
                                        <Button loading={loadingDelete} className="btn-basic-white" type="link" icon={<LeftOutlined />}>{t('onboarding.alertButtonGoBack')}  </Button>
                                    </Popconfirm>
                                    <Button className="btn-basic-white" loading={savingDraft} ghost icon={<DownloadOutlined />} disabled={!canEdit(session, tab, step?.state)} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                                    <Button className="btn-basic-green" loading={sending} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEdit(session, tab, step?.state)}>{t('onboarding.alertButtonSend')}</Button>
                                </>
                            }

                        </Space>
                    </Affix>
                </Col>
            </Row>
        </PageHeader>
    );
}

export default React.memo(Fulfillment);