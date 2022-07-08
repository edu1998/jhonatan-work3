import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Row, Col, Button, Card, Select, Input, Divider, Tabs, Form, Spin, Progress, Menu, Layout } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { FileTextFilled, LeftOutlined, InfoCircleOutlined, LoadingOutlined, PlusOutlined, SearchOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import './order.css';
import ProposalAlert from '../onboarding/components/steps/ProposalAlert';
import { orderStates, orderSteps, validateMessages } from '../../utils/const';
import { TableListings } from './components/TableListings';
import { Contents } from './components/steps/Contents';
import { Boxes } from './components/steps/Boxes';
import { State } from './components/steps/State';

const { Content, Sider } = Layout;

const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 14 }} spin />;

export const NewOrder = () => {
    const { t } = useTranslation();

    const [selected, setSelected] = useState(0);
    const [redirected, setRedirected] = useState(false);
    const [sentType, setSentType] = useState('');

    const [steps, setSteps] = useState();

    const { orderId } = useParams();

    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 18,
        },
    };

    return (
        <div className="content-div">
            <Row>
                <Col xs={8} sm={8} md={4}>
                    <Link to="/orders" >
                        <LeftOutlined className="side-bar-icon-back" />
                    </Link>
                    <FileTextFilled className="icon-order-size" />
                </Col>
                <Col xs={16} sm={16} md={20} className="text-align-left">
                    <Row>
                        <Col xs={12} sm={12} md={4} className="text-align-left">
                            <span className="font-size-20">{t('orders.section2')}</span><br />
                        </Col>
                        <Col xs={12} sm={12} md={8} className="text-align-left">
                            <Progress percent={steps && steps.filter((step) => step.state === orderStates.COMPLETED).length > 0 ? ((steps.filter((step) => step.state === orderStates.COMPLETED).length) / 3 * 100).toFixed(2) : 0} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24} sm={24} md={24} className="text-align-left">
                            {/* <span>{t('orders.subtitle')}</span> */}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="side-bar-margin-top">
                <Col span={24}>
                    <Layout>
                        <Sider width={200}>
                            <Menu
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
                                <Menu.Item key="0" disabled={!steps || steps.find((step) => step.step === orderSteps.CONTENIDO).state === orderStates.PENDING}> {t('orders.sideBarItem1')} {steps?.find((step) => step.step === orderSteps.CONTENIDO).state === orderStates.COMPLETED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item>
                                <Menu.Item key="1" disabled={!steps || steps.find((step) => step.step === orderSteps.CAJAS).state === orderStates.PENDING}> {t('orders.sideBarItem2')} {steps?.find((step) => step.step === orderSteps.CAJAS).state === orderStates.COMPLETED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item>
                                <Menu.Item key="2" disabled={!steps || steps.find((step) => step.step === orderSteps.ESTADO).state === orderStates.PENDING}> {t('orders.sideBarItem3')} {steps?.find((step) => step.step === orderSteps.ESTADO).state === orderStates.COMPLETED ? <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" /> : <span className="dot-gray dot-gray-margin-left" />}</Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                            {false ? (
                                <div className="generic-spinner">
                                    <Spin />
                                </div>
                            ) : (
                                <Content
                                    className="site-layout-background"
                                    style={{
                                        padding: 24,
                                        margin: 0,
                                        minHeight: 280,
                                    }}>
                                    {selected === 0 && (
                                        <Contents redirected={redirected} setRedirected={setRedirected}
                                            orderId={orderId} setSelected={setSelected}
                                            selected={selected} setSteps={setSteps} />
                                    )}
                                    {selected === 1 && (
                                        <Boxes
                                            orderId={orderId}
                                            setSelected={setSelected}
                                            setSentType={setSentType}
                                            selected={selected} setSteps={setSteps} />
                                    )}
                                    {selected === 2 && (
                                        <State
                                            sentType={sentType}
                                            orderId={orderId} setSelected={setSelected}
                                            selected={selected} setSteps={setSteps} />
                                    )}
                                </Content>
                            )}
                        </Layout>
                    </Layout>
                </Col>
            </Row>
        </div >
    )
}