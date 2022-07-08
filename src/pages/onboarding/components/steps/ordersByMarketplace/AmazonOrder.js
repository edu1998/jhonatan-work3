import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Modal, Select, InputNumber, Tooltip, Typography, Collapse, Space, Divider, Radio } from 'antd';
import { InfoCircleOutlined, EditOutlined } from '@ant-design/icons';
import partnerApi from '../../../../../api/partner';
import { getErrorMessage } from '../../../../../api/api';
import { openNotification } from '../../../../../components/Toastr';
import { marketplaceCurrency, sellerMarketplaces } from '../../../../../utils/const';
import { nameToSlug } from "../../../../../utils/functions";
import { useTranslation } from 'react-i18next';
import { useForm } from 'antd/lib/form/Form';
import { useSelector } from 'react-redux';
import '../../../onboarding.css';

const { Option } = Select;
const { Panel } = Collapse;
const { Text, Title, Link } = Typography;

export default ({ getOrder, defaultCode, listingId, externalId, orderRetrieved, path, tab, propertiesInfo, canEditItem, setIsPack, form, currentTab, justSent, isMain }) => {
    const { t } = useTranslation();
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState();
    const [currentPath, setCurrentPath] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { Item } = Form;
    const session = useSelector(store => store.Session.session);
    const [modalForm] = useForm();

    useEffect(() => {
        if (path) {
            setCurrentPath(path?.length > 0 ? [...path] : []);
        }
    }, [path]);

    useEffect(() => {
        if (tab && currentTab && propertiesInfo && orderRetrieved && Object.entries(orderRetrieved).length > 0 && !justSent) {
            if (!orderRetrieved?.Client?.listingPerMarketplace || !orderRetrieved?.LAP?.listingPerMarketplace) {
                setIsVisible(true);
                return;
            }

            for (const mkt of Object.keys(orderRetrieved[tab]?.listingPerMarketplace)) {
                if (mkt == currentTab && mkt.includes(sellerMarketplaces.AMAZON)) {
                    orderRetrieved[tab] = setDataForListingMarketplace(tab, mkt, orderRetrieved);
                }
            }
            form.setFieldsValue(orderRetrieved);
        }
    }, [])

    useEffect(() => {
        if (currentTab && currentTab.includes(sellerMarketplaces.AMAZON)) {
            const formData = form.getFieldValue();
            handleIsVisible(formData);
        } else {
            handleIsVisible(null);
        }
    }, [currentTab])

    const handleIsVisible = (values) => {
        const formData = values || form.getFieldValue();
        if (session.userInfo.isAdmin || tab === 'LAP') {
            setIsVisible(true);
        } else {
            if ((formData[tab]?.listingPerMarketplace[currentTab]?.variants?.length > 0 && [false, null, undefined, ''].includes(isMain))) {
                setIsVisible(true);
            } else if ((formData[tab]?.listingPerMarketplace[currentTab]?.variants?.length == 0 && isMain)) {
                setIsVisible(true);
            } else if ((formData[tab]?.listingPerMarketplace[currentTab]?.variants?.length > 0 && isMain)) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        }
    }

    const setDataForListingMarketplace = (tab, mkt, orderRetrieved) => {
        let product = orderRetrieved[tab]?.listingPerMarketplace[mkt]?.product;
        let variants = orderRetrieved[tab]?.listingPerMarketplace[mkt]?.variants;
        product.attributes = product.attributes?.length > 0 ? { ...product.attributes[0] } : { ...product.attributes };

        if (product) {
            !product?.attributes?.list_price ? mkt != sellerMarketplaces.AMAZON_MX ? (product.attributes.list_price = { value: product?.price, currency: marketplaceCurrency[mkt] }) :
                (product.attributes.list_price = { value_with_tax: product?.price, currency: marketplaceCurrency[mkt] }) :
                (product.attributes.list_price = product.attributes.list_price);
            product = setDataOnCategoryAttributes(product);
            orderRetrieved[tab].listingPerMarketplace[mkt].product = product;
        }
        if (variants?.length > 0) {
            for (let [idx, variant] of variants?.entries()) {
                variants[idx].attributes = variants[idx].attributes?.length > 0 ? { ...variants[idx].attributes[0] } : { ...variants[idx].attributes };
                !variants[idx]?.attributes?.list_price ? mkt != sellerMarketplaces.AMAZON_MX ? (variants[idx].attributes.list_price = { value: variant?.price, currency: marketplaceCurrency[mkt] }) :
                    (variants[idx].attributes.list_price = { value_with_tax: variant?.price, currency: marketplaceCurrency[mkt] }) :
                    (variants[idx].attributes.list_price = variants[idx].attributes.list_price);
                if (!variants[idx]?.attributes?.length > 0) {
                    variants[idx].attributes = [variants[idx].attributes];
                }
                variants[idx] = setDataOnCategoryAttributes(variants[idx]);
            }
            orderRetrieved[tab].listingPerMarketplace[mkt].variants = variants;
        }
        return orderRetrieved[tab];
    }

    const setDataOnCategoryAttributes = (product) => {
        let currentAttributes = product.attributes;
        for (const property of propertiesInfo?.properties) {
            switch (property?.name) {
                case 'part_number':
                case 'model_number':
                    if (!currentAttributes[property?.name]?.value) {
                        currentAttributes[property?.name] = { value: product.defaultCode };
                    }
                    break;
                case 'model_name':
                case 'item_type_name':
                case 'generic_keyword':
                    if (!currentAttributes[property?.name]?.value && (currentAttributes?.item_name?.value || product?.title)) {
                        currentAttributes[property?.name] = { value: currentAttributes?.item_name?.value || product?.title };
                    }
                    break;
                case 'number_of_items':
                case 'number_of_boxes':
                    if (!currentAttributes[property?.name]?.value) {
                        currentAttributes[property?.name] = { value: 1 };
                    }
                    break;
                case 'manufacturer':
                case 'manufacturer_contact_information':
                    if (!currentAttributes[property?.name]?.value) {
                        currentAttributes[property?.name] = { value: currentAttributes?.brand?.value };
                    }
                    break;
                case 'batteries_required':
                case 'batteries_included':
                case 'contains_liquid_contents':
                    if (!currentAttributes[property?.name]?.value) {
                        currentAttributes[property?.name] = { value: false };
                    }
                    break;
                case 'warranty_description':
                    if (!currentAttributes[property?.name]?.value) {
                        currentAttributes[property?.name] = { value: 'A warranty description' };
                    }
                    break;
                default:
                    break;
            }
        }

        product.attributes = currentAttributes;
        return product;
    }

    const handlePlaceholderByPropertyName = (name, index) => {
        const t_res = index ? `${t(`onboarding.order.formListing.${nameToSlug(name)}${index}`)}` : `${t(`onboarding.order.formListing.${nameToSlug(name)}`)}`;
        return ['i18next::translator: missingKey', null, '', undefined].includes(t_res.trim()) ? null : t_res;
    }

    const inputTypeArray = (property, field, inModal) => {
        return (
            <Form.List name={[...currentPath, property.name]}>
                {(fields, { add }, { errors }) => (
                    <>
                        {field?.fieldInfo?.list?.map((item, index) => (
                            <Item {...item}
                                name={[index, field.name]}
                                rules={[{
                                    required: index === 0,
                                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                                }]}
                            >
                                <Input.TextArea showCount
                                    maxLength={field?.fieldInfo?.maxLength} rows={2}
                                    placeholder={canEditItem ? handlePlaceholderByPropertyName(property.name, index) || field?.fieldInfo?.examples : ''}
                                    disabled={inModal ? false : !canEditItem}
                                />
                            </Item>
                        ))}
                    </>
                )}
            </Form.List>
        )
    }

    const inputTypeText = (property, field, inModal) => {
        return (
            <Item name={[...currentPath, property.name, field.name]} style={{ width: '100%', marginBottom: 0 }}
                rules={[{
                    required: propertiesInfo.required?.includes(property.name),
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Input disabled={inModal ? false : !canEditItem}
                    maxLength={field?.fieldInfo?.maxLength || 100}
                    placeholder={canEditItem ? (handlePlaceholderByPropertyName(property.name, null) || field?.fieldInfo?.examples) : ''}
                    suffix={
                        field?.fieldInfo && <Tooltip title={field.fieldInfo.description}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>
                    }
                    onChange={(event) => {
                        ['item_name', 'name', 'title'].includes(property.name) && event.target.value.toLowerCase().includes('pack') ?
                            setIsPack(true) : setIsPack(false);
                    }}
                />
            </Item>
        )
    }

    const inputTypeTextArea = (property, field, inModal) => {
        return (
            <Item style={{ marginBottom: 15 }} name={[...currentPath, property.name, field.name]}
                rules={[{
                    required: propertiesInfo.required?.includes(property.name),
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Input.TextArea showCount
                    maxLength={field?.fieldInfo?.maxLength} rows={2}
                    placeholder={canEditItem ? (handlePlaceholderByPropertyName(property.name, null) || field?.fieldInfo?.examples) : ''}
                    disabled={inModal ? false : !canEditItem}
                />
            </Item>
        )
    }

    const inputTypeNumber = (property, field, inModal) => {
        return (
            <Row>
                <Col span={24}>
                    <Item style={{ marginBottom: 0 }} name={[...currentPath, property.name, field.name]}
                        rules={[{
                            required: propertiesInfo.required?.includes(property.name),
                            message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                        }]}>
                        <InputNumber style={{ width: '100%' }} min={0}
                            disabled={inModal ? false : !canEditItem}
                        />
                    </Item>
                </Col>
                <Col span={24} style={{ position: 'relative', top: '-25px', left: '96.8%' }}>
                    <Tooltip title={field.fieldInfo.description} style={{ verticalAlign: 'middle' }}>
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                </Col>
            </Row>

        )
    }

    const inputTypeSelection = (property, field, inModal) => {
        return (
            <>
                <Item style={{ width: '100%', marginBottom: 0 }} name={[...currentPath, property.name, field.name]}
                    rules={[{
                        required: propertiesInfo.required?.includes(property.name),
                        message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                    }]}>
                    <Select mode={field.fieldInfo.isMultipleSelection ? 'multiple' : null}
                        allowClear suffixIcon={field?.fieldInfo && <Tooltip title={field.fieldInfo.description}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        } showSearch={true} style={{ width: '100%' }} disabled={inModal ? false : !canEditItem}>
                        {field.fieldInfo.enumNames?.map((option, index) => (
                            <Option value={field.fieldInfo.enum[index]} key={index}>{option}</Option>
                        ))}
                    </Select>
                </Item>
                {property?.name == 'supplier_declared_has_product_identifier_exemption'
                    && session.userInfo.isAdmin
                    && <Space direction="horizontal" size="large">
                        <Link href="https://sellercentral.amazon.com/cu/case-lobby?tab=all_cases&sortFilter=creationDate&sortByAscOrDesc=DESC&size=10&searchText=GTIN%20Exemption%20Request" target="_blank">Check your GTIN exemptions</Link>
                        <Link href="https://sellercentral.amazon.com/cu/case-lobby?ref=xx_caselog_count_home" target="_blank">Create a GTIN exemption</Link>
                    </Space>}
            </>
        )
    }

    const editProperty = (property, index) => {
        setSelectedProperty(property);
        setShowEditModal(true);
    }

    const propertyRow = (property, index, inModal) => {
        return <Row style={{ marginTop: 4, marginBottom: 4 }} key={index}>
            <Col span={5}>
                <Text className="text-capitalize">
                    {propertiesInfo.required?.includes(property.name) && <span style={{ color: 'red' }}>* </span>}
                    {property.name?.replace(/_/g, " ")}
                </Text>
            </Col>
            <Col style={{ paddingRight: 6 }}>
                {!inModal && !canEditItem && externalId && session.userInfo.isAdmin && <Tooltip title={"Editar"}><EditOutlined onClick={() => {
                    editProperty(property, index);
                }} style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>}
            </Col>
            {property?.fields?.map((field, index) => (
                <Col xs={9} sm={9} md={(18 / property.fields.length) % 1 !== 0 ?
                    index % 2 !== 0 ? Math.floor(18 / property.fields.length) :
                        Math.ceil(18 / property.fields.length) : 18 / property.fields.length} key={index}>
                    {['array'].includes(field.fieldInfo.type) &&
                        <>
                            {field?.fieldInfo?.list?.length > 0 ?
                                inputTypeArray(property, field, inModal, index)
                                : inputTypeText(property, field, inModal)}
                        </>
                    }
                    {['string', 'object', null, undefined].includes(field.fieldInfo.type)
                        && inputTypeText(property, field, inModal)
                    }
                    {field.fieldInfo.type === 'selection' &&
                        inputTypeSelection(property, field, inModal)
                    }
                    {field.fieldInfo.type === 'textArea' &&
                        inputTypeTextArea(property, field, inModal)
                    }
                    {(field.fieldInfo.type === 'integer' || field.fieldInfo.type === 'number') &&
                        inputTypeNumber(property, field, inModal)
                    }
                </Col>
            ))}
            {property?.fields?.length === 0 &&
                <Col xs={9} sm={9} md={18}>
                    <Item className="input-form-margin-bottom " name={[...currentPath, property.name, 'value']}
                        rules={[{ required: propertiesInfo.required?.includes(property.name) }]}>
                        <Input style={{ width: '100%' }} disabled={!canEditItem} />
                    </Item>
                </Col>
            }
        </Row>
    }

    const fulfillmentType = (inModal) => {
        return <Row>
            <Col span={8}>
                <Space direction="vertical" size="small">
                    <Title level={5} className="title-primary">{t('onboarding.fulfillment.type')}</Title>
                    <Text type="secondary">{t('onboarding.fulfillment.typeDescription')}</Text>
                </Space>
            </Col>
            <Col span={16}>
                <Item className="input-form-margin-bottom" name={[...path, "fulfillmentType"]}
                    rules={[{ required: true, message: 'Fulfillment es requerido' }]}
                    tooltip={{
                        title: t('onboarding.order.step1Input3Description'),
                        icon: <InfoCircleOutlined />,
                    }}>
                    <Radio.Group className="card-radio-group">
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <>
                                <Radio style={{ marginTop: 12 }} value={'FBA'} disabled={inModal ? false : !canEditItem}>
                                    <Space direction="vertical">
                                        <p className="text-card-radio">{t('onboarding.fulfillment.FBA')}</p>
                                        <Text type="secondary">{t('onboarding.fulfillment.FBADescription')}</Text>
                                    </Space>
                                </Radio>
                                <Divider style={{ margin: 0 }} />
                            </>
                            <>
                                <Radio value={'FBM'} disabled={inModal ? false : !canEditItem}>
                                    <Space direction="vertical">
                                        <p className="text-card-radio">{t('onboarding.fulfillment.FBM')}</p>
                                        <Text type="secondary">{t('onboarding.fulfillment.FBMDescription')}</Text>
                                    </Space>
                                </Radio>
                            </>
                        </Space>
                    </Radio.Group>
                </Item>
            </Col>
        </Row>
    }

    const saveModal = async (values) => {
        let newAttribute = values;
        for (const part of path) {
            newAttribute = newAttribute[part];
        }
        let attributeName = Array.isArray(newAttribute) ? Object.keys(newAttribute[0])[0] : Object.keys(newAttribute)[0];
        let data = { defaultCode: defaultCode, attributeName: attributeName, attributeValue: Array.isArray(newAttribute) ? newAttribute[0][attributeName] : newAttribute[attributeName] }
        setSaving(true);
        await partnerApi.updateProperty(session.userInfo.partner_id[0], listingId, currentTab, data)
            .then((response) => {
                openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                setSaving(false);
                getOrder();
                setShowEditModal(false);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
                setSaving(false);
            });

    }

    return (
        <>
            {isVisible && (
                <>
                    <Collapse style={{ marginBottom: 24, marginRight: 45 }} bordered={false} defaultActiveKey={['1']}>
                        <Panel styles={{ textAlign: 'left' }} header={'Consideraciones'} key={1}>
                            <Row>
                                <Col span={24}>
                                    <Text>Recuerde completar todos los inputs REQUERIDOS marcados con asterisco(*).</Text><br />
                                    <Text>Además, completar los siguientes inputs:  Externally Assigned Product Identifier, Batteries Required, Batteries Included.</Text><br />
                                    <Text>Condition Type</Text><br />
                                    <Text>Externally Assigned Product Identifier</Text><br />
                                    <Text>Batteries Required</Text><br />
                                    <Text>Batteries Included</Text>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                    {currentPath && propertiesInfo?.properties?.map((property, index) => (
                        propertyRow(property, index)
                    ))}
                    <Divider />
                    {currentPath && fulfillmentType(false)}
                </>
            )}
            <Modal okButtonProps={{ loading: saving }} onOk={() => { modalForm.submit() }} title="Editar propiedad" style={{ width: 600 }} onCancel={() => { setShowEditModal(false) }} visible={showEditModal}>
                <Form form={modalForm} initialValues={orderRetrieved} onFinish={saveModal}>
                    <Row style={{ marginTop: 0 }}>
                        <Col span={24}>
                            <Item hidden name={['id']}>
                                <Input></Input>
                            </Item>
                            {selectedProperty && currentPath && propertyRow(selectedProperty, 0, true)}
                            <Divider />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    )
}