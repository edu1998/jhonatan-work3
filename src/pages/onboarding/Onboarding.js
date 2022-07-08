import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Menu, Row, Col, Layout, Progress, Spin, Modal, PageHeader, Skeleton, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { listingSteps, listingStates } from '../../utils/const';
import partnerApi from '../../api/partner';
import awsAccessKeysApi from '../../api/aws-access-keys';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Order } from './components/steps/Order';
import MeasuresAndCosts from './components/steps/MeasuresAndCosts';
import './onboarding.css';
import { Images } from './components/steps/Images';
import Prices from './components/steps/Prices';
import Draft from './components/steps/Draft';
import { openNotification } from '../../components/Toastr';
import { getErrorMessage } from '../../api/api';
import { useHistory } from 'react-router-dom';
// import Fulfillment from './components/steps/Fulfillment';
import Support from '../home/components/Support';

const { Content, Sider } = Layout;
const { Text } = Typography;
export const Onboarding = () => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    const { listingId } = useParams();

    const [selected, setSelected] = useState(0);
    const [loadingMarketplaces, setLoadingMarketplaces] = useState(true);
    const [marketplaces, setMarketplaces] = useState([]);
    const [stepsMap, setStepsMap] = useState(undefined);
    const [supportRequests, setSupportRequests] = useState([]);
    const [productType, setProductType] = useState(null);
    const [category, setCategory] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [completedPercentage, setCompletedPercentage] = useState(0);
    const history = useHistory();

    useEffect(() => {
        if (session && listingId) {
            setLoadingMarketplaces(true);
            Promise.all([awsAccessKeysApi.getMarketplaces(session?.userInfo?.commercial_partner_id[0] || session?.userInfo?.partner_id[0]), partnerApi.getSteps(session.userInfo.partner_id[0], listingId)])
                .then(response => {
                    setMarketplaces(response[0].data);
                    setSteps(response[1].data.steps);
                    setSupportRequests(response[1].data.supportRequests);
                    setLoadingMarketplaces(false);
                })
                .catch(error => { setLoadingMarketplaces(false); openNotification({ status: false, content: getErrorMessage(error) }) });
        }
    }, [listingId]);

    const setSteps = (steps) => {
        let st = {};
        let completed = 0;
        let currentStep = 0;
        steps.map((step, idx) => {
            st[step.step] = step;
            if (step.state == listingStates.COMPLETED) {
                completed++;
            }
            if (!currentStep && (step.state != listingStates.PENDING && step.state != listingStates.COMPLETED)) {
                currentStep = idx;
            }
        })
        setSelected(currentStep);
        setCompletedPercentage(((completed / Object.keys(listingSteps).length) * 100).toFixed(2));
        setStepsMap(st);
        setIsModalVisible(currentStep === 0 && st['Price']?.state === 'Pendiente Cliente' && session.userInfo.role !== 'Admin');
    }

    const updateStep = (newSteps) => {
        let changedSteps = { ...stepsMap };
        let completed = 0;
        newSteps.map((newStep) => {
            changedSteps[newStep.step] = newStep;
        });
        Object.keys(changedSteps).map((step) => {
            if (changedSteps[step].state == listingStates.COMPLETED) {
                completed++;
            }
        })
        setCompletedPercentage(((completed / Object.keys(listingSteps).length) * 100).toFixed(2));
        setStepsMap(changedSteps);
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    return (
        <PageHeader breadcrumb={<Row justify="center"><Col span={24}><Progress percent={completedPercentage} /></Col></Row>} title={t('onboarding.section')} onBack={() => { history.push("/") }}>

            <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleOk} className="buttonInfo">
                <Col>
                    <p> Bienvenidos a LAP! Somos el equipo de Onboarding y nos gustaría saber más detalles de sus productos para realizar un análisis de mercado acorde a sus categorías e intereses respecto a su marca haciendo click en el siguiente<a style={{ marginLeft: '10px', paddingBottom: '10px' }} target="_blank" href="https://forms.gle/iHXK9cRLnob1uAi5A">Enlace</a></p>
                </Col>
            </Modal>
            <Row>
                <Col span={24}>
                    <Layout>
                        <Sider width={200}>
                            {loadingMarketplaces ? <Menu className="side-bar-menu"><Skeleton active={true} /></Menu> :
                                stepsMap && <Menu
                                    mode="inline"
                                    defaultSelectedKeys={[selected.toString()]}
                                    openKeys={[selected.toString()]}
                                    selectedKeys={[selected.toString()]}
                                    selectable={true}
                                    onClick={(param1) => {
                                        setSelected(parseInt(param1.key));
                                    }}
                                    className="side-bar-menu"
                                >
                                    <Menu.Item key="0" disabled={stepsMap[listingSteps.PRICE]?.state === listingStates.PENDING}>
                                        <Text style={{ width: 125 }} ellipsis={{ tooltip: t('onboarding.sideBarItem1') }}>{t('onboarding.sideBarItem1')}</Text>
                                        {stepsMap[listingSteps.PRICE]?.state == listingStates.COMPLETED || stepsMap[listingSteps.PRICE]?.state == listingStates.PUBLISHED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}
                                    </Menu.Item>
                                    <Menu.Item key="1" disabled={stepsMap[listingSteps.ORDER]?.state === listingStates.PENDING}>
                                        <Text>{t('onboarding.sideBarItem2')}</Text>
                                        {stepsMap[listingSteps.ORDER]?.state == listingStates.COMPLETED || stepsMap[listingSteps.ORDER]?.state == listingStates.PUBLISHED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item>
                                    {/* <Menu.Item key="2" disabled={stepsMap[listingSteps.FULFILLMENT]?.state === listingStates.PENDING}>
                                        <Text>{t('onboarding.sideBarItem6')}</Text>
                                        {stepsMap[listingSteps.FULFILLMENT]?.state == listingStates.COMPLETED || stepsMap[listingSteps?.FULFILLMENT].state == listingStates.PUBLISHED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item> */}
                                    <Menu.Item key="2" disabled={stepsMap[listingSteps?.MEASURES].state === listingStates.PENDING}>
                                        <Text>{t('onboarding.sideBarItem3')}</Text>
                                        {stepsMap[listingSteps.MEASURES]?.state == listingStates.COMPLETED || stepsMap[listingSteps.MEASURES].state == listingStates.PUBLISHED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item>
                                    <Menu.Item key="3" disabled={stepsMap[listingSteps.IMAGES]?.state === listingStates.PENDING}>
                                        <Text>{t('onboarding.sideBarItem4')}</Text>
                                        {stepsMap[listingSteps.IMAGES]?.state == listingStates.COMPLETED || stepsMap[listingSteps.IMAGES]?.state == listingStates.PUBLISHED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item>
                                    <Menu.Item key="4" disabled={stepsMap[listingSteps.DRAFT]?.state === listingStates.PENDING}>
                                        <Text>{t('onboarding.sideBarItem5')}</Text>
                                        {stepsMap[listingSteps.DRAFT]?.state == listingStates.COMPLETED || stepsMap[listingSteps.DRAFT]?.state == listingStates.PUBLISHED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item>
                                </Menu>
                            }
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                            {(loadingMarketplaces) ? (
                                <div className="generic-spinner">
                                    <Spin />
                                </div>
                            ) : marketplaces.length > 0 && (
                                <Content
                                    className="site-layout-background"
                                    style={{
                                        margin: 0,
                                        minHeight: 280,
                                    }}
                                >
                                    {selected === 0 && (
                                        <Prices supportRequests={supportRequests} setSupportRequests={setSupportRequests} updateStep={updateStep} step={stepsMap[listingSteps.PRICE]} nextStep={stepsMap[listingSteps.ORDER]} listingId={listingId} marketplaces={marketplaces} setSelected={setSelected} selected={selected}
                                            productType={productType} setProductType={setProductType} category={category} setCategory={setCategory} />
                                    )}
                                    {selected === 1 && (
                                        <Order supportRequests={supportRequests} setSupportRequests={setSupportRequests} prevStep={stepsMap[listingSteps.PRICE]} updateStep={updateStep} step={stepsMap[listingSteps.ORDER]} nextStep={stepsMap[listingSteps.MEASURES]} listingId={listingId} setSelected={setSelected} selected={selected} setSteps={setSteps}
                                            productType={productType} setProductType={setProductType}
                                        />
                                    )}
                                    {/* {selected === 2 && (
                                        <Fulfillment supportRequests={supportRequests} setSupportRequests={setSupportRequests} prevStep={stepsMap[listingSteps.ORDER]} updateStep={updateStep} step={stepsMap[listingSteps.FULFILLMENT]} nextStep={stepsMap[listingSteps.MEASURES]} listingId={listingId} setSelected={setSelected} selected={selected} marketplaces={marketplaces} />
                                    )} */}
                                    {selected === 2 && (
                                        <MeasuresAndCosts supportRequests={supportRequests} setSupportRequests={setSupportRequests} prevStep={stepsMap[listingSteps.ORDER]} updateStep={updateStep} step={stepsMap[listingSteps.MEASURES]} nextStep={stepsMap[listingSteps.IMAGES]} listingId={listingId}
                                            setSelected={setSelected} selected={selected} marketplaces={marketplaces} setSteps={setSteps} />
                                    )}

                                    {selected === 3 && (
                                        <Images
                                            supportRequests={supportRequests} setSupportRequests={setSupportRequests}
                                            prevStep={stepsMap[listingSteps.MEASURES]}
                                            listingId={listingId}
                                            updateStep={updateStep}
                                            step={stepsMap[listingSteps.IMAGES]} nextStep={stepsMap[listingSteps.DRAFT]}
                                            marketplaces={marketplaces}
                                            setSelected={setSelected} selected={selected} setSteps={setSteps} />
                                    )}
                                    {selected === 4 && (
                                        <Draft supportRequests={supportRequests} setSupportRequests={setSupportRequests} updateStep={updateStep} prevStep={stepsMap[listingSteps.IMAGES]} step={stepsMap[listingSteps.DRAFT]} listingId={listingId} setSteps={setSteps} setSelected={setSelected} selected={selected} />
                                    )}
                                </Content>
                            )}
                        </Layout>
                    </Layout>
                </Col>
            </Row>
        </PageHeader>
    )
}
