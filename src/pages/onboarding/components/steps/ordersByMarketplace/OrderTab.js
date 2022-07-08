import React, { useState } from "react";
import { listingStates } from "../../../../../utils/const";
import AcceptedProposalAlert from "../AcceptedProposalAlert";
import ProposalAlert from "../ProposalAlert";
import AmazonOrder from "./AmazonOrder";
import EbayOrder from "./EbayOrder";
import WalmartOrder from "./WalmartOrder";
import ShopifyOrder from "./ShopifyOrder";
import { Card, Row, Col, Tabs, Form, Button, Divider, Input, Typography } from 'antd';
import { TableProductVariants } from "../../TableProductVariants";
import { useTranslation } from "react-i18next";
import Pending from '../Pending';
import { canEdit } from "../../../../../utils/functions";
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";
const { TabPane } = Tabs;
const { Item } = Form;
const { Title } = Typography;

const componentByMarketplace = {
    "Amazon": AmazonOrder,
    "Amazon Mexico": AmazonOrder,
    "Amazon Canada": AmazonOrder,
    "Amazon Brazil": AmazonOrder,
    "Walmart": WalmartOrder,
    "Ebay": EbayOrder,
    "Ebay Canada": EbayOrder,
    "Ebay Spain": EbayOrder,
    "Ebay Germany": EbayOrder,
    "Shopify": ShopifyOrder,
}

const OrderByMarketplace = (props) => {
    const Comp = componentByMarketplace[props.currentTab];
    return <Comp {...props} />
}

export default ({ getOrder, listingId, canEditItem, toggleModalEditVariant, toggleModalViewComparison, propertiesInfo, handleUpdateFormAttributes, onClickRejectProposal, justSent, setOrderRetrieved,
    onClickAcceptProposal, orderRetrieved, acceptedProposal, step, tab, setSelected, selected, currentTab, setCurrentTab, form, modalEditVariantVisible, firstMkt }
) => {
    const session = useSelector(store => store.Session.session);
    const { t } = useTranslation();
    const [isPack, setIsPack] = useState(false);

    return (<>
        {!acceptedProposal && !session.userInfo.isAdmin && step?.state === listingStates.PENDING_ACKNOWLEDGE && <ProposalAlert onClickAccept={onClickAcceptProposal} onClickReject={onClickRejectProposal} />}
        {acceptedProposal && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />}
        {!session.userInfo.isAdmin && step?.state === listingStates.PENDING_LAP ? (
            <Pending />) :
            <>
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
                        {orderRetrieved && orderRetrieved[tab]?.selectedMarketplaces?.length > 0 &&
                            <Card style={{ backgroundColor: '#e7e7e730', borderRadius: '5px' }}>
                                <Tabs defaultActiveKey={currentTab} onChange={(key) => setCurrentTab(key)} >
                                    {orderRetrieved[tab]?.selectedMarketplaces?.map(selectedMarketplace => (
                                        <TabPane tab={selectedMarketplace} key={selectedMarketplace}>
                                            {orderRetrieved && orderRetrieved[tab] && <>
                                                <Card style={{ backgroundColor: '#e7e7e730', borderRadius: '5px' }}>
                                                    {currentTab && propertiesInfo && (
                                                        <>
                                                            <Row>
                                                                <Col span={4} offset={20} style={{ textAlign: 'right', paddingRight: 50, marginBottom: 20 }}>
                                                                    {orderRetrieved[tab]?.listingPerMarketplace[currentTab]?.product?.externalAttributes &&
                                                                        <Button type="primary" icon={<WarningOutlined />} onClick={() => toggleModalViewComparison(tab, currentTab, 0, false)}>{'Ver comparativa'}</Button>
                                                                    }
                                                                </Col>
                                                            </Row>
                                                            <Item hidden name={[tab, 'listingPerMarketplace', currentTab, 'product', 'id']}>
                                                                <Input></Input>
                                                            </Item>
                                                            <OrderByMarketplace setOrderRetrieved={setOrderRetrieved} firstMkt={firstMkt}
                                                                getOrder={getOrder} listingId={listingId} externalId={orderRetrieved[tab].listingPerMarketplace[currentTab]?.product?.externalId}
                                                                defaultCode={orderRetrieved[tab].listingPerMarketplace[currentTab]?.product?.defaultCode}
                                                                path={[tab, 'listingPerMarketplace', currentTab, 'product', 'attributes']} justSent={justSent}
                                                                tab={tab} orderRetrieved={orderRetrieved} propertiesInfo={propertiesInfo} canEditItem={canEditItem}
                                                                currentTab={currentTab} setIsPack={setIsPack} form={form} modalEditVariantVisible={modalEditVariantVisible}
                                                                orderForm={form} handleUpdateFormAttributes={handleUpdateFormAttributes} isMain={true} />
                                                        </>
                                                    )}
                                                    {orderRetrieved[tab]?.listingPerMarketplace[currentTab]?.variants?.length > 0 &&
                                                        <Row>
                                                            <Divider className="divider-margin" />
                                                            <Title level={4}>Variaciones</Title>
                                                            <Col xs={24} sm={24} md={24}>
                                                                <TableProductVariants productVariants={orderRetrieved[tab]?.listingPerMarketplace[currentTab]?.variants}
                                                                    tab={tab} currentTab={currentTab} step={step} toggleModalEditVariant={toggleModalEditVariant}
                                                                    toggleModalViewComparison={toggleModalViewComparison} canEditItem={canEditItem} />
                                                            </Col>
                                                        </Row>
                                                    }
                                                </Card>
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
                                                                    <Input.TextArea rows={10} name="commentsLAP" maxLength={2000} showCount={true}
                                                                        disabled={!canEdit(session, tab, step?.state)} />
                                                                </Item>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </>}
                                        </TabPane>
                                    ))}
                                </Tabs>
                            </Card>
                        }
                    </Col>
                </Row>
            </>
        }

    </>);
}