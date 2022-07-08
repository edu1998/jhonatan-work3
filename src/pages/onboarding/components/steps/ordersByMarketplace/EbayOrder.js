import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select, InputNumber, Tooltip, Typography, Button, DatePicker, Collapse, Space, Radio, Divider } from 'antd';
import { InfoCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { sellerMarketplaces } from '../../../../../utils/const';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import '../../../onboarding.css';
import 'antd/dist/antd.css';

const { Option } = Select;
const { Text, Title } = Typography;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const ebayAttributesForCopy = ['listingDescription', 'description', 'title'];
export default (props) => {

    const {
        propertiesInfo, handleUpdateFormAttributes, orderRetrieved,
        canEditItem, form, path, currentTab, tab, isMain, firstMkt
    } = props;

    const { t } = useTranslation();
    const { Item } = Form;
    const [newItem, setNewItem] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const session = useSelector(store => store.Session.session);

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 24, offset: 0 },
        },
    };

    const setDataForListingMarketplace = (formData, marketplace) => {
        let firstMktProduct = formData[tab]?.listingPerMarketplace[firstMkt]?.product;
        let firstMktVariants = formData[tab]?.listingPerMarketplace[firstMkt]?.variants;
        let product = formData[tab]?.listingPerMarketplace[marketplace]?.product;
        let variants = formData[tab]?.listingPerMarketplace[marketplace]?.variants;
        if (product) {
            !product?.attributes?.mpn && (product.attributes.mpn = product.defaultCode);
            !product?.attributes?.condition && (product.attributes.condition = 'NEW');
            if (propertiesInfo?.properties?.find(property => property.name == 'MPN') && !product?.attributes?.MPN) {
                product.attributes.MPN = product.defaultCode;
            }
            if (marketplace != firstMkt && firstMkt == sellerMarketplaces.EBAY) {
                product.attributes = handleEbayAttributesForCopy(product.attributes, firstMktProduct.attributes);
            }
            formData[tab].listingPerMarketplace[marketplace].product = product;
        }
        if (variants?.length > 0) {
            for (const [idx, variant] of variants?.entries()) {
                !variant.attributes?.mpn && (variants[idx].attributes.mpn = variant.defaultCode);
                !variant.attributes?.condition && (variants[idx].attributes.condition = 'NEW');
                if (propertiesInfo?.properties?.find(property => property.name == 'MPN') && !variant?.attributes?.MPN) {
                    variants[idx].attributes.MPN = variant.defaultCode;
                }
                if (marketplace != firstMkt && firstMkt == sellerMarketplaces.EBAY) {
                    variants[idx].attributes = handleEbayAttributesForCopy(variants[idx].attributes, firstMktVariants[idx].attributes);
                }
            }
            formData[tab].listingPerMarketplace[marketplace].variants = variants;
        }
        return formData;
    }

    const handleEbayAttributesForCopy = (currentAttributes, attributesFirstMkt) => {
        for (const attributeForCopy of ebayAttributesForCopy) {
            if ([null, undefined, ''].includes(currentAttributes[attributeForCopy])) {
                if (attributesFirstMkt[attributeForCopy]) {
                    currentAttributes[attributeForCopy] = attributesFirstMkt[attributeForCopy];
                }
            }
        }
        return currentAttributes;
    }

    const handleAmazonAttributesForCopy = (currentAttributes, attributesFromAmazon) => {
        const hasBrand = propertiesInfo?.properties?.find(property => property.name == 'brand');
        if (attributesFromAmazon?.product_description?.value) {
            if ([null, undefined, ''].includes(currentAttributes.description)) {
                currentAttributes.description = attributesFromAmazon?.product_description?.value;
            }
        }
        if (attributesFromAmazon?.product_description?.value) {
            if ([null, undefined, ''].includes(currentAttributes.listingDescription)) {
                currentAttributes.listingDescription = attributesFromAmazon?.product_description?.value;
            }
        }
        if (hasBrand && attributesFromAmazon?.brand?.value) {
            if ([null, undefined, ''].includes(currentAttributes.brand)) {
                currentAttributes.brand = attributesFromAmazon?.brand?.value;
            }
        }
        if (hasBrand && attributesFromAmazon?.item_name?.value) {
            if ([null, undefined, ''].includes(currentAttributes.title)) {
                currentAttributes.title = attributesFromAmazon?.item_name?.value;
            }
        }
        return currentAttributes;
    }

    const handleAttributeCopyFromAmazon = (tab, marketplace, orderRetrieved) => {
        if (tab
            && form
            && firstMkt === sellerMarketplaces.AMAZON
            && marketplace.includes(sellerMarketplaces.EBAY)) {
            const values = form.getFieldValue();

            if (values
                && values[tab]
                && values[tab]?.listingPerMarketplace
                && values[tab]?.listingPerMarketplace[sellerMarketplaces.AMAZON]) {
                const amazonProduct = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'product', 'attributes']);
                const ebayAttributes = form.getFieldValue([tab, 'listingPerMarketplace', marketplace, 'product', 'attributes']);
                values[tab].listingPerMarketplace[marketplace].product.attributes = handleAmazonAttributesForCopy(ebayAttributes, amazonProduct);

                const amazonVariants = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'variants']);
                if (amazonVariants) {
                    for (const idx in values[tab].listingPerMarketplace[sellerMarketplaces.AMAZON].variants) {
                        const amazonVariant = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'variants', idx, 'attributes']);
                        const currentTabVariant = form.getFieldValue([tab, 'listingPerMarketplace', marketplace, 'variants', idx]);
                        if (currentTabVariant) {
                            values[tab].listingPerMarketplace[marketplace].variants[idx].attributes = handleAmazonAttributesForCopy(currentTabVariant, amazonVariant);
                        }
                    }
                }
            }
            const formData = setDataForListingMarketplace(values, marketplace);
            return formData[tab].listingPerMarketplace[marketplace];
        } else {
            if (tab
                && form
                && firstMkt == sellerMarketplaces.EBAY
                && marketplace.includes(sellerMarketplaces.EBAY)) {
                let values = orderRetrieved;
                const formData = setDataForListingMarketplace(values, marketplace);
                return formData[tab].listingPerMarketplace[marketplace];
            }
        }
    }

    useEffect(() => {
        if (form
            && orderRetrieved
            && Object.entries(orderRetrieved).length > 0
            && currentTab.includes(sellerMarketplaces.EBAY)) {
            for (const marketplace of Object.keys(orderRetrieved[tab]?.listingPerMarketplace)) {
                if (marketplace.includes(sellerMarketplaces.EBAY)) {
                    orderRetrieved[tab].listingPerMarketplace[marketplace] = handleAttributeCopyFromAmazon(tab, marketplace, orderRetrieved);
                }
            }
            form.setFieldsValue(orderRetrieved);
            handleIsVisible(orderRetrieved);
        } else {
            handleIsVisible(null);
        }
    }, [])

    useEffect(() => {
        let formData = form.getFieldValue();
        if (formData
            && formData[tab]
            && currentTab != firstMkt
            && formData[tab]?.listingPerMarketplace) {
            for (const marketplace of Object.keys(formData[tab]?.listingPerMarketplace)) {
                if (marketplace == currentTab && marketplace.includes(sellerMarketplaces.EBAY)) {
                    formData = setDataForListingMarketplace(formData, marketplace);
                }
            }
            handleIsVisible(formData);
        }
    }, [currentTab])

    const handleIsVisible = (values) => {
        const formData = values || form.getFieldValue();
        if (session.userInfo.isAdmin || tab === 'LAP') {
            setIsVisible(true);
        } else {
            if ([false, null, undefined, ''].includes(isMain)
                && formData[tab]?.listingPerMarketplace[currentTab]?.variants?.length > 0) {
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

    const inputTypeArray = (property, field) => {
        return (
            <Form.List
                name={[...path, property.name]}>
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map((field, index) => (
                            <Item {...formItemLayoutWithOutLabel}
                                required={false}
                                key={field.key}>
                                <Item {...field}
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[{ message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}` }]}
                                    noStyle>
                                    <Input style={{ width: '60%' }} disabled={!canEditItem || property.disabled}
                                        suffix={property?.description && <Tooltip title={property.description}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>}
                                    />
                                </Item>
                                {fields.length > 0 && canEditItem ? (
                                    <MinusCircleOutlined style={{ margin: '0 8px', color: '#999', fontSize: 20 }} className="dynamic-delete-button" onClick={() => remove(field.name)} />
                                ) : null}
                            </Item>
                        ))}
                        {canEditItem &&
                            <Item>
                                <Button type="dashed" onClick={() => add()} style={{ width: '60%' }} icon={<PlusOutlined />}>
                                    {t('onboarding.add')} {property.name}
                                </Button>
                            </Item>}
                    </>
                )}
            </Form.List>
        )
    }

    const inputTypeText = (property) => {
        return (
            <Item name={[...path, property.name]} style={{ width: '100%', marginBottom: 0 }}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Input disabled={!canEditItem || property.disabled} maxLength={property.maxLength}
                    suffix={
                        property?.description && <Tooltip title={property.description} style={{ whiteSpace: 'pre-wrap' }}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>
                    }
                />
            </Item>
        )
    }

    const inputTypeTextArea = (property) => {
        return (
            <Item style={{ marginBottom: 15 }} name={[...path, property.name]}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Input.TextArea showCount
                    maxLength={property?.maxLength} rows={2}
                    disabled={!canEditItem || property.disabled}
                />
            </Item>
        )
    }

    const inputTypeNumber = (property) => {
        return (
            <Item style={{ marginBottom: 0 }} name={[...path, property.name]}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <InputNumber style={{ width: '100%' }} min={0} disabled={!canEditItem || property.disabled} />
            </Item>
        )
    }

    const inputTypeDate = (property) => {
        return (
            <Item style={{ marginBottom: 0 }} name={[...path, property.name]}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <DatePicker showTime format={property.aspectFormat} disabled={!canEditItem || property.disabled} />
            </Item>
        )
    }

    const addNewItemToOptions = (currentProperty) => {
        const newValues = propertiesInfo.properties = propertiesInfo.properties.map(property => {
            if (property.name === currentProperty) {
                property.options.unshift(newItem);
            }
            return property;
        });
        handleUpdateFormAttributes(newValues);
        setNewItem(null);
    }

    const inputTypeSelection = (property) => {
        return (
            <Item style={{ width: '100%', marginBottom: 0 }} name={[...path, property.name]}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Select allowClear suffixIcon={property?.description && <Tooltip title={property.description}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>}
                    mode={property.cardinality == 'MULTI' ? "multiple" : null} dropdownRender={menu => (
                        <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space align="center" style={{ padding: '0 8px 4px' }}>
                                <Input placeholder="Ingresa el tuyo" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
                                <Typography.Link disabled={!newItem} onClick={() => addNewItemToOptions(property?.name)} style={{ whiteSpace: 'nowrap' }}>
                                    <PlusOutlined /> Agregar
                                </Typography.Link>
                            </Space>
                        </>
                    )}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } showSearch={true} style={{ width: '100%' }} disabled={!canEditItem || property.disabled}>
                    {property.options?.map((option, index) => (
                        <Option value={option} key={index}>{option}</Option>
                    ))}
                </Select>
            </Item>
        )
    }

    const fulfillmentType = () => {
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
                                <Radio style={{ marginTop: 12 }} value={'FBA'} disabled={!canEditItem}>
                                    <Space direction="vertical">
                                        <p className="text-card-radio">{t('onboarding.fulfillment.FBA')}</p>
                                        <Text type="secondary">{t('onboarding.fulfillment.FBADescription')}</Text>
                                    </Space>
                                </Radio>
                                <Divider style={{ margin: 0 }} />
                            </>
                            <>
                                <Radio value={'FBM'} disabled={!canEditItem}>
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

    return (
        <>
            {isVisible && (
                <>
                    <Collapse style={{ marginBottom: 24, marginRight: 45 }} bordered={false} defaultActiveKey={['1']}>
                        <Panel styles={{ textAlign: 'left' }} header={'Consideraciones'} key={1}>
                            <Row>
                                <Col span={24}>
                                    <Text>Recuerde que el producto principal NO es un item, sólo complete los inputs requeridos y marcados con *.</Text><br />
                                    <Text>Si el Listing tiene variantes, sólo difiera en uno de sus atributos.</Text>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                    {propertiesInfo?.properties?.map((property, index) => (
                        <Row style={{ marginTop: 4, marginBottom: 4 }} key={index}>
                            <Col span={6}>
                                <Text className="text-capitalize">
                                    {property.required && <span style={{ color: 'red' }}>* </span>}
                                    {`${property.name?.replace(/_/g, " ")} ${['Mpn', 'mpn', 'MPN'].includes(property.name) ? '/ SKU' : ''}`}
                                </Text>
                            </Col>
                            <Col xs={18} sm={18} md={18} key={index}>
                                {['array'].includes(property.type)
                                    && inputTypeArray(property)
                                }
                                {['string', 'object', null, undefined].includes(property.type)
                                    && inputTypeText(property)
                                }
                                {property.type === 'selection' &&
                                    inputTypeSelection(property)
                                }
                                {property.type === 'textArea' &&
                                    inputTypeTextArea(property)
                                }
                                {(property.type === 'integer' || property.type === 'number') &&
                                    inputTypeNumber(property)
                                }
                            </Col>
                        </Row>
                    ))}
                    <Divider />
                    <Col span={24}>
                        {path && fulfillmentType()}
                    </Col>
                </>)}
        </>
    )
}