import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Row, Col, Divider, Form, Input, Button, Spin, Tabs, PageHeader, Affix, Select,
    Space, List, Card, Typography, InputNumber, Checkbox, Radio, Tooltip, Popconfirm, ConfigProvider
} from 'antd';
import { validateMessages } from '../../../../utils/const';
import { InfoCircleOutlined, DownloadOutlined, CloseOutlined, SendOutlined, PlusOutlined, WarningOutlined } from '@ant-design/icons';
import '../../onboarding.css';
import { useTranslation } from 'react-i18next';
import { canEdit } from '../../../../utils/functions';
import partnerApi from '../../../../api/partner';
import categoryApi from '../../../../api/aws-category';
import Pending from './Pending';
import ProposalAlert from './ProposalAlert';
import AcceptedProposalAlert from './AcceptedProposalAlert';
import { openNotification } from '../../../../components/Toastr';
import parse from 'html-react-parser';
import { getErrorMessage } from '../../../../api/api';
import { listingStates, sellerMarketplaces, formItemLayout, marketplaceCurrency } from '../../../../utils/const.js';
import ModalRejectProposal from './ModalRejectProposal';
import { useHistory } from 'react-router';
import AmazonPrices from './pricesByMarketplace/AmazonPrices';
import WalmartPrices from './pricesByMarketplace/WalmartPrices';
import EbayPrices from './pricesByMarketplace/EbayPrices';
import ShopifyPrices from './pricesByMarketplace/ShopifyPrices';
import SupportRequests from './SupportRequests';

const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;
const { Text, Title } = Typography;

const maxLength2000 = 2000;

const formByMarketplace = {
    "Amazon": AmazonPrices,
    "Amazon Mexico": AmazonPrices,
    "Amazon Canada": AmazonPrices,
    "Amazon Brazil": AmazonPrices,
    "Walmart": WalmartPrices,
    "Ebay": EbayPrices,
    "Ebay Canada": EbayPrices,
    "Ebay Spain": EbayPrices,
    "Ebay Germany": EbayPrices,
    "Shopify": ShopifyPrices
}

const PricesByMarketplace = (props) => {
    let Comp = formByMarketplace[props.selectedMarketplace];
    return <Comp {...props}></Comp>
}

const propertiesToReplicateClient = ['name', 'category'];
const propertiesToReplicateLAP = ['price', 'defaultCode'];
const marketplacesWithProductTypeRequired = [
    sellerMarketplaces.AMAZON, sellerMarketplaces.AMAZON_MX, sellerMarketplaces.AMAZON_CA,
    sellerMarketplaces.AMAZON_BR, sellerMarketplaces.EBAY, sellerMarketplaces.EBAY_CA,
    sellerMarketplaces.EBAY_DE, sellerMarketplaces.EBAY_ES, sellerMarketplaces.WALMART
];

const Prices = ({ supportRequests, setSupportRequests, listingId, updateStep, marketplaces, step, nextStep, setSelected, selected, productType, setProductType, category, setCategory }) => {

    const { t } = useTranslation();
    const history = useHistory();
    const [form] = Form.useForm();
    const session = useSelector(store => store.Session.session);

    const [tab, setTabs] = useState(session?.userInfo?.role == 'Admin' ? 'LAP' : 'Client');
    const [loading, setLoading] = useState(false);
    const [categoriesByMarketplace, setCategoriesByMarketplace] = useState();
    const [currentTab, setCurrentTab] = useState();
    const [loadingUpdateCategory, setLoadingUpdateCategory] = useState(false);
    const [acceptedProposal, setAcceptedProposal] = useState(false);
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [loadingSaveDraft, setLoadingSaveDraft] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [justSent, setJustSent] = useState(false);
    const [loadingAcceptProposal, setLoadingAcceptProposal] = useState(false);
    const [pricesRetrieved, setPricesRetrieved] = useState(undefined);
    const [loadingPendingListing, setLoadingPendingListing] = useState(true);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [loadingDocument, setLoadingDocument] = useState(false);
    const [competitorDocument, setCompetitorDocument] = useState(undefined);
    const [showVariantsTable, setShowVariantsTable] = useState(false);
    const [loadingGetCategories, setLoadingGetCategories] = useState(false);
    const [firstMkt, setFirstMkt] = useState(null);
    const [refresh, setRefresh] = useState();
    const [currency, setCurrency] = useState('USD');

    const copyDataFromFirstMktInClient = () => {
        if (tab && form && tab != 'LAP') {
            const values = form.getFieldValue();
            for (const mkt of values?.Client?.selectedMarketplaces) {
                if (mkt == sellerMarketplaces.AMAZON) {
                    continue;
                }
                if (values && values[tab] && values[tab]?.listingPerMarketplace && values[tab]?.listingPerMarketplace[firstMkt]) {
                    for (const propertie of propertiesToReplicateClient) {
                        if (!values[tab]?.listingPerMarketplace[mkt]) {
                            values[tab].listingPerMarketplace[mkt] = { marketplace: mkt }
                        }
                        if ([null, undefined, ""].includes(values[tab]?.listingPerMarketplace[mkt][propertie])) {
                            values.Client.listingPerMarketplace[mkt][propertie] = values.Client.listingPerMarketplace[firstMkt][propertie]
                        }
                    }
                }
            }
            form.setFieldsValue(values);
        }
    }

    const copyDataFromFirstMktInLAP = () => {
        if (tab && form && tab === 'LAP') {
            const values = form.getFieldValue();
            for (const mkt of values?.Client?.selectedMarketplaces) {
                if (values && values[tab]
                    && values[tab]?.listingPerMarketplace
                    && values[tab]?.listingPerMarketplace[firstMkt]
                    && values[tab]?.listingPerMarketplace[firstMkt].product) {

                    if (!values[tab]?.listingPerMarketplace[mkt]?.product) {
                        values[tab].listingPerMarketplace[mkt].product = {
                            defaultCode: values[tab].listingPerMarketplace[firstMkt]?.product?.defaultCode,
                            price: values[tab].listingPerMarketplace[firstMkt]?.product?.price
                        }
                    }

                    if (values[tab].listingPerMarketplace[firstMkt].variants?.length > 0 && values[tab].listingPerMarketplace[mkt].variants?.length == 0) {
                        for (const idx in values[tab].listingPerMarketplace[firstMkt].variants) {
                            if (!values[tab].listingPerMarketplace[mkt]?.variants[idx]) {
                                values[tab]?.listingPerMarketplace[mkt].variants.push({});
                                for (const property of propertiesToReplicateLAP) {
                                    if (values[tab]?.listingPerMarketplace[mkt]?.variants[idx] && (!values[tab]?.listingPerMarketplace[mkt]?.variants[idx][property] || values[tab]?.listingPerMarketplace[mkt]?.variants[idx][property] === '')) {
                                        values[tab].listingPerMarketplace[mkt].variants[idx][property] = values[tab].listingPerMarketplace[firstMkt].variants[idx][property];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            form.setFieldsValue(values);
        }
    }

    useEffect(() => {
        const editionAllowed = session && tab && step && canEdit(session, tab, step?.state);
        if (!editionAllowed) return;
    }, [currentTab, tab])

    useEffect(() => {
        getPrices();
        setCurrency('USD');
    }, []);

    useEffect(() => {
        if (step && step.state === listingStates.COMPLETED) {
            setAcceptedProposal(true);
        }
    }, [step]);

    const loadCompetitorDocument = (clientId) => {
        setLoadingDocument(true);
        partnerApi.getCompetitorDocument(session.userInfo.partner_id[0], listingId, clientId)
            .then(({ data }) => {
                setCompetitorDocument(data);
                setLoadingDocument(false);
            })
            .catch(error => {
                setLoadingDocument(false);
                openNotification({ status: false, content: 'Error al obtener el documento de competidor' });
            });
    }

    const getPrices = async () => {
        await partnerApi.getPrices(session.userInfo.partner_id[0], listingId)
            .then(res => {
                const listing = res.data;

                if (listing?.Client?.clientId) {
                    loadCompetitorDocument(listing.Client.clientId);
                }
                if (listing?.Client?.listingPerMarketplace && Object.keys(listing?.Client?.listingPerMarketplace).length === 0) {
                    listing.Client.listingPerMarketplace = {
                        "Amazon": {
                            marketplace: sellerMarketplaces.AMAZON
                        }
                    }
                }


                if ((listing?.LAP?.listingPerMarketplace && Object.keys(listing?.LAP?.listingPerMarketplace).length === 0) || !listing?.LAP?.listingPerMarketplace) {
                    if (!listing.LAP) {
                        listing.LAP = {};
                    }
                    listing.LAP.listingPerMarketplace = {
                        "Amazon": {
                            marketplace: sellerMarketplaces.AMAZON
                        }
                    }
                }

                listing.Client.selectedMarketplaces = Object.keys(listing.Client.listingPerMarketplace);
                listing.LAP.selectedMarketplaces = Object.keys(listing.LAP.listingPerMarketplace);
                listing.hasVariantRoot = false;
                let mainMarketplace = listing.Client.selectedMarketplaces[0];
                setFirstMkt(mainMarketplace);
                setCurrentTab(mainMarketplace);
                setShowVariantsTable(listing.LAP.hasVariant);
                setLoadingPendingListing(false);
                setPricesRetrieved(listing);
            })
            .catch(error => {
                setLoadingPendingListing(false);
                openNotification({ status: false, content: 'Error al obtener el listado de categorías' });
            })
    };

    useEffect(() => {
        if (pricesRetrieved && Object.entries(pricesRetrieved).length > 0 && !justSent) {
            form.setFieldsValue({ ...pricesRetrieved, step: step });
            if (pricesRetrieved[tab].hasVariant && pricesRetrieved[tab]["listingPerMarketplace"][currentTab]["variants"]?.length == 0) {
                handleHasVariant(true);
            }
        }
    }, [pricesRetrieved])

    const updateCategoriesByMarketplace = () => {
        if (currentTab) {
            setLoadingUpdateCategory(true);
            categoryApi.updateByMarketplace(pricesRetrieved.partnerId, currentTab)
                .then(res => {
                    const data = res.data;
                    openNotification({ status: true, content: `Categorías actualizadas para ${currentTab}` });
                    setLoadingUpdateCategory(false);
                })
                .catch(error => {
                    setLoadingUpdateCategory(false);
                    openNotification({ status: false, content: error?.response?.data?.message || `Error al actualizar el listado de categorías para ${currentTab}` });
                })
        }
    }

    const getCategoriesByMarketplace = (marketplace, name) => {
        setLoadingGetCategories(true);
        if (marketplace) {
            categoryApi.getByMarketplaceAndSearch(marketplace, name)
                .then(res => {
                    const data = res.data;
                    setCategoriesByMarketplace(data?.map((item, index) => ({
                        ...item,
                        value: item.name,
                        label: renderItem(item)?.label,
                        key: index
                    })
                    ));
                    setLoadingGetCategories(false);
                })
                .catch(error => {
                    setLoadingGetCategories(false);
                    openNotification({ status: false, content: error?.response?.data?.message || `Error al obtener el listado de categorías para ${currentTab}` });
                })
            let newVals = { [`${tab}`]: { listingPerMarketplace: { [`${currentTab}`]: { productType: null } } } }
            form.setFieldsValue(newVals);
        }
    }

    const renderItem = (category) => ({
        value: category,
        label: (
            <div>
                <span style={{ fontWeight: 600, fontSize: 16, marginRight: 10 }}>{category?.name}</span>
                <span style={{ color: 'grey', fontSize: 13 }}> {category?.complete_name?.replace(/,/g, "/")}</span>
            </div>
        ),
    });

    const handleChangeCheckbox = (tab, checkedValues) => {
        let newPr = { ...pricesRetrieved };
        newPr[tab].selectedMarketplaces = checkedValues;
        setPricesRetrieved(newPr);
        setFirstMkt(checkedValues?.length > 0 ? checkedValues[0] : null);
    }

    const validateProductType = (formData) => {
        let value = true;
        for (const mkt of formData[tab]?.selectedMarketplaces) {
            if (marketplacesWithProductTypeRequired.includes(mkt) && !formData[tab]?.listingPerMarketplace[mkt]?.productType) {
                openNotification({ status: false, content: `Debe seleccionar una categoría en ${mkt}` });
                value = false;
            }
        }
        return value;
    }

    const isValidForm = (formData) => {
        let value = true;
        for (const mkt of formData[tab]?.selectedMarketplaces) {
            if (!formData[tab]?.listingPerMarketplace[mkt]?.category) {
                openNotification({ status: false, content: `Debe completar ${mkt}` });
                value = false;
            }
        }
        return value;
    }

    const onFinish = async (formFields) => {
        setLoadingSend(true);
        if (!formFields) {
            setLoadingSend(false);
            return;
        }
        if (!(tab === 'LAP' && session.userInfo.isAdmin ? validateProductType(formFields) : isValidForm(formFields))) {
            setLoadingSend(false);
            return;
        };

        await partnerApi.sendPrices(session.userInfo.partner_id[0], pricesRetrieved.id, formFields)
            .then((response) => {
                openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                setJustSent(true);
                updateStep([{
                    ...step,
                    state: session.userInfo.isAdmin ? listingStates.PENDING_ACKNOWLEDGE : listingStates.PENDING_LAP
                }]);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) })
            });
        setLoadingSend(false);
    }

    const onSaveDraft = async () => {
        const formFields = form.getFieldsValue();

        if (formFields) {
            setLoadingSaveDraft(true);
            await partnerApi.updatePrices(session.userInfo.partner_id[0], pricesRetrieved.id, formFields)
                .then((response) => {
                    openNotification({ status: true, content: t('onboarding.draftSavedSuccessfully') });
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
            setLoadingSaveDraft(false);
        }
    }

    const handleChangeTabs = (key) => {
        setCurrentTab(firstMkt);
        setTabs(key);
    }

    const handleMarketplaceTabChange = (key) => {
        copyDataFromFirstMktInLAP();
        copyDataFromFirstMktInClient();
        setCurrency(marketplaceCurrency[key]);
        setCurrentTab(key);
    };

    const handleAdd = (selectedMarketplace) => {
        let formValues = form.getFieldValue();
        formValues["LAP"]["listingPerMarketplace"][selectedMarketplace]["variants"].push({});
        formValues["LAP"]["hasVariant"] = showVariantsTable;
        form.setFieldsValue(formValues);
        setPricesRetrieved(formValues);
    }

    const handleDelete = (selectedMarketplace, index) => {
        let formValues = form.getFieldValue();
        formValues["LAP"]["listingPerMarketplace"][selectedMarketplace]["variants"].splice(index, 1);
        formValues["LAP"]["hasVariant"] = showVariantsTable;
        form.setFieldsValue(formValues);
        setPricesRetrieved(formValues);
    }

    const handleHasVariant = (value) => {
        if (session?.userInfo?.role != 'Admin') {
            return
        }
        let formValues = form.getFieldValue();
        value ?
            (formValues["LAP"]["listingPerMarketplace"][currentTab]["variants"] = [{}, {}]) :
            (formValues["LAP"]["listingPerMarketplace"][currentTab]["variants"] = []);

        formValues["LAP"]["hasVariant"] = value;
        form.setFieldsValue(formValues);
    }

    // NEXT STEP API
    const onClickAcceptProposal = async () => {
        setLoadingAcceptProposal(true);
        await partnerApi.acceptProposal(session.userInfo.partner_id[0], pricesRetrieved.id, { step, nextStep })
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
        await partnerApi.deleteListing(session.userInfo.partner_id[0], pricesRetrieved.id)
            .then((response) => {
                history.push("/");
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingDelete(false);
    }

    const lapHasVariantChanged = (evt) => {
        handleHasVariant(evt.target.value);
        setShowVariantsTable(evt.target.value);
        setRefresh(Date.now());
    }

    return (
        <PageHeader extra={
            <Affix offsetTop={10}>
                <Space style={{ backgroundColor: 'white' }}>
                    <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                    {canEdit(session, tab, step?.state) &&
                        <>
                            {session.userInfo.isAdmin &&
                                <Popconfirm
                                    title={t('onboarding.confirmDelete')}
                                    onConfirm={onClickCancel}
                                    onCancel={() => { }}
                                    icon={<WarningOutlined />}
                                    okText={t('yes')}
                                    cancelText={t('no')}
                                    okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                >
                                    <Button loading={loadingDelete} className="btn-basic-white" type="link" icon={<CloseOutlined />} disabled={!canEdit(session, tab, step?.state)}>{t('onboarding.alertButtonClose')}</Button>
                                </Popconfirm>
                            }
                            <Button className="btn-basic-white" loading={loadingSaveDraft} ghost icon={<DownloadOutlined />} disabled={!canEdit(session, tab, step?.state)} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                            <Button className="btn-basic-green" loading={loadingSend} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEdit(session, tab, step?.state)}>{t('onboarding.alertButtonSend')}</Button>
                        </>
                    }
                </Space>
            </Affix>
        } title={<span className="title-primary">{t('onboarding.price.title')}</span>}>
            <Spin spinning={loading || loadingSaveDraft || loadingSend || loadingAcceptProposal || loadingPendingListing || loadingDelete || !pricesRetrieved} size="large" >
                <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} onFinish={onFinish} validateMessages={validateMessages} className="text-align-left">
                    <Text ellipsis={{ tooltip: t('onboarding.price.titleDescription') }}>{t('onboarding.price.titleDescription')}</Text>
                    <Tabs defaultActiveKey={tab} onChange={handleChangeTabs}>
                        <TabPane tab={session.userInfo.role !== 'Admin' ? session.userInfo.name : t('onboarding.tab1')} key="Client">
                            {!acceptedProposal && !session.userInfo.isAdmin && step?.state === listingStates.PENDING_ACKNOWLEDGE && <ProposalAlert onClickAccept={onClickAcceptProposal} onClickReject={onClickRejectProposal} />}
                            {acceptedProposal && <AcceptedProposalAlert nextStep={() => setSelected(selected + 1)} />}
                            {!session.userInfo.isAdmin && step?.state === listingStates.PENDING_LAP ? (
                                <Pending />) :
                                pricesRetrieved && pricesRetrieved.Client && <>
                                    <Row style={{ marginTop: 20, marginBottom: 20 }}>
                                        <Col xs={24} sm={24} md={24}>
                                            <Item label={t('onboarding.order.step1Input2')} className="input-form-margin-bottom" name={['Client', 'selectedMarketplaces']}
                                                rules={[{ required: true }]}
                                                tooltip={{
                                                    title: t('onboarding.order.step1Input2Description'),
                                                    icon: <InfoCircleOutlined />,
                                                }}>
                                                <Select
                                                    mode="multiple" disabled={!canEdit(session, tab, step?.state)}
                                                    style={{ width: '100%' }}
                                                    placeholder="Seleccione los marketplaces correspondientes"
                                                    optionLabelProp="label"
                                                    onChange={(values) => { handleChangeCheckbox('Client', values) }}
                                                >
                                                    {marketplaces.map((marketplace) => (
                                                        <Option value={marketplace.name} label={`${marketplace.name}`} disabled={!marketplace.permissions}>
                                                            <Tooltip title={!marketplace.permissions ? "Debe activar una cuenta para poder utilizar el marketplace." : ""}>
                                                                <img style={{ opacity: !marketplace.permissions ? '0.5' : '1' }} src={`data:image/svg+xml;utf8,${encodeURIComponent(parse(marketplace.svg))}`} />
                                                                <Text type={!marketplace.permissions ? "secondary" : "primary"} > ({marketplace.countryCode})</Text >
                                                            </Tooltip>
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={24} sm={24} md={24}>
                                            <Item label={t('onboarding.order.step1Input3')} className="input-form-margin-bottom" name={['Client', 'hasVariant']}
                                                rules={[{ required: true }]}
                                                tooltip={{
                                                    title: t('onboarding.order.step1Input3Description'),
                                                    icon: <InfoCircleOutlined />,
                                                }}>
                                                <Radio.Group className="card-radio-group">
                                                    <Card className="card-radio-inline">
                                                        <div className="card-content-div">
                                                            <Radio value={false} disabled={!canEdit(session, tab, step?.state)}>
                                                                <Text >Es un producto único</Text>
                                                            </Radio>
                                                        </div>
                                                        <Text type="secondary" >Selecciona si el producto que quieres vender tiene sólo una variedad. Por ejemplo: Miel Multiflora (1 variedad) o un Serum antiox 15ml (1 variedad).</Text>
                                                    </Card>
                                                    <Card className="card-radio-inline">
                                                        <div className="card-content-div">
                                                            <Radio value={true} disabled={!canEdit(session, tab, step?.state)}>
                                                                <Text className="text-card-radio">Tiene variantes</Text>
                                                            </Radio>
                                                            <Text type="secondary" >Selecciona si el producto que quieres vender tiene más de una variedad. Por ejemplo: Una línea de mermeladas con 3 sabores o una polera de mujer en 5 tallas.</Text>
                                                        </div>
                                                    </Card>
                                                </Radio.Group>
                                            </Item>
                                        </Col>
                                    </Row>
                                    {pricesRetrieved.Client?.selectedMarketplaces.length > 0 && tab &&
                                        <Card style={{ backgroundColor: '#e7e7e730', borderRadius: '5px' }}>
                                            <Tabs onChange={handleMarketplaceTabChange}>
                                                {pricesRetrieved.Client?.selectedMarketplaces.map(selectedMarketplace => (
                                                    <TabPane tab={selectedMarketplace} key={selectedMarketplace}>
                                                        <PricesByMarketplace
                                                            pricesRetrieved={pricesRetrieved}
                                                            selectedMarketplace={selectedMarketplace} step={step}
                                                            category={category} currentTab={currentTab} tab={tab}
                                                            form={form} session={session} loadingUpdateCategory={loadingUpdateCategory}
                                                            listingId={listingId}
                                                            updateCategoriesByMarketplace={updateCategoriesByMarketplace} />
                                                    </TabPane>
                                                ))}
                                            </Tabs>
                                        </Card>
                                    }
                                </>
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

                            <Row style={{ marginTop: 20, marginBottom: 20 }}>
                                <Col xs={24} sm={24} md={24}>
                                    <Item label={t('onboarding.order.step1Input2')} className="input-form-margin-bottom" name={['LAP', 'selectedMarketplaces']}
                                        rules={[{ required: true }]}
                                        tooltip={{
                                            title: t('onboarding.order.step1Input2Description'),
                                            icon: <InfoCircleOutlined />,
                                        }}>
                                        <Select
                                            mode="multiple" disabled={!canEdit(session, tab, step?.state)}
                                            style={{ width: '100%' }}
                                            placeholder="Seleccione los marketplaces correspondientes"
                                            optionLabelProp="label"
                                            onChange={(values) => { handleChangeCheckbox('LAP', values) }}
                                        >
                                            {marketplaces.map((marketplace) => (
                                                <Option value={marketplace.name} label={`${marketplace.name}`} disabled={!marketplace.permissions}>
                                                    <Tooltip title={!marketplace.permissions ? "Debe activar una cuenta para poder utilizar el marketplace." : ""}>
                                                        <img style={{ opacity: !marketplace.permissions ? '0.5' : '1' }} src={`data:image/svg+xml;utf8,${encodeURIComponent(parse(marketplace.svg))}`} />
                                                        <Text type={!marketplace.permissions ? "secondary" : "primary"} > ({marketplace.countryCode})</Text >
                                                    </Tooltip>
                                                </Option>
                                            ))}
                                        </Select>
                                    </Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={24} sm={24} md={24}>
                                    <Item label={t('onboarding.order.step1Input3')} className="input-form-margin-bottom" name={["LAP", "hasVariant"]}
                                        rules={[{ required: true }]}
                                        tooltip={{
                                            title: t('onboarding.order.step1Input3Description'),
                                            icon: <InfoCircleOutlined />,
                                        }}>
                                        <Radio.Group className="card-radio-group" onChange={(e) => lapHasVariantChanged(e)}>
                                            <Card className="card-radio-inline">
                                                <div className="card-content-div">
                                                    <Radio value={false} disabled={!canEdit(session, tab, step?.state)}>
                                                        <Text >Es un producto único</Text>
                                                    </Radio>
                                                </div>
                                                <Text type="secondary" >Selecciona si el producto que quieres vender tiene sólo una variedad. Por ejemplo: Miel Multiflora (1 variedad) o un Serum antiox 15ml (1 variedad).</Text>
                                            </Card>
                                            <Card className="card-radio-inline">
                                                <div className="card-content-div">
                                                    <Radio value={true} disabled={!canEdit(session, tab, step?.state)}>
                                                        <Text className="text-card-radio">Tiene variantes</Text>
                                                    </Radio>
                                                    <Text type="secondary" >Selecciona si el producto que quieres vender tiene más de una variedad. Por ejemplo: Una línea de mermeladas con 3 sabores o una polera de mujer en 5 tallas.</Text>
                                                </div>
                                            </Card>
                                        </Radio.Group>
                                    </Item>
                                </Col>
                            </Row>
                            {pricesRetrieved?.LAP?.selectedMarketplaces.length > 0 &&
                                <Card style={{ margin: '20px', backgroundColor: '#e7e7e730', borderRadius: '5px' }}>
                                    <Tabs onChange={handleMarketplaceTabChange}>
                                        {pricesRetrieved?.LAP?.selectedMarketplaces.map(selectedMarketplace => (
                                            <TabPane tab={selectedMarketplace} key={selectedMarketplace} >
                                                <PricesByMarketplace
                                                    selectedMarketplace={selectedMarketplace} step={step}
                                                    category={category} currentTab={currentTab} tab={tab}
                                                    pricesRetrieved={pricesRetrieved}
                                                    form={form} session={session} loadingUpdateCategory={loadingUpdateCategory}
                                                    listingId={listingId}
                                                    updateCategoriesByMarketplace={updateCategoriesByMarketplace} />
                                                <Divider />
                                                <Row>
                                                    <Col span={24}><Title level={5} className="title-primary">Principal</Title></Col>
                                                    <Col span={24}><Text >{t('onboarding.price.suggestedPrice')}</Text></Col>
                                                </Row>
                                                <Row justify="start">
                                                    <Col span={14}>
                                                        <Item hidden label={t('onboarding.price.product')} name={["LAP", "listingPerMarketplace", selectedMarketplace, "product", "id"]}>
                                                            <Input type="hidden" className="price-input-number" disabled={!canEdit(session, tab, step.state)} />
                                                        </Item>

                                                        <Item label={t('onboarding.price.product')} name={["LAP", "listingPerMarketplace", selectedMarketplace, "product", "defaultCode"]} rules={[{ required: true }]}>
                                                            <Input className="price-input-number" disabled={!canEdit(session, tab, step.state)} />
                                                        </Item>
                                                    </Col>
                                                    <Col span={1}></Col>
                                                    <Col span={9}>
                                                        {!showVariantsTable &&
                                                            <Row>
                                                                <Col span={10}>
                                                                    <Text><span style={{ color: 'red' }}>*</span> {t('onboarding.price.price')}:</Text>
                                                                </Col>
                                                                <Col span={14}>
                                                                    <Item className="input-form-margin-bottom" name={["LAP", "listingPerMarketplace", selectedMarketplace, "product", "price"]} rules={[{ required: true }]}>
                                                                        <InputNumber formatter={value => `${currency} ${value}`} parser={value => parseFloat(value.replace(`${currency}`, ''))} className="price-input-number" maxLength={10} min={0} pattern="^[0-9]+" disabled={!canEdit(session, tab, step.state)} />
                                                                    </Item>
                                                                </Col>
                                                            </Row>
                                                        }
                                                    </Col>
                                                </Row>
                                                {showVariantsTable && <Row style={{ marginTop: 24 }}>
                                                    <Col span={24}>
                                                        <Row justify="space-between">
                                                            <Col>
                                                                <Title level={5} className="title-primary">Variaciones</Title>
                                                            </Col>
                                                            <Col>
                                                                <Button type="dashed" icon={<PlusOutlined />} className="price-table-buttons price-table-add-button" onClick={() => { handleAdd(selectedMarketplace) }} disabled={!canEdit(session, tab, step?.state)} />
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col span={24}>
                                                                <ConfigProvider renderEmpty={() => { return null }}>
                                                                    <List
                                                                        dataSource={pricesRetrieved?.LAP?.listingPerMarketplace[selectedMarketplace]?.variants || []}
                                                                        renderItem={(item, idx) => (
                                                                            <List.Item>
                                                                                <Row style={{ width: '100%', marginBottom: 15 }}>
                                                                                    <Col span={12}>
                                                                                        <Item hidden label={t('onboarding.price.product')} name={["LAP", "listingPerMarketplace", selectedMarketplace, "variants", idx, "id"]} >
                                                                                            <Input type="hidden" className="price-input-number" disabled={!canEdit(session, tab, step.state)} />
                                                                                        </Item>

                                                                                        <Item label={t('onboarding.price.product')} name={["LAP", "listingPerMarketplace", selectedMarketplace, "variants", idx, "defaultCode"]} rules={[{ required: true }]}>
                                                                                            <Input className="price-input-number" disabled={!canEdit(session, tab, step.state)} />
                                                                                        </Item>
                                                                                    </Col>
                                                                                    <Col span={1}></Col>
                                                                                    <Col span={7}>
                                                                                        <Row>
                                                                                            <Col span={11}>
                                                                                                <Text><span style={{ color: 'red' }}>*</span> {t('onboarding.price.price')}:</Text>
                                                                                            </Col>
                                                                                            <Col span={13}>
                                                                                                <Item className="input-form-margin-bottom" name={["LAP", "listingPerMarketplace", selectedMarketplace, "variants", idx, "price"]} rules={[{ required: true }]}>
                                                                                                    <InputNumber formatter={value => `${currency} ${value}`} parser={value => parseFloat(value.replace(`${currency}`, ''))} className="price-input-number" maxLength={10} min={0} pattern="^[0-9]+" disabled={!canEdit(session, tab, step.state)} />
                                                                                                </Item>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                    <Col span={2}>
                                                                                        {canEdit(session, tab, step.state) && <Button type="primary" onClick={() => { handleDelete(selectedMarketplace, idx) }} icon={<CloseOutlined></CloseOutlined>}></Button>}
                                                                                    </Col>
                                                                                </Row>
                                                                            </List.Item>
                                                                        )}
                                                                    />
                                                                </ConfigProvider>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                                }
                                                {session.userInfo.isAdmin && tab === 'LAP' && (
                                                    <>
                                                        <Divider />
                                                        <Row>
                                                            <Col xs={24} sm={24} md={24}>
                                                                <Item hidden name={"step", "id"} rules={[{ required: false }]}></Item>
                                                                <Item label={t('onboarding.measuresAndPrices.LAPComment')} name={"step", "lapComment"} rules={[{ required: false }, { max: maxLength2000 }]}
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
                                            </TabPane>
                                        ))}
                                    </Tabs>
                                </Card>
                            }


                        </TabPane>
                    </Tabs>
                </Form>
                <ModalRejectProposal updateStep={updateStep} step={step} remakeModalVisible={remakeModalVisible} setRemakeModalVisible={setRemakeModalVisible} partnerId={session.userInfo.partner_id[0]} listingId={pricesRetrieved?.id} formItemLayout={formItemLayout} setMyOrder={setPricesRetrieved} />
            </Spin>
            <Row justify="end" style={{ marginTop: 24 }}>
                <Col>
                    <Affix offsetBottom={10}>
                        <Space style={{ backgroundColor: 'white' }}>
                            <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                            {canEdit(session, tab, step?.state) &&
                                <>
                                    <Popconfirm
                                        title={t('onboarding.confirmDelete')}
                                        onConfirm={onClickCancel}
                                        onCancel={() => { }}
                                        icon={<WarningOutlined />}
                                        okText={t('yes')}
                                        cancelText={t('no')}
                                        okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                    >
                                        <Button loading={loadingDelete} className="btn-basic-white" type="link" icon={<CloseOutlined />} disabled={!canEdit(session, tab, step?.state)}>{t('onboarding.alertButtonClose')}</Button>
                                    </Popconfirm>
                                    <Button className="btn-basic-white" loading={loadingSaveDraft} ghost icon={<DownloadOutlined />} disabled={!canEdit(session, tab, step?.state)} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                                    <Button className="btn-basic-green" loading={loadingSend} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEdit(session, tab, step?.state)}>{t('onboarding.alertButtonSend')}</Button>
                                </>
                            }

                        </Space>

                    </Affix>

                </Col>
            </Row>

        </PageHeader >
    );
}

export default React.memo(Prices);