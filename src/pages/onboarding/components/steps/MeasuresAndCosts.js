import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Form, Input, Button, Spin, Tabs, PageHeader, Affix, Space, Card, Typography, Popconfirm, Collapse } from 'antd';
import { InfoCircleOutlined, DownloadOutlined, LeftOutlined, SendOutlined, WarningOutlined } from '@ant-design/icons';
import { listingStates, formItemLayout, sellerMarketplaces } from '../../../../utils/const.js';
import { openNotification } from '../../../../components/Toastr';
import { TableMeasuresAndCosts } from '../TableMeasuresAndCosts';
import { validateMessages } from '../../../../utils/const';
import AcceptedProposalAlert from './AcceptedProposalAlert';
import ModalRejectProposal from './ModalRejectProposal';
import { getErrorMessage } from '../../../../api/api';
import { canEdit } from '../../../../utils/functions';
import partnerApi from '../../../../api/partner';
import { useTranslation } from 'react-i18next';
import ProposalAlert from './ProposalAlert';
import { useSelector } from 'react-redux';
import AmazonMeasuresAndCosts from './measuresAndCostsByMarketplace/AmazonMeasuresAndCosts';
import EbayMeasuresAndCosts from './measuresAndCostsByMarketplace/EbayMeasuresAndCosts';
import WalmartMeasuresAndCosts from './measuresAndCostsByMarketplace/WalmartMeasuresAndCosts';
import Pending from './Pending';
import '../../onboarding.css';
import SupportRequests from './SupportRequests';
import ShopifyMeasuresAndCosts from './measuresAndCostsByMarketplace/ShopifyMeasuresAndCosts.js';

const { Item } = Form;
const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const formByMarketplace = {
    "Amazon": AmazonMeasuresAndCosts,
    "Amazon Mexico": AmazonMeasuresAndCosts,
    "Amazon Canada": AmazonMeasuresAndCosts,
    "Amazon Brazil": AmazonMeasuresAndCosts,
    "Walmart": WalmartMeasuresAndCosts,
    "Ebay": EbayMeasuresAndCosts,
    "Ebay Canada": EbayMeasuresAndCosts,
    "Ebay Spain": EbayMeasuresAndCosts,
    "Ebay Germany": EbayMeasuresAndCosts,
    "Shopify": ShopifyMeasuresAndCosts
}

const MeasuresAndCostsByMarketplace = (props) => {
    let Comp = formByMarketplace[props.selectedMarketplace];
    return <Comp {...props}></Comp>
}

