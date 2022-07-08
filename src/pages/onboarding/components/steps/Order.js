import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Spin, Tabs, Modal, Popconfirm, PageHeader, Space, Affix } from 'antd';
import { sellerMarketplaces, validateMessages } from '../../../../utils/const';
import { DownloadOutlined, SendOutlined, WarningOutlined, LeftOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { canEdit } from '../../../../utils/functions';
import partnerApi from '../../../../api/partner';
import categoryApi from '../../../../api/aws-category';
import { openNotification } from '../../../../components/Toastr';
import { getErrorMessage } from '../../../../api/api';
import { listingStates, formItemLayout } from '../../../../utils/const.js';
import ModalRejectProposal from './ModalRejectProposal';
import { AttributesForm } from '../AttributesForm';
import { ModalViewComparison } from '../ModalViewComparison';
import OrderTab from './ordersByMarketplace/OrderTab';
import SupportRequests from './SupportRequests';
import '../../onboarding.css';

const { TabPane } = Tabs;

export const Order = ({ supportRequests, setSupportRequests, prevStep, listingId, updateStep, step, nextStep, setSelected, selected }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm();
    const session = useSelector(store => store.Session.session);

    const [tab, setTabs] = useState(session?.userInfo?.role == 'Admin' ? 'LAP' : 'Client');
    const [loading, setLoading] = useState(true);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingSaveDraft, setLoadingSaveDraft] = useState(false);
    const [productTypeByMkts, setProductTypeByMkts] = useState();
    const [loadingDelete, setLoadingDelete] = useState(false);

    const [modalEditVariantVisible, setModalEditVariantVisible] = useState(false);
    const [modalEditViewComparison, setModalEditViewComparison] = useState(false);
    const [orderRetrieved, setOrderRetrieved] = useState();
    const [currentTab, setCurrentTab] = useState();
    const [currentVariant, setCurrentVariant] = useState();
    const [acceptedProposal, setAcceptedProposal] = useState(false);
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [propertiesInfo, setPropertiesInfo] = useState();
    const [canEditItem, setCanEditItem] = useState(null);
    const [justSent, setJustSent] = useState(false);
    const [firstMkt, setFirstMkt] = useState(null);


    useEffect(() => {
        getOrder();
    }, []);

    useEffect(() => {
        if (currentTab && productTypeByMkts && productTypeByMkts[currentTab]) {
            setPropertiesInfo(productTypeByMkts[currentTab]?.attributes);
        }
    }, [currentTab, productTypeByMkts])

    useEffect(() => {
        (session && tab && step?.state) ?
            setCanEditItem(canEdit(session, tab, step.state)) : setCanEditItem(false);
    }, [session, tab, step?.state])


    const getAttributesByProductType = async (clientId, mkt, prodType) => {
        let values = {};
        await categoryApi.getAttributesByMarketplace(clientId, mkt, prodType)
            .then((response) => {
                let attributesRetrieved = response.data;
                values = orderAttributes(attributesRetrieved);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        return values;
    }

    const orderAttributes = (attributesRetrieved, mkt) => {
        let attributesRequired = [];
        let attributesNotRequired = [];
        let orderedAttributes = [];
        attributesRetrieved?.properties?.forEach(property => {
            attributesRetrieved?.required?.includes(property?.name) ?
                attributesRequired.push(property) :
                attributesNotRequired.push(property);
        })
        orderedAttributes.push(...attributesNotRequired);
        orderedAttributes.unshift(...attributesRequired);
        return { ...attributesRetrieved, properties: orderedAttributes };
    }

    useEffect(() => {
        if (step && step.state === listingStates.COMPLETED)
            setAcceptedProposal(true);
    }, [step]);

    const toggleModalEditVariant = (tab, currentTab, index) => {
        const formData = form.getFieldValue();
        if (tab && currentTab && formData[tab]?.listingPerMarketplace[currentTab]?.variants[index]) {
            setCurrentVariant(formData[tab].listingPerMarketplace[currentTab].variants[index]);
        } else {
            setCurrentVariant(null);
        }
        setModalEditVariantVisible(!modalEditVariantVisible);
    }

    const toggleModalViewComparison = (tab, currentTab, index, isVariant) => {
        const formData = form.getFieldValue();
        if (tab && currentTab) {
            if ((isVariant && formData[tab]?.listingPerMarketplace[currentTab]?.variants[index])) {
                setCurrentVariant(formData[tab].listingPerMarketplace[currentTab].variants[index]);
            } else {
                setCurrentVariant(null);
            }
        } else {
            setCurrentVariant(null);
        }
        setModalEditViewComparison(!modalEditViewComparison);
    }

    const getOrder = async () => {
        await partnerApi.getOrder(session.userInfo.partner_id[0], listingId)
            .then(async (res) => {
                const listing = res.data;
                if (listing?.Client?.listingPerMarketplace && Object.keys(listing?.Client?.listingPerMarketplace).length === 0) {
                    listing.Client.listingPerMarketplace = {
                        "Amazon": { marketplace: sellerMarketplaces.AMAZON },
                        "Amazon Mexico": { marketplace: sellerMarketplaces.AMAZON_MX },
                        "Amazon Canada": { marketplace: sellerMarketplaces.AMAZON_CA },
                        "Amazon Brazil": { marketplace: sellerMarketplaces.AMAZON_BR },
                        "Walmart": { marketplace: sellerMarketplaces.WALMART },
                        "Ebay": { marketplace: sellerMarketplaces.EBAY },
                        "Ebay Canada": { marketplace: sellerMarketplaces.EBAY_CA },
                        "Ebay Spain": { marketplace: sellerMarketplaces.EBAY_ES },
                        "Ebay Germany": { marketplace: sellerMarketplaces.EBAY_DE },
                        "Shopify": { marketplace: sellerMarketplaces.SHOPIFY }
                    }
                }

                if ((listing?.LAP?.listingPerMarketplace && Object.keys(listing?.LAP?.listingPerMarketplace).length === 0) || !listing?.LAP?.listingPerMarketplace) {
                    if (!listing.LAP) {
                        listing.LAP = {};
                    }
                    listing.LAP.listingPerMarketplace = {
                        "Amazon": { marketplace: sellerMarketplaces.AMAZON },
                        "Amazon Mexico": { marketplace: sellerMarketplaces.AMAZON_MX },
                        "Amazon Canada": { marketplace: sellerMarketplaces.AMAZON_MX },
                        "Amazon Brazil": { marketplace: sellerMarketplaces.AMAZON_MX },
                        "Walmart": { marketplace: sellerMarketplaces.WALMART },
                        "Ebay": { marketplace: sellerMarketplaces.EBAY },
                        "Ebay Canada": { marketplace: sellerMarketplaces.EBAY_CA },
                        "Ebay Spain": { marketplace: sellerMarketplaces.EBAY_ES },
                        "Ebay Germany": { marketplace: sellerMarketplaces.EBAY_DE },
                        "Shopify": { marketplace: sellerMarketplaces.SHOPIFY }
                    }
                }
                // setFirstMkt(Object.entries(listing.Client.listingPerMarketplace)[0]);
                listing.Client.selectedMarketplaces = Object.keys(listing.Client.listingPerMarketplace);
                listing.LAP.selectedMarketplaces = Object.keys(listing.LAP.listingPerMarketplace);
                let mainMarketplace = listing.Client.selectedMarketplaces[0];
                setFirstMkt(mainMarketplace);

                if (!listing[tab].listingPerMarketplace[mainMarketplace].productType) {
                    setLoading(false);
                }
                setCurrentTab(mainMarketplace);
                setOrderRetrieved(listing);
                setLoading(true);
                await searchFormByProdTypeAndMkt(listing);
            })
            .then((result) => { setLoading(false) })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    }

    const searchFormByProdTypeAndMkt = async (listing) => {
        let productTypesPromises = listing[tab].selectedMarketplaces?.map(async (mkt) => ({
            [mkt]: {
                productType: listing[tab].listingPerMarketplace[mkt].productType,
                attributes: await getAttributesByProductType(listing.clientId, mkt, listing[tab].listingPerMarketplace[mkt].productType)
            }
        }));
        const promisesResponse = await Promise.all(productTypesPromises);
        let productTypesData = {};
        promisesResponse?.map(prodTypeByMkt => productTypesData[Object.keys(prodTypeByMkt)] = prodTypeByMkt[Object.keys(prodTypeByMkt)]);
        setProductTypeByMkts(productTypesData);
    }

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
    }

    const setAttbAsArray = (productAttb) => {
        return Array.isArray(productAttb) ? productAttb : [productAttb];
    }

    const onSaveDraft = async () => {
        let formData = form.getFieldValue();
        let mkts = Object.keys(orderRetrieved[tab].listingPerMarketplace);
        for (const mkt of mkts) {
            if (formData[tab].listingPerMarketplace[mkt]) {
                formData[tab].listingPerMarketplace[mkt].variants = orderRetrieved[tab].listingPerMarketplace[mkt].variants;
            }
            if (mkt.includes(sellerMarketplaces.AMAZON)) {
                let productAttb = formData[tab].listingPerMarketplace[mkt].product.attributes;
                formData[tab].listingPerMarketplace[mkt].product.attributes = setAttbAsArray(productAttb);
                formData[tab].listingPerMarketplace[mkt].variants = formData[tab].listingPerMarketplace[mkt].variants?.map(variant => ({
                    ...variant, attributes: setAttbAsArray(variant.attributes)
                }))
            }
        }
        setLoadingSaveDraft(true);
        await partnerApi.updateOrder(session.userInfo.partner_id[0], orderRetrieved.id, formData)
            .then((response) => {
                openNotification({ status: true, content: t('onboarding.draftSavedSuccessfully') });
                setLoadingSaveDraft(false);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
                setLoadingSaveDraft(false);
            });
    }

    const onFinish = async () => {
        let formData = form.getFieldValue();
        let mkts = Object.keys(orderRetrieved[tab].listingPerMarketplace);
        const flag = isAValidForm(formData);
        if (!flag) { return; }
        for (const mkt of mkts) {
            if (formData[tab].listingPerMarketplace[mkt]) {
                formData[tab].listingPerMarketplace[mkt].variants = orderRetrieved[tab].listingPerMarketplace[mkt].variants;
            }
            if (mkt.includes(sellerMarketplaces.AMAZON)) {
                let productAttb = formData[tab].listingPerMarketplace[mkt].product.attributes;
                formData[tab].listingPerMarketplace[mkt].product.attributes = setAttbAsArray(productAttb);
                formData[tab].listingPerMarketplace[mkt].variants = formData[tab].listingPerMarketplace[mkt].variants?.map(variant => ({
                    ...variant, attributes: setAttbAsArray(variant.attributes)
                }))
            }
        }
        orderRetrieved.lapComment = formData.lapComment;
        setLoadingSend(true);
        await partnerApi.sendOrder(session.userInfo.partner_id[0], orderRetrieved.id, formData)
            .then((response) => {
                openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                setJustSent(true);
                updateStep([{
                    ...step,
                    state: session.userInfo.isAdmin ? listingStates.PENDING_ACKNOWLEDGE : listingStates.PENDING_LAP
                }]);
                setLoadingSend(false);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
                setLoadingSend(false);
            });
    }

    const isAValidForm = (formData) => {
        let flag = true;
        for (const mkt of formData[tab]?.selectedMarketplaces) {
            if (formData[tab] && formData[tab]?.listingPerMarketplace[mkt] && flag) {
                if (session.userInfo.isAdmin) {
                    flag = validateRequiredAttributesByProduct(formData[tab]?.listingPerMarketplace[mkt]?.product, mkt);
                } else {
                    if (formData[tab]?.listingPerMarketplace[mkt]?.variants?.length == 0) {
                        flag = validateRequiredAttributesByProduct(formData[tab]?.listingPerMarketplace[mkt]?.product, mkt);
                    }
                }
                if (formData[tab]?.listingPerMarketplace[mkt]?.variants?.length > 0 && flag) {
                    let newAttributesRequired = [];
                    for (const variant of formData[tab].listingPerMarketplace[mkt]?.variants) {
                        let variantAttb = Array.isArray(variant?.attributes) ? { ...variant?.attributes[0] } : variant?.attributes;
                        variantAttb = filterEmptyAttributes(variantAttb);

                        if (variant.attributes && (newAttributesRequired.length < JSON.stringify(Object.keys(variantAttb).length))) {
                            newAttributesRequired = Object.keys(variantAttb);
                        }

                        if (flag) {
                            flag = validateRequiredAttributesByProduct(variant, mkt);
                        }
                    }
                    if (flag) {
                        flag = validateVariantAttributesKeys(formData[tab]?.listingPerMarketplace[mkt]?.variants, newAttributesRequired, mkt);
                    }
                }
            }
        }
        return flag;
    }

    const filterEmptyAttributes = (attributes) => {
        for (const key of Object.keys(attributes)) {
            if (!attributes[key] || !attributes[key]?.value) {
                if (!validateAttributeByType(attributes[key])) {
                    delete attributes[key];
                }
            }
        }
        return attributes
    }

    const validateAttributeByType = (attributeValue) => {
        let flag = true;
        if (Array.isArray(attributeValue) && attributeValue?.length == 0) {
            flag = false;
        } else if (typeof attributeValue === 'object' && Object.values(attributeValue).filter(value => [null, undefined, ''].includes(value)).length > 0) {
            flag = false;
        } else if (typeof attributeValue === 'string' && [null, undefined, ''].includes(attributeValue)) {
            flag = false;
        } else if (!attributeValue) {
            flag = false;
        }
        return flag;
    }

    const validateRequiredAttributesByProduct = (product, mkt) => {
        for (var requiredAttribute of productTypeByMkts[mkt]?.attributes?.required) {
            const productAttb = Array.isArray(product?.attributes) ? { ...product?.attributes[0] } : product?.attributes;
            let flag = validateAttributeByType(productAttb[requiredAttribute]);
            if (!flag) {
                openNotification({ status: false, content: `Debe completar el atributo ${requiredAttribute} requerido para el SKU ${product?.defaultCode} en el marketplace ${mkt}`, duration: 10 });
                return false;
            }
        }
        return true;
    }

    const validateVariantAttributesKeys = (variants, variantAttributesKeys, mkt) => {
        for (const variant of variants) {
            const productAttributes = Array.isArray(variant?.attributes) ? { ...variant?.attributes[0] } : variant?.attributes;
            for (const attribute of variantAttributesKeys) {
                if (productTypeByMkts[mkt]?.attributes?.required.includes(attribute)) {
                    continue;
                }
                let flag = validateAttributeByType(productAttributes[attribute]);
                if (!flag) {
                    openNotification({ status: false, content: `Debe completar el atributo diferenciador ${attribute} para el SKU ${variant?.defaultCode} en el marketplace ${mkt}`, duration: 10 });
                    return false;
                }
            }
        }
        return true;
    }

    const validateRequiredAttributesByChild = (attributes, sku) => {
        for (var requiredAttribute of propertiesInfo?.required) {
            if ([null, undefined, ''].includes(attributes[requiredAttribute]?.value)) {
                openNotification({ status: false, content: `Debe completar todos los atributos requeridos para el producto con SKU ${sku}` });
                return false;
            }
        }
        return true;
    }

    const completeAttributesByOrder = (item, mustValidateInputs, isChecked) => {
        let attributesData = null;
        item.attributes?.length ? (attributesData = item.attributes[0]) : (attributesData = item.attributes);
        let flag = true;
        if (mustValidateInputs) {
            flag = validateRequiredAttributesByChild(attributesData, item.defaultCode);
        }

        if (!flag) {
            return false;
        }

        if (attributesData['item_name']?.value) {
            item.title = attributesData['item_name'].value;
        }

        if (attributesData['list_price']?.value) {
            item.price = attributesData['list_price'].value;
        }

        /* remove empty attributes and format */
        let attributesDataFormat = { ...attributesData };
        for (const attribute in attributesDataFormat) {
            let attributeAsString = JSON.stringify(attributesDataFormat[attribute]);
            if (!attributeAsString && (attributeAsString === '{}' || attributeAsString?.includes(':""'))) {
                delete attributesDataFormat[attribute];
            }
            else {
                isChecked ?
                    attributesDataFormat[attribute] = attributesDataFormat[attribute] :
                    attributesDataFormat[attribute] = [attributesDataFormat[attribute]] // convert the object to array 
            }
        }

        item['attributes'] = [attributesDataFormat];
        return item;
    }

    const completeListingData = (listing, mustValidateInputs, isChecked) => {
        let newDataByItem = completeAttributesByOrder(listing.product, mustValidateInputs, isChecked);

        if (!newDataByItem) {
            return false;
        }

        let newDataByVariants = [];
        for (const variant of listing?.variants) {
            let newDataByChild = completeAttributesByOrder(variant, mustValidateInputs, isChecked)
            if (!newDataByChild) {
                return false;
            }

            newDataByVariants.push(newDataByChild);
        }

        return {
            ...listing,
            product: newDataByItem,
            variants: newDataByVariants
        }
    }

    const onClickAcceptProposal = async () => {
        setLoading(true);
        await partnerApi.acceptProposal(session.userInfo.partner_id[0], orderRetrieved.id, { step, nextStep })
            .then((response) => {
                updateStep([{ ...step, state: listingStates.COMPLETED }, { ...nextStep, state: listingStates.PENDING_CLIENT }]);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoading(false);
        setAcceptedProposal(true);
    };

    const handleUpdateFormAttributes = (values) => {
        setProductTypeByMkts({ ...productTypeByMkts, currentTab: values });
    }

    const onClickRejectProposal = () => {
        setRemakeModalVisible(true);
    };

    const handleChangeTabs = (key) => {
        setCurrentTab(firstMkt);
        setTabs(key);
    };

    return (
        <PageHeader extra={

            <Affix offsetTop={10}>
                <Space style={{ backgroundColor: 'white' }}>
                    <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                    {canEditItem && <>
                        <Popconfirm
                            title={t('onboarding.confirmGoBack')}
                            onConfirm={onClickCancel}
                            onCancel={() => { }}
                            icon={<WarningOutlined />}
                            okText={t('yes')}
                            cancelText={t('no')}
                            okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                        >
                            <Button loading={loadingDelete} className="btn-basic-white" type="link" icon={<LeftOutlined />}>{t('onboarding.alertButtonGoBack')}  </Button>
                        </Popconfirm>
                        <Button className="btn-basic-white" loading={loadingSaveDraft} ghost icon={<DownloadOutlined />} disabled={!canEditItem} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                        <Button className="btn-basic-green" loading={loadingSend} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEditItem}>{t('onboarding.alertButtonSend')}</Button>
                    </>
                    }
                </Space>
            </Affix>
        } subTitle={t('onboarding.order.titleDescription')} title={<span className="title-primary">{t('onboarding.order.title')}</span>}>
            <Spin spinning={loading || loadingSend || loadingSaveDraft || !orderRetrieved} size="large" >
                <Form name="formulario" form={form} layout="vertical" onFinish={onFinish}
                    validateMessages={validateMessages} className="text-align-left">
                    <Tabs defaultActiveKey={tab} onChange={handleChangeTabs}>
                        <TabPane tab={session.userInfo.role !== 'Admin' ? session.userInfo.name : t('onboarding.tab1')} key="Client">
                            <OrderTab toggleModalEditVariant={toggleModalEditVariant}
                                form={form} firstMkt={firstMkt}
                                onFinish={onFinish}
                                toggleModalViewComparison={toggleModalViewComparison}
                                listingId={listingId}
                                onClickRejectProposal={onClickRejectProposal}
                                canEditItem={canEditItem}
                                propertiesInfo={propertiesInfo} handleUpdateFormAttributes={handleUpdateFormAttributes}
                                onClickAcceptProposal={onClickAcceptProposal}
                                orderRetrieved={orderRetrieved}
                                acceptedProposal={acceptedProposal}
                                step={step}
                                tab={tab} justSent={justSent}
                                getOrder={getOrder}
                                setSelected={setSelected}
                                selected={selected}
                                setCurrentTab={setCurrentTab}
                                currentTab={currentTab}
                                modalEditVariantVisible={modalEditVariantVisible}
                            >
                            </OrderTab>
                        </TabPane>
                        <TabPane tab={t('onboarding.tab2')} key="LAP" >
                            <OrderTab toggleModalEditVariant={toggleModalEditVariant}
                                listingId={listingId}
                                tab={tab} justSent={justSent}
                                form={form} firstMkt={firstMkt}
                                onFinish={onFinish}
                                toggleModalViewComparison={toggleModalViewComparison}
                                onClickRejectProposal={onClickRejectProposal}
                                canEditItem={canEditItem}
                                propertiesInfo={propertiesInfo} handleUpdateFormAttributes={handleUpdateFormAttributes}
                                onClickAcceptProposal={onClickAcceptProposal}
                                orderRetrieved={orderRetrieved}
                                acceptedProposal={acceptedProposal}
                                step={step}
                                getOrder={getOrder}
                                setSelected={setSelected}
                                selected={selected}
                                setCurrentTab={setCurrentTab}
                                currentTab={currentTab}
                                modalEditVariantVisible={modalEditVariantVisible}>
                            </OrderTab>
                        </TabPane>
                    </Tabs>
                </Form>
                <ModalRejectProposal updateStep={updateStep} step={step} remakeModalVisible={remakeModalVisible} setRemakeModalVisible={setRemakeModalVisible} partnerId={session.userInfo.partner_id[0]} listingId={orderRetrieved?.id} formItemLayout={formItemLayout} setMyOrder={setOrderRetrieved} />
            </Spin>
            <Modal
                title={`${t('modalAddProductVariant.alertMessage')} #${currentVariant?.id} - SKU: ${currentVariant?.defaultCode}`}
                style={{ top: 20 }}
                width={'90%'}
                visible={modalEditVariantVisible}
                onCancel={() => toggleModalEditVariant()}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <AttributesForm getOrder={getOrder} canEditItem={canEditItem} currentItem={currentVariant}
                    propertiesInfo={propertiesInfo ? propertiesInfo : []} handleUpdateFormAttributes={handleUpdateFormAttributes}
                    toggleModalEditVariant={toggleModalEditVariant} tab={tab} currentTab={currentTab}
                    orderRetrieved={orderRetrieved} setOrderRetrieved={setOrderRetrieved} firstMkt={firstMkt}
                    disabled={!canEditItem} isMain={false} orderForm={form} modalEditVariantVisible={modalEditVariantVisible} />
            </Modal>
            <Modal
                title={`${t('modalAddProductVariant.alertMessage')} #${currentVariant?.id} - SKU: ${currentVariant?.defaultCode}`}
                style={{ top: 20 }}
                width={800}
                visible={modalEditViewComparison}
                onCancel={() => toggleModalViewComparison()}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <ModalViewComparison currentItem={currentVariant ? currentVariant : orderRetrieved && orderRetrieved[tab]?.listingPerMarketplace[currentTab]?.product}
                    toggleModalViewComparison={toggleModalViewComparison} tab={tab} currentTab={currentTab}
                    orderRetrieved={orderRetrieved} isMain={false} />
            </Modal>

            <Row justify="end" style={{ marginTop: 24 }}>
                <Col>
                    <Affix offsetBottom={10}>
                        <Space style={{ backgroundColor: 'white' }}>
                            <SupportRequests listingId={listingId} supportRequests={supportRequests} setSupportRequests={setSupportRequests} />
                            {canEditItem && <>
                                <Popconfirm
                                    title={t('onboarding.confirmGoBack')}
                                    onConfirm={onClickCancel}
                                    onCancel={() => { }}
                                    icon={<WarningOutlined />}
                                    okText={t('yes')}
                                    cancelText={t('no')}
                                    okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                >
                                    <Button loading={loadingDelete} className="btn-basic-white" type="link" icon={<LeftOutlined />}>{t('onboarding.alertButtonGoBack')}  </Button>
                                </Popconfirm>
                                <Button className="btn-basic-white" loading={loadingSaveDraft} ghost icon={<DownloadOutlined />} disabled={!canEditItem} onClick={onSaveDraft}>{t('onboarding.alertButtonSave')}</Button>
                                <Button className="btn-basic-green" loading={loadingSend} icon={<SendOutlined />} onClick={() => { form.submit() }} disabled={!canEditItem}>{t('onboarding.alertButtonSend')}</Button>
                            </>
                            }

                        </Space>
                    </Affix>
                </Col>
            </Row>


        </PageHeader>
    )
}