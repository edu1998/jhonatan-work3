import React, { useEffect, useState } from 'react'
import { Col, Divider, Form, Row, Typography, Button, Tooltip, Spin, Input, Modal, Skeleton, Result } from 'antd'
import { InfoCircleOutlined, CheckCircleFilled, PlusOutlined, MinusCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import * as queryString from 'query-string';
import accessKeysApi from '../../../../api/aws-access-keys';
import partnerApi from '../../../../api/partner';
import { useHistory, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/lib/form/Form';
import { useDispatch } from 'react-redux';
import * as Actions from '../../../../redux/session/action';
import { openNotification } from '../../../../components/Toastr';

const { Item } = Form;
const { Text, Title, Link } = Typography;
const typesPolicies = ['payment', 'fulfillment', 'return', 'inventoryLocation'];

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
        tab, loadingMySellerAccount } = props;

    const [form] = useForm();
    const [loadingConsentUrl, setLoadingConsentUrl] = useState(false);
    const [processingConsent, setProcessingConsent] = useState(false);
    const [loadingMigrateListings, setLoadingMigrateListings] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loadingPolicies, setLoadingPolicies] = useState(false);
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        if (consent) {
            let qs = queryString.parse(location.search);
            setProcessingConsent(true);
            accessKeysApi.saveCredentials(session?.userInfo?.commercial_partner_id[0], tab, qs).then((resp) => {
                reloadSellerAccount();
                dispatch(Actions.updateSellerAccountStatusSession(true));
                setProcessingConsent(false);
                history.push("/my-account?step=2");
            }).catch(() => {
                setProcessingConsent(false);
                openNotification({ status: false, content: 'Error al sincronizar el seller. Intente nuevamente.' });
            });
        }
    }, []);

    const openAutenticateTab = () => {
        setLoadingConsentUrl(true);
        accessKeysApi.getConsentUrl(session?.userInfo?.commercial_partner_id[0], tab).then((resp) => {
            window.open(resp.data, '_self');
            setLoadingConsentUrl(false);
        }).catch((error) => {
            setLoadingConsentUrl(false);
        });
    }

    const migrateListings = () => {
        form.submit();
    }

    const doMigrateListings = (values) => {
        setLoadingMigrateListings(true);
        if (values?.listingsIds?.length > 0) {
            partnerApi.migrateListings(session?.userInfo?.commercial_partner_id[0], tab, values).then((resp) => {
                handleResponse(resp.data);
                setShowModal(false)
                setLoadingMigrateListings(false);
            }).catch((error) => {
                setLoadingMigrateListings(false);
            });
        }
    }

    const handleResponse = (resp) => {
        if (!resp.success) {
            Modal.error({
                title: 'No se ha podido migrar.',
                width: 800,
                content: <Result status="error">
                    {resp?.errors?.length > 0 &&
                        resp?.errors?.map((error) => {
                            return <Row>
                                <Col span={24}>
                                    <Text>{error}</Text>
                                </Col>
                            </Row>
                        })
                    }
                </Result>,
            });
        } else {
            form.resetFields();
            Modal.confirm({
                title: 'Se ha aceptado la migración de listings.',
                width: 800,
                okText: "Cerrar",
                content: <Result
                    status="success"
                    title="Se ha aceptado la migración de listings"
                    subTitle="Se sincronizarán automáticamente o usted puede sincronizarlos manualmente en la pantalla Home, desde el botón SINCRONIZAR"
                />,
            });
        }
    }

    useEffect(() => {
        if (mySellerAccount?.credentials) {
            setLoadingPolicies(true);
            partnerApi.policiesByPartnerAndMarketplace(session?.userInfo?.commercial_partner_id[0], tab).then((resp) => {
                setPolicies(resp.data)
                setLoadingPolicies(false);
            }).catch((error) => {
                setLoadingPolicies(false);
            });
        }
    }, [mySellerAccount?.credentials])

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 24, offset: 0 },
        },
    };

    return (<>
        {loadingMySellerAccount ? <Skeleton /> :
            <>
                <Row gutter={[12, 2]} className="text-align-left">
                    <Col span={5}>{t('myAccount.sellerAccount.input2')}</Col>
                    <Col>
                        {processingConsent ? <Spin /> :
                            <>
                                {(!mySellerAccount || !mySellerAccount.credentials) && <Button onClick={openAutenticateTab} loading={loadingConsentUrl} type="primary" ghost>Asociar con Ebay Seller Account</Button>}
                                {mySellerAccount?.credentials && <span><CheckCircleFilled className="dot-green" /> {t('myAccount.sellerAccount.input2Description2.1')}</span>}
                            </>
                        }
                    </Col>
                </Row>
                {mySellerAccount?.credentials &&
                    <Row gutter={[12, 2]} className="text-align-left">
                        <Divider />
                        <Col span={5}>
                            {t('myAccount.sellerAccount.migrateListing')}{' '}
                            <Tooltip title={t('myAccount.sellerAccount.migrateListingInfo')}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>
                        </Col>
                        <Col span={5}>
                            <Button type="primary" loading={loadingMigrateListings} onClick={() => setShowModal(!showModal)}>{'Migrar Listings'}</Button>
                        </Col>
                    </Row>
                }
                {mySellerAccount?.credentials &&
                    <>
                        <Divider />
                        {loadingPolicies &&
                            <Row gutter={[12, 2]} className="text-align-left">
                                <Col span={5}>
                                    {t(`myAccount.sellerAccount.EbayInputs.loadingPolicies`)}{' '}
                                </Col>
                                <Col>
                                    <Spin />
                                </Col>
                            </Row>
                        }
                        {policies?.length > 0 && (
                            <Row gutter={[12, 2]} >
                                {policies.map(policy => (
                                    <Col xs={24} sm={8} md={8} lg={6}>
                                        <Row gutter={[12, 2]} className="text-align-left" >
                                            <Col>{t(`dashboard.marketplaces.${policy?.marketplaceId?.replace(' ', '')}`)}</Col>
                                        </Row>
                                        {typesPolicies?.map(policyName => (
                                            <>
                                                <Row className="text-align-left">
                                                    <Col span={20}>
                                                        {t(`myAccount.sellerAccount.EbayInputs.${policyName}Policy`)}{' '}
                                                    </Col>
                                                    <Col >
                                                        <Tooltip placement="top" title={t(`myAccount.sellerAccount.${policy[policyName]}Policy`)}>
                                                            <CheckCircleFilled className={`${policy[policyName] ? "dot-green" : "dot-red"}`} />
                                                        </Tooltip>
                                                    </Col>
                                                </Row>
                                            </>
                                        ))}
                                        <br />
                                    </Col>
                                ))}
                            </Row>
                        )}

                        <Row gutter={[12, 2]} className="text-align-left">
                            <Col >
                                <Link href="https://www.bizpolicy.ebay.com/businesspolicy/manage" target="_blank">
                                    {t(`myAccount.sellerAccount.ebayLinkToPolicies`)}
                                </Link>
                            </Col>
                        </Row>
                    </>
                }
                <Modal
                    visible={showModal}
                    onOk={migrateListings}
                    onCancel={() => setShowModal(!showModal)}
                    cancelText="Cerrar"
                    okText="Aceptar"
                    width={900}
                >
                    <Title level={5}>{'Proceso de migración'}</Title>
                    <Row>
                        <Col span={8}>
                            <Text>{'Números de Artículos'}</Text>{' '}
                            <Tooltip title={'Ingrese hasta cinco Números de Artículos, que se encuentran en la tabla de anuncios, dentro de Seller Center > Anuncios > Activos. Obligatorio: tener SKU, ser de tipo FIXED PRICE, POSTAL CODE, y política de pago INMEDIATE PAYMENT habilitado.'}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>
                        </Col>
                        <Col span={16}>
                            <Form layout="vertical" form={form} onFinish={doMigrateListings}>
                                <Form.List name="listingsIds">
                                    {(fields, { add, remove }, { errors }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <Item {...formItemLayoutWithOutLabel} key={field.key}>
                                                    <Item {...field} validateTrigger={['onChange', 'onBlur']} noStyle>
                                                        <Input style={{ width: '60%' }} />
                                                    </Item>
                                                    {fields.length > 0 ? (
                                                        <MinusCircleOutlined style={{ margin: '0 8px', color: '#999', fontSize: 20 }} className="dynamic-delete-button" onClick={() => remove(field.name)} />
                                                    ) : null}
                                                </Item>
                                            ))}
                                            {fields.length < 5 &&
                                                <Item>
                                                    <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />}>
                                                        {t('onboarding.add')} Listing Id
                                                    </Button>
                                                </Item>
                                            }
                                        </>
                                    )}
                                </Form.List>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
            </>
        }
    </>
    )
}
