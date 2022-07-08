import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Col, Divider, Space, Form, Row, Select, Switch, Card, Button, Tooltip, Spin, Avatar, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import accessKeysApi from '../../../../api/aws-access-keys'
import { useHistory, useLocation, useParams } from 'react-router'
import * as queryString from 'query-string';
import { InfoCircleOutlined, CheckCircleFilled } from '@ant-design/icons';

const InputShopify = ({ t, onChange }) => {
    return ReactDOM.createPortal(
        <Space align="baseline">
            <Input size="small" addonBefore={t('myAccount.sellerAccount.shop')} onChange={onChange} />
        </Space>, document.querySelector('#shopify')
    )
}

export default (props) => {
    const { t } = useTranslation();
    const { marketplace, consent } = useParams();
    const location = useLocation();
    const {
        session, selected,
        mySellerAccount, handleSwitch,
        reloadSellerAccount,
        handleSelect, handleChange, onFinish,
        tab, setSelected, loadingMySellerAccount } = props;

    const [shop, setShop] = useState();
    const [url, setUrl] = useState();
    const [consentUrl, setConsentUrl] = useState();
    const [loadingConsentUrl, setLoadingConsentUrl] = useState(false);
    const [processingConsent, setProcessingConsent] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (consent) {
            let qs = queryString.parse(location.search);
            setProcessingConsent(true);
            if(session) {
                accessKeysApi.saveCredentials(session?.userInfo?.commercial_partner_id[0], tab, qs).then((resp) => {
                    reloadSellerAccount();
                    // history.push("/my-account");
                    setProcessingConsent(false);
                }).catch(() => {
                    history.push("/my-account");
                    setProcessingConsent(false);
                });
            } else {
                accessKeysApi.saveCredentials(0, tab, qs).then((resp) => {
                    history.push("/login?link="+resp.data.id);
                    setProcessingConsent(false);
                }).catch(() => {
                    history.push("/login");
                    setProcessingConsent(false);
                });
            }
        }
    }, [consent])

    useEffect(() => {
        if (!mySellerAccount && session) {
            setLoadingConsentUrl(true);
            accessKeysApi.getConsentUrl(session?.userInfo?.commercial_partner_id[0], tab).then((resp) => {
                setConsentUrl(resp.data.consentUrl);
                setLoadingConsentUrl(false);
            }).catch(() => {
                setLoadingConsentUrl(false);
            });
        }

    }, [mySellerAccount]);

    useEffect(() => {
        if (consentUrl) {
            let fullUrl = consentUrl.replace('%%shop%%', shop)
            setUrl(fullUrl)
        } else {
            setUrl(consentUrl)
        }

    }, [shop]);

    const formItemLayout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 0,
        },
    }

    const onChange = (event) => {
        setShop(event.target.value.trim());
    };

    return (
        <>
            <Row gutter={[12, 2]} className="text-align-left">

                <Col span={5}>{t('myAccount.sellerAccount.input2')}
                </Col>

                <Col>
                    {processingConsent ? <Spin /> :
                        <>

                            {(!mySellerAccount || !mySellerAccount.credentials) &&
                                <Space direction="vertical">
                                    <Input addonBefore={t('myAccount.sellerAccount.shop')} onChange={onChange} />
                                    <Button href={url} loading={loadingConsentUrl} type="primary" ghost {...!shop && { disabled: true }}>
                                        Asociar con Shopify
                                    </Button>
                                </Space>}
                            {(mySellerAccount && mySellerAccount.credentials) &&
                                <span>
                                    <CheckCircleFilled className="dot-green" /> {t('myAccount.sellerAccount.input2Description2.1')}
                                </span>}
                        </>
                    }
                </Col>
            </Row>
        </>
    )
}
