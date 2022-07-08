import React, { useEffect, useState } from 'react'
import { Col, Divider, Row, Card, Button, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import accessKeysApi from '../../../../api/aws-access-keys'
import { useHistory, useLocation, useParams } from 'react-router'
import * as queryString from 'query-string';
import { CheckCircleFilled, LinkOutlined, FilePptOutlined } from '@ant-design/icons';
import { URL_SP_AWS } from '../../../../utils/const'
import { useDispatch } from 'react-redux'
import * as Actions from '../../../../redux/session/action';
import { openNotification } from '../../../../components/Toastr';

export default (props) => {
    const { t } = useTranslation();
    const { consent } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const {
        session,
        mySellerAccount,
        reloadSellerAccount,
        tab } = props;

    const [consentUrl, setConsentUrl] = useState();
    const [loadingConsentUrl, setLoadingConsentUrl] = useState(false);
    const [processingConsent, setProcessingConsent] = useState(false);

    useEffect(() => {
        if (consent) {
            let qs = queryString.parse(location.search);
            setProcessingConsent(true);
            accessKeysApi.saveCredentials(session?.userInfo?.commercial_partner_id[0], tab, qs).then((resp) => {
                reloadSellerAccount();
                setProcessingConsent(false);
                if (!resp?.data?.success && !resp?.data?.id) {
                    openNotification({ status: false, content: 'Error al sincronizar el seller. Intente nuevamente.' });
                    history.push("/my-account?step=2");
                    return;
                }
                dispatch(Actions.updateSellerAccountStatusSession(true));
                history.push("/my-account?step=2");
            }).catch(() => {
                setProcessingConsent(false);
                history.push("/my-account?step=2");
                openNotification({ status: false, content: 'Error al sincronizar el seller. Intente nuevamente.' });
            });
        }
    }, [consent])

    useEffect(() => {
        if (!mySellerAccount) {
            setLoadingConsentUrl(true);
            accessKeysApi.getConsentUrl(session?.userInfo?.commercial_partner_id[0], tab).then((resp) => {
                setConsentUrl(resp.data.consentUrl);
                setLoadingConsentUrl(false);
            }).catch(() => {
                setLoadingConsentUrl(false);
            });
        }

    }, [mySellerAccount]);

    return (
        <>

            <Row gutter={[12, 2]} className="text-align-left">
                <Col span={5}>{t('myAccount.sellerAccount.input2')}
                </Col>
                <Col>
                    {processingConsent ? <Spin /> :
                        <>
                            {(!mySellerAccount || !mySellerAccount.credentials) && <Button href={consentUrl} loading={loadingConsentUrl} type="primary" ghost>Asociar con Seller Central</Button>}
                            {(mySellerAccount && mySellerAccount.credentials) && <span><CheckCircleFilled className="dot-green" /> {t('myAccount.sellerAccount.input2Description2.1')}</span>}
                        </>
                    }
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col className="text-align-left" span={24}>
                    <h3>{t('myAccount.sellerAccount.card1')}</h3>
                    <Card >
                        <Row>
                            <Col span={2}><LinkOutlined /></Col>
                            <Col span={15}>
                                <span><FilePptOutlined className="home-document-text-icon" /> {t('myAccount.sellerAccount.card1Description')}</span>
                            </Col>
                            <Col span={7}>
                                <Button className="btn-link-filled"
                                    type="primary" target="_blank" href={URL_SP_AWS}
                                >
                                    {t('myAccount.sellerAccount.card1Button')}
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