const MeasuresAndCosts = ({ supportRequests, setSupportRequests, prevStep, listingId, updateStep, step, nextStep, setSelected, selected }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);

    const [form] = Form.useForm();
    const [tab, setTabs] = useState(session?.userInfo?.role == 'Admin' ? 'LAP' : 'Client');
    const [currentTab, setCurrentTab] = useState();
    const [loading, setLoading] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [measuresRetrieved, setMeasuresRetrieved] = useState();
    const [acceptedProposal, setAcceptedProposal] = useState(false);
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [justSent, setJustSent] = useState(false);
    const [loadingAcceptProposal, setLoadingAcceptProposal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [canEditItem, setCanEditItem] = useState(null);
    const [refresh, setRefresh] = useState(null);
    const [firstMkt, setFirstMkt] = useState(null);

    useEffect(() => {
        getMeasures();
    }, []);

    useEffect(() => {
        if (step && step.state === listingStates.COMPLETED) {
            setAcceptedProposal(true);
        }
    }, [step]);

    useEffect(() => {
        (session && tab && step?.state) ?
            setCanEditItem(canEdit(session, tab, step.state)) : setCanEditItem(false);
    }, [session, tab, step?.state])

    const getMeasures = async () => {
        await partnerApi.getMeasures(session.userInfo.partner_id[0], listingId)
            .then(res => {
                if (res.status === 200 && res.data) {
                    const listing = res.data;
                    listing.Client.selectedMarketplaces = Object.keys(listing.Client.listingPerMarketplace);
                    listing.LAP.selectedMarketplaces = Object.keys(listing.LAP.listingPerMarketplace);
                    listing.hasVariantRoot = false;
                    const mainMarketplace = listing.Client.selectedMarketplaces[0];
                    setFirstMkt(mainMarketplace);
                    setCurrentTab(mainMarketplace);
                    setMeasuresRetrieved(listing);
                    setLoading(false);
                }
            })
            .catch(error => {
                setLoading(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    }

    useEffect(() => {
        if (measuresRetrieved && Object.entries(measuresRetrieved).length > 0 && !justSent) {
            form.setFieldsValue({ ...measuresRetrieved, step: step });
            setRefresh(Date.now());
        }
    }, [measuresRetrieved])

    const isAValidForm = (formData) => {
        let flag = true;
        let errors = {};
        for (const mkt of formData[tab]?.selectedMarketplaces) {
            if (formData[tab] && formData[tab]?.listingPerMarketplace[mkt]) {
                if (formData[tab]?.listingPerMarketplace[mkt]?.variants?.length > 0) {
                    for (const variant of formData[tab].listingPerMarketplace[mkt]?.variants) {
                        if (!variant.weightUnity || !variant.measureUnity) {
                            flag = false;
                            errors[mkt] = {};
                        }
                    }
                }
            }
        }
        return { flag: flag, errors: errors };
    }

    const onFinish = async () => {
        const formData = form.getFieldValue();
        const isValid = session?.userInfo?.role == 'Admin' ? isAValidForm(formData) : { flag: true };
        if (!isValid?.flag) {
            for (const mkt of Object.keys(isValid.errors)) {
                let message = `${mkt.toUpperCase()}: Faltan completar las unidades de medidas`;
                openNotification({ status: false, content: message || 'Debe completar todas las imágenes en ' + mkt });
                return;
            }
        }
        setLoadingSend(true);
        await partnerApi.sendMeasures(session.userInfo.partner_id[0], measuresRetrieved.id, formData)
            .then((response) => {
                openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                setJustSent(true);
                updateStep([{
                    ...step,
                    state: session.userInfo.isAdmin ? listingStates.PENDING_ACKNOWLEDGE : listingStates.PENDING_LAP
                }]);
                setLoadingSend(false);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
                setLoadingSend(false);
            });
    }

    const onSaveDraft = async () => {
        const currentFormFields = form.getFieldValue();
        if (currentFormFields) {
            setLoadingUpdate(true);
            await partnerApi.updateMeasures(session.userInfo.partner_id[0], measuresRetrieved.id, currentFormFields)
                .then((response) => {
                    openNotification({ status: true, content: t('onboarding.draftSavedSuccessfully') });
                    setLoadingUpdate(false);
                })
                .catch((error) => {
                    setLoadingUpdate(false);
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
        }
    }

    const onClickAcceptProposal = async () => {
        setLoadingAcceptProposal(true);
        await partnerApi.acceptProposal(session.userInfo.partner_id[0], measuresRetrieved.id, { step, nextStep })
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

    const handleChangeTabs = (key) => {
        setCurrentTab(firstMkt);
        setTabs(key);
    };
    const handleChangeTabsPerMkt = (key) => setCurrentTab(key);

    return (
        <PageHeader extra={

            <Affix offsetTop={10}>
                <Space style={{ backgroundColor: 'white' }}>
                    <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                    {canEditItem &&
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
                            <Button className="btn-basic-white" loading={loadingUpdate} ghost icon={<DownloadOutlined />} disabled={!canEditItem} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                            <Button className="btn-basic-green" loading={loadingSend} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEditItem}>{t('onboarding.alertButtonSend')}</Button>
                        </>
                    }
                </Space>
            </Affix>
        } subTitle={t('onboarding.measuresAndPrices.subtitleDescription')} title={<span className="title-primary">{t('onboarding.measuresAndPrices.title')}</span>}>
            <Spin spinning={loading || loadingUpdate || loadingSend || loadingAcceptProposal || loadingDelete || !measuresRetrieved} size="large" >
                <Form form={form} {...formItemLayout} validateMessages={validateMessages} onFinish={onFinish} className="text-align-left">
                    <Tabs defaultActiveKey={tab} onChange={handleChangeTabs}>
                        <TabPane tab={session.userInfo.role !== 'Admin' ? session.userInfo.name : t('onboarding.tab1')} key="Client">
                            {!acceptedProposal && !session.userInfo.isAdmin && step?.state === listingStates.PENDING_ACKNOWLEDGE && <ProposalAlert onClickAccept={onClickAcceptProposal} onClickReject={onClickRejectProposal} />}
                            {acceptedProposal && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />}
                            {!session.userInfo.isAdmin && step?.state === listingStates.PENDING_LAP ? (
                                <Pending />) :

                                <Row>
                                    <Col span={24}>
                                        <Card style={{ margin: '20px', backgroundColor: '#e7e7e730', borderRadius: '5px' }}>
                                            {measuresRetrieved?.Client?.selectedMarketplaces.length > 0 &&
                                                <Tabs onChange={handleChangeTabsPerMkt}>
                                                    {measuresRetrieved?.Client?.selectedMarketplaces.map(selectedMarketplace => (
                                                        <TabPane tab={selectedMarketplace} key={selectedMarketplace}>
                                                            <Title level={4}>{t('onboarding.measuresAndPrices.subtitle')}</Title>
                                                            <Divider />
                                                            <Form name="formulario" form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onFinish={onFinish}
                                                                validateMessages={validateMessages} className="text-align-left">
                                                                <MeasuresAndCostsByMarketplace
                                                                    selectedMarketplace={selectedMarketplace} canEditItem={canEditItem}
                                                                    tab={tab} measuresRetrieved={measuresRetrieved}
                                                                    form={form} session={session} setRefresh={setRefresh}
                                                                />
                                                            </Form>
                                                        </TabPane>
                                                    ))}
                                                </Tabs>
                                            }
                                        </Card>
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
                                    <Card style={{ margin: '20px', backgroundColor: '#e7e7e730', borderRadius: '5px' }}>
                                        {measuresRetrieved?.LAP?.selectedMarketplaces.length > 0 &&
                                            <Tabs onChange={handleChangeTabsPerMkt}>
                                                {measuresRetrieved?.LAP?.selectedMarketplaces.map(selectedMarketplace => (
                                                    <TabPane tab={selectedMarketplace} key={selectedMarketplace}>
                                                        <Title level={4} style={{ color: '#000' }} >{t('onboarding.measuresAndPrices.subtitle')}</Title>
                                                        <Divider />
                                                        <Collapse style={{ marginBottom: 24, marginRight: 45 }} bordered={false} defaultActiveKey={['1']}>
                                                            <Panel styles={{ textAlign: 'left' }} header={'Consideraciones'} key={1}>
                                                                <Row>
                                                                    <Col span={24}>
                                                                        <Text>Recuerde completar todos los datos para cada uno de los marketplaces.</Text><br />
                                                                    </Col>
                                                                </Row>
                                                            </Panel>
                                                        </Collapse>
                                                        <Form name="formulario" form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 21 }} onFinish={onFinish}
                                                            validateMessages={validateMessages} className="text-align-left">
                                                            <MeasuresAndCostsByMarketplace
                                                                selectedMarketplace={selectedMarketplace} canEditItem={canEditItem}
                                                                currentTab={currentTab} tab={tab} measuresRetrieved={measuresRetrieved}
                                                                form={form} session={session} setRefresh={setRefresh}
                                                            />
                                                            {currentTab.includes(sellerMarketplaces.AMAZON) &&
                                                                <TableMeasuresAndCosts
                                                                    form={form} measuresRetrieved={measuresRetrieved}
                                                                    currentTab={currentTab} tab={tab} canEditItem={canEditItem} />
                                                            }
                                                        </Form>
                                                    </TabPane>
                                                ))}
                                            </Tabs>
                                        }
                                    </Card>
                                </Col>
                            </Row>

                            {session.userInfo.isAdmin && tab === 'LAP' && (
                                <>
                                    <Divider className="divider-margin" />
                                    <Row>
                                        <Col xs={24} sm={24} md={24}>
                                            <Item type="hidden" name={"step", "id"} rules={[{ required: false }]}></Item>
                                            <Item label={t('onboarding.measuresAndPrices.LAPComment')} name={"lapComment"} rules={[{ required: false }, { max: 2000 }]}
                                                tooltip={{
                                                    title: t('onboarding.measuresAndPrices.LAPCommentDescription'),
                                                    icon: <InfoCircleOutlined />,
                                                }}>
                                                <Input.TextArea rows={10} maxLength={2000} showCount={true} disabled={!canEditItem} />
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
                    <Affix offsetTop={10}>
                        <Space style={{ backgroundColor: 'white' }}>
                            <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                            {canEditItem &&
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
                                    <Button className="btn-basic-white" loading={loadingUpdate} ghost icon={<DownloadOutlined />} disabled={!canEditItem} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                                    <Button className="btn-basic-green" loading={loadingSend} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEditItem}>{t('onboarding.alertButtonSend')}</Button>
                                </>
                            }
                        </Space>
                    </Affix>
                </Col>
            </Row>
        </PageHeader >
    );
}

export default React.memo(MeasuresAndCosts);