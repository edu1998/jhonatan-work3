import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Spin, Tabs, PageHeader, Affix, Space, Popconfirm } from 'antd';
import { LoadingOutlined, DownloadOutlined, LeftOutlined, SendOutlined, WarningOutlined } from '@ant-design/icons';
import { listingStates, validateMessages } from '../../../../utils/const';
import { openNotification } from '../../../../components/Toastr';
import { getErrorMessage } from '../../../../api/api';
import { canEdit } from '../../../../utils/functions';
import ModalRejectProposal from './ModalRejectProposal';
import SupportRequests from './SupportRequests';
import partnerApi from '../../../../api/partner';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ImagesTab } from '../ImageTab';
import '../../onboarding.css';

const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
}

export const Images = ({ supportRequests, setSupportRequests, prevStep, listingId, updateStep, setSelected, selected, step, nextStep }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);

    const [tab, setTabs] = useState(session?.userInfo?.role == 'Admin' ? 'LAP' : 'Client');
    const [savingDraft, setSavingDraft] = useState(false);
    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isLoadingForm, setIsLoadingForm] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [images, setImages] = useState();
    const [form] = Form.useForm()
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [loadingAcceptProposal, setLoadingAcceptProposal] = useState(false);
    const [acceptedProposal, setAcceptedProposal] = useState(false);

    const handleChangeTabs = (key) => setTabs(key);

    useEffect(() => {
        getImages();
    }, [])

    const getImages = async () => {
        setLoading(true)
        try {
            const { data } = await partnerApi.getImages(session.userInfo.partner_id[0], listingId)
            setImages(data)
            form.setFieldsValue(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    const handleCancelForm = async () => {
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

    const isAValidForm = () => {
        let flag = true;
        let errors = {};
        for (const mkt of Object.keys(images['Client'])) {
            if (images['Client'] && images['Client'][mkt]) {
                if (images['Client'][mkt]?.variants?.length > 0) {
                    for (const variant of images['Client'][mkt]?.variants) {
                        if (!variant?.categoryImages?.length > 0 || !variant?.mainImages?.length > 0 || !variant?.productImages?.length > 0) {
                            flag = false;
                            errors[mkt] = {};
                        }
                    }
                }
                if (images['Client'] && images['Client'][mkt] && images['Client'][mkt]?.product) {
                    const product = images['Client'][mkt]?.product;
                    if (!product?.categoryImages?.length > 0 || !product?.mainImages?.length > 0 || !product?.productImages?.length > 0) {
                        flag = false;
                        errors[mkt] = {};
                    }
                }
            }
        }
        return { flag: flag, errors: errors };
    }

    const saveDraft = () => {
        setSavingDraft(true);
        let values = form.getFieldsValue();
        partnerApi.updateImages(session.userInfo.partner_id[0], listingId, values).then(() => {
            setSavingDraft(false);
        }, (error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setSavingDraft(false);
        })
    }

    const onFinish = () => {
        setSaving(true);
        partnerApi.sendImages(session.userInfo.partner_id[0], listingId, images).then(() => {
            openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
            updateStep([{
                ...step,
                state: session.userInfo.isAdmin ? listingStates.PENDING_ACKNOWLEDGE : listingStates.PENDING_LAP
            }]);
            setSaving(false);
            getImages();
        }, (error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setSaving(false);
        })
    }

    const onFinishFailed = () => { }

    const onClickAcceptProposal = () => {
        setLoadingAcceptProposal(true);
        partnerApi.acceptProposal(session.userInfo.partner_id[0], images.id, { step, nextStep })
            .then((response) => {
                updateStep([{ ...step, state: listingStates.COMPLETED }, { ...nextStep, state: listingStates.PENDING_CLIENT }]);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingAcceptProposal(false);
        setAcceptedProposal(true);
    }

    const onClickRejectProposal = () => {
        setRemakeModalVisible(true);
    };

    return (
        <PageHeader extra={
            <Affix offsetTop={10}>
                <Space style={{ backgroundColor: 'white' }}>
                    <SupportRequests
                        listingId={listingId}
                        supportRequests={supportRequests}
                        setSupportRequests={setSupportRequests} />
                    {canEdit(session, tab, step?.state) &&
                        <>
                            <Popconfirm
                                title={t('onboarding.confirmGoBack')}
                                onConfirm={handleCancelForm}
                                onCancel={() => { }}
                                icon={<WarningOutlined />}
                                okText={t('yes')}
                                cancelText={t('no')}
                                okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                            >
                                <Button loading={loadingDelete} type="link" className="btn-basic-white" icon={<LeftOutlined />} disabled={!canSave}>
                                    {t('onboarding.alertButtonGoBack')}</Button>
                            </Popconfirm>
                            <Button className="btn-basic-white" loading={savingDraft} ghost icon={<DownloadOutlined />} disabled={!canSave} onClick={saveDraft}>
                                {t('onboarding.alertButtonSave')}  </Button>
                            <Button loading={saving} className="btn-basic-green" icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canSave}>
                                {t('onboarding.alertButtonSend')}</Button>
                        </>
                    }

                </Space>
            </Affix>
        } subTitle={t('onboarding.images.subtitle')} title={<span className="title-primary">{t('onboarding.images.title')}</span>}>
            <Spin spinning={loading || loadingDelete || isLoadingForm} size="large" >
                <Form form={form} {...formItemLayout} onFinish={onFinish} onFinishFailed={onFinishFailed}
                    validateMessages={validateMessages}>
                    <Tabs defaultActiveKey={tab} onChange={handleChangeTabs}>
                        <TabPane tab={session.userInfo.role !== 'Admin' ? session.userInfo.name : t('onboarding.tab1')} key="Client">
                            <ImagesTab selected={selected} setSelected={setSelected} onClickAcceptProposal={onClickAcceptProposal} onClickRejectProposal={onClickRejectProposal} setSavingDraft={setSavingDraft} form={form} step={step} setImages={setImages} images={images} tab={tab} formItemLayout={formItemLayout}></ImagesTab>
                        </TabPane>
                        <TabPane tab={t('onboarding.tab2')} key="LAP" >
                            <ImagesTab selected={selected} setSelected={setSelected} updateStep={updateStep} isLap={true} setSavingDraft={setSavingDraft} form={form} step={step} setImages={setImages} images={images} tab={tab} formItemLayout={formItemLayout} onClickAcceptProposal={onClickAcceptProposal} ></ImagesTab>
                        </TabPane>
                    </Tabs>
                </Form>
            </Spin>

            <Row justify="end" style={{ marginTop: 24 }}>
                <Col>
                    <Affix offsetBottom={10}>
                        <Space style={{ backgroundColor: 'white' }}>
                            <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                            {canEdit(session, tab, step?.state) &&
                                <>
                                    <Popconfirm
                                        title={t('onboarding.confirmGoBack')}
                                        onConfirm={handleCancelForm}
                                        onCancel={() => { }}
                                        icon={<WarningOutlined />}
                                        okText={t('yes')}
                                        cancelText={t('no')}
                                        okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                    >
                                        <Button loading={loadingDelete} type="link" className="btn-basic-white" icon={<LeftOutlined />} disabled={!canSave}>
                                            {t('onboarding.alertButtonGoBack')}</Button>
                                    </Popconfirm>
                                    <Button className="btn-basic-white" loading={savingDraft} ghost icon={<DownloadOutlined />} disabled={!canSave} onClick={saveDraft}>
                                        {t('onboarding.alertButtonSave')}  </Button>
                                    <Button loading={saving} className="btn-basic-green" icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canSave}>
                                        {t('onboarding.alertButtonSend')}</Button>
                                </>
                            }
                        </Space>
                    </Affix>
                </Col>
            </Row>

            <ModalRejectProposal updateStep={updateStep} step={step} remakeModalVisible={remakeModalVisible} setRemakeModalVisible={setRemakeModalVisible} partnerId={session.userInfo.partner_id[0]} listingId={images?.id} formItemLayout={formItemLayout} setMyOrder={setImages} />
        </PageHeader>
    )
}
