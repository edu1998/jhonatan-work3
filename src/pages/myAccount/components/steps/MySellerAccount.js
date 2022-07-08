import React, { useEffect, useState } from 'react';
import { Row, Col, Divider, Button, Card, Spin, Switch, Tabs, Tooltip } from 'antd';
import {
    EVENT_SP_CALENDLY, USER_CALENDLY, sellerMarketplacesList
} from '../../../../utils/const';
import { InfoCircleOutlined } from '@ant-design/icons';
import useMySellerAccount from '../../hooks/useMySellerAccount';/* custom hook */
import { Calendly } from '../../../../components/Calendly';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import AmazonSellerAccount from '../marketplaces/AmazonSellerAccount';
import EbaySellerAccount from '../marketplaces/EbaySellerAccount';
import WalmartSellerAccount from '../marketplaces/WalmartSellerAccount';
import accessKeysApi from '../../../../api/aws-access-keys'
import { useParams } from 'react-router';
import ShopifySellerAccount from '../marketplaces/ShopifySellerAccount';

const { TabPane } = Tabs;

const ComponentByMarketplace = {
    Amazon: AmazonSellerAccount,
    Ebay: EbaySellerAccount,
    Walmart: WalmartSellerAccount,
    Shopify: ShopifySellerAccount,
}

const AccountByMarketplace = (props) => {
    let Comp = ComponentByMarketplace[props.tab];
    return <Comp {...props}></Comp>
}

export const MySellerAccount = ({ mySellerAccount, setMySellerAccount, setSelected, selected }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    const [deletingCredentials, setDeletingCredentials] = useState(false);
    const { marketplace, consent } = useParams();
    const [marketTab, setMarketTab] = useState(false);

    const {
        marketplaces, getMarketplaces,
        showForm, loadingGetMySellerAccount, loadingMySellerAccount,
        setShowForm,
        getMySellerAccountByMarketplace,
        updateMySellerAccount, createMySellerAccount,
    } = useMySellerAccount();

    const [showCalendly, setShowCalendly] = useState(false);
    const [tab, setTabs] = useState(marketplace ? marketplace : sellerMarketplacesList[0].name);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMySellerAccount({
            ...mySellerAccount,
            [name]: value.trim()
        })
    }

    useEffect(() => {
        if (consent) {
            setShowForm(true);
        }
    }, [consent])

    useEffect(() => {
        if (session) {
            getMarketplaces()
        }
    }, [])

    const handleSelect = (name, value) => {
        setMySellerAccount({
            ...mySellerAccount,
            [name]: value
        })
    }

    const handleSwitch = (name, checked) => {
        if (name === 'x_marketplace_aws') {
            setShowForm(checked);
            setMySellerAccount({
                ...mySellerAccount,
                x_marketplace_aws: checked ? 'ATVPDKIKX0DER' : null
                // x_cuenta_amazon: checked && !mySellerAccount.x_cuenta_amazon? true: mySellerAccount.x_cuenta_amazon,
            })
        } else {
            if (!checked && mySellerAccount.x_seller_lap) {
            } else {
                setMySellerAccount({
                    ...mySellerAccount,
                    [name]: checked
                })
            }
        }
    }

    useEffect(() => {
        if (session && tab && !consent) {
            getMySellerAccountByMarketplace(session, tab, mySellerAccount, setMySellerAccount)
        }
    }, [session, tab, consent])

    const onFinish = () => {
        mySellerAccount.id ?
            updateMySellerAccount(mySellerAccount, setMySellerAccount)
            : createMySellerAccount(mySellerAccount, setMySellerAccount)
    }

    const handleCalendly = () => {
        setShowCalendly(!showCalendly);
    }

    const handleChangeTabs = (key) => {
        setTabs(key);
    }

    const toggleCredentials = (checked) => {
        if (!checked) {
            setDeletingCredentials(true);
            accessKeysApi.forgetCredentials(session?.userInfo?.commercial_partner_id[0], tab).then((resp) => {
                getMySellerAccountByMarketplace(session, tab, mySellerAccount, setMySellerAccount);
                setDeletingCredentials(false);
            }).catch((error) => {
                setDeletingCredentials(false);
            });
        } else {
            setShowForm(checked);
        }
    }

    const reloadSellerAccount = () => {
        getMySellerAccountByMarketplace(session, tab, mySellerAccount, setMySellerAccount);
    }

    return (
        <div id="datosCuentaBanco">
            <Row>
                <Col className="text-align-left">
                    <h2 className="title-primary">{t('myAccount.title3')}</h2>
                    <span className="text-color-gray">{t('myAccount.subtitle3')} </span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Tabs activeKey={tab} defaultActiveKey={tab} onChange={handleChangeTabs}>
                        {marketplaces?.length > 0 && marketplaces?.map(marketplace => (
                            <TabPane tab={<img src={`data:image/svg+xml;utf8,${encodeURIComponent(parse(marketplace.svg))}`} />} key={marketplace.name} />
                        ))}
                    </Tabs>

                </Col>
            </Row>
            <Spin spinning={loadingGetMySellerAccount}>
                <>
                    <Divider />
                    <Row gutter={[12, 2]} className="text-align-left">
                        <Col span={5}>{t('myAccount.sellerAccount.input1.1')} <Tooltip title={t('myAccount.sellerAccount.switchInfo')}>
                            <InfoCircleOutlined /></Tooltip>
                        </Col>
                        <Col>
                            <Spin spinning={deletingCredentials}>
                                <Switch name="x_cuenta_amazon" checked={showForm}
                                    onChange={(checked) => { toggleCredentials(checked) }} /> {t('myAccount.sellerAccount.input1Description')}
                            </Spin>
                        </Col>
                        <Col>
                            <div id="shopify"></div>
                        </Col>
                    </Row>
                    <Divider />
                    {showForm && (
                        <>
                            <AccountByMarketplace session={session} selected={selected}
                                reloadSellerAccount={reloadSellerAccount}
                                tab={tab} marketplaces={marketplaces} setSelected={setSelected} mySellerAccount={mySellerAccount}
                                onFinish={onFinish} handleChange={handleChange}
                                handleSwitch={handleSwitch} handleSelect={handleSelect}
                                loadingMySellerAccount={loadingMySellerAccount}
                            />
                        </>
                    )}
                    <Divider />
                    <Row>
                        {selected === 2 && (
                            <>
                                <Col span={12} className="text-align-left-margin-top">
                                    <Button className="btn-primary"
                                        onClick={() => setSelected(selected - 2)}
                                    >{t('myAccount.return')}</Button>

                                </Col>
                                <Col span={12} className="col-align-rigth-margin-top">
                                    <Button className="btn-link-filled"
                                        type="primary"
                                        onClick={() => setSelected(selected + 1)}
                                    >
                                        {t('myAccount.next')}
                                    </Button>
                                </Col>
                            </>)}
                    </Row>
                    <Calendly
                        show={showCalendly} setShow={setShowCalendly}
                        calendlyUser={USER_CALENDLY} calendlyEvent={EVENT_SP_CALENDLY} />
                </>
            </Spin>
        </div>
    )
}
