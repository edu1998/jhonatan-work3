import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Affix, PageHeader, Space, Popconfirm, Row, Col, Modal, Result, Button, Alert, Spin, Tabs } from 'antd';
import { LeftOutlined, WarningOutlined } from '@ant-design/icons';
import partnerApi from '../../../../api/partner';
import { useTranslation } from 'react-i18next';
import { openNotification } from '../../../../components/Toastr';
import { getErrorMessage } from '../../../../api/api';
import { useHistory } from "react-router-dom";
import { imageSectionEnum, sellerMarketplaces } from '../../../../utils/const.js';
import DraftByMarketplace from './draftByMarketplace/DraftByMarketplace';
import SupportRequests from './SupportRequests';
import { saveAs } from 'file-saver';

const { TabPane } = Tabs;

const Draft = ({ supportRequests, setSupportRequests, listingId, prevStep, updateStep, selected, setSelected }) => {

    const { t } = useTranslation();
    const history = useHistory();
    const session = useSelector(store => store.Session.session);

    const [currentTab, setCurrentTab] = useState('Amazon');
    const [loadingDraft, setLoadingDraft] = useState(true);
    const [loadingApproveListing, setLoadingApproveListing] = useState(false);
    const [draftRetrieved, setDraftRetrieved] = useState(null);
    const [draftRetrievedForModal, setDraftRetrievedForModal] = useState();
    const [loadingCreateListing, setLoadingCreateListing] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [tabs, setTabs] = useState(false);

    useEffect(() => {
        getDraft();
    }, []);

    const getDraft = async () => {
        await partnerApi.getDraft(session.userInfo.partner_id[0], listingId)
            .then(res => {
                const listing = res.data;
                setLoadingDraft(false);
                setDraftRetrieved(listing);
                setCurrentTab(Object.keys(listing?.listingPerMarketplace)[0] || sellerMarketplaces.AMAZON);
                setDraftRetrievedForModal(listing.listingPerMarketplace.Amazon);
            })
            .catch(error => {
                setLoadingDraft(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            })
    };

    const compare = (a, b) => {
        if (a.x_image_type !== imageSectionEnum.MAIN) {
            return 1;
        } else {
            return -1;
        }
    }

    const handleApproveListing = async () => {
        setLoadingApproveListing(true);
        await partnerApi.approveListing(session.userInfo.partner_id[0], listingId)
            .then(res => {
                const listing = res.data;
                setLoadingApproveListing(false);
            })
            .catch(error => {
                setLoadingApproveListing(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            })
    };

    const goHome = () => {
        history.push("/");
    }

    const exportExcel = async () => {
        setLoadingApproveListing(true);
        try {
            const { data } = await partnerApi.exportListing(session.userInfo.partner_id[0], listingId, currentTab);
            const filename = `${currentTab} - ${draftRetrieved?.listingPerMarketplace[currentTab]?.product?.defaultCode}.xlsx`;
            let blob = new Blob([data], { type: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            saveAs(blob, filename);
        } catch (error) {
            console.log('onClickExportHandler#Orders', error);
        } finally {
            setLoadingApproveListing(false);
        }
    }

    async function createListing() {
        setLoadingApproveListing(true);
        await partnerApi.approveListing(session.userInfo.partner_id[0], listingId)
            .then(res => {
                const listing = res.data;
                let mkts = Object.keys(listing)
                for (const marketplace of mkts) {
                    if (!listing[marketplace].success) {
                        Modal.error({
                            title: 'No se ha podido publicar el listing en ' + marketplace,
                            width: 800,
                            content: <Result status="error">
                                {listing[marketplace]?.errors?.length > 0 &&
                                    listing[marketplace]?.errors?.map((error) => {
                                        return <Row>
                                            <Col span={24}>
                                                <Alert type="error"
                                                    description={error?.attributeName ?
                                                        `El atributo: ${error?.attributeName} : ${error?.message}` :
                                                        error?.message}
                                                />
                                            </Col>
                                        </Row>
                                    })
                                }

                            </Result>,
                        });
                    } else {
                        Modal.confirm({
                            title: 'Se ha aceptado la publicación del listing en ' + marketplace,
                            width: 800,
                            onCancel: goHome,
                            cancelText: "Ok",
                            okText: "Crear nuevo listing",
                            onOk: handleNewListing,
                            content: <Result
                                status="success"
                                title="Se ha aceptado la publicación del listing"
                                subTitle="Por favor, espere unos minutos para ver reflejado el listing en el marketplace"
                            />,
                        });
                    }
                }
                setLoadingApproveListing(false);
            })
            .catch(error => {
                setLoadingApproveListing(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            })
    }

    const handleNewListing = async () => {
        setLoadingCreateListing(true);
        await partnerApi
            .insertListing(session.userInfo.partner_id[0])
            .then((res) => {
                const listingId = res.data;
                setLoadingCreateListing(false);
                history.push(`/onboarding/${listingId}`);
            })
            .catch((error) => {
                setLoadingCreateListing(false);
                openNotification({
                    status: false,
                    content: "Error al crear un nuevo listing",
                });
            });
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
    };

    const handleChangeTabs = (key) => setTabs(key);
    const handleChangeTabsPerMkt = (key) => setCurrentTab(key);

    return (
        <PageHeader extra={
            <Affix offsetTop={10}>
                <Space style={{ backgroundColor: 'white' }}>
                    <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                    <Popconfirm
                        title={t('onboarding.confirmGoBack')}
                        onConfirm={onClickCancel}
                        onCancel={() => { }}
                        icon={<WarningOutlined />}
                        okText={t('yes')}
                        cancelText={t('no')}
                        okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                    >
                        <Button loading={loadingDelete} type="link" icon={<LeftOutlined />}>{t('onboarding.alertButtonGoBack')}  </Button>
                    </Popconfirm>
                </Space>
            </Affix>
        } subTitle={t('onboarding.draft.titleDescription') + currentTab} title={<span className="title-primary">{t('onboarding.draft.title')}</span>}>
            <Spin spinning={loadingApproveListing || loadingDraft || loadingCreateListing || loadingDelete} size="large" >
                <Tabs onChange={handleChangeTabsPerMkt}>
                    {draftRetrieved && Object.entries(draftRetrieved?.listingPerMarketplace).map(selectedMarketplace => (
                        <TabPane tab={selectedMarketplace[0]} key={selectedMarketplace[0]}>
                            <DraftByMarketplace draft={selectedMarketplace[1]} marketplace={selectedMarketplace[0]}
                                loading={loadingCreateListing} exportExcel={exportExcel}
                                handleNewListing={handleNewListing} createListing={createListing}
                            />
                        </TabPane>
                    ))}
                </Tabs>
            </Spin>
            <Row justify="end" style={{ marginTop: 24 }}>
                <Col>
                    <Affix offsetBottom={10}>
                        <Space style={{ backgroundColor: 'white' }}>
                            <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                            <Popconfirm
                                title={t('onboarding.confirmGoBack')}
                                onConfirm={onClickCancel}
                                onCancel={() => { }}
                                icon={<WarningOutlined />}
                                okText={t('yes')}
                                cancelText={t('no')}
                                okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                            >
                                <Button loading={loadingDelete} type="link" icon={<LeftOutlined />}>{t('onboarding.alertButtonGoBack')}  </Button>
                            </Popconfirm>
                        </Space>
                    </Affix>
                </Col>
            </Row>
        </PageHeader>
    );
}

export default React.memo(Draft);