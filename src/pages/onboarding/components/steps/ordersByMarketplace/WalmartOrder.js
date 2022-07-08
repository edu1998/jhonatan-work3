import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select, InputNumber, Tooltip, Typography, Button, Alert, Divider, Collapse, Radio, Space } from 'antd';
import { InfoCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { sellerMarketplaces } from '../../../../../utils/const';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import '../../../onboarding.css';
import 'antd/dist/antd.css';

const { Option } = Select;
const { Text, Title } = Typography;
const { Panel } = Collapse;

export default (props) => {

    const {
        propertiesInfo, canEditItem, path, currentTab, form, tab, orderForm, modalEditVariantVisible, variantValuesSet, orderRetrieved, isMain
    } = props;

    const { Item, List } = Form;
    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    
    const [forceRender, setForceRender] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    const handleAttributeCopyFromAmazon = () => {
        if (tab && form && currentTab !== sellerMarketplaces.AMAZON) {

            const values = form.getFieldValue();
            if (values && values[tab] && values[tab]?.listingPerMarketplace && values[tab]?.listingPerMarketplace[sellerMarketplaces.AMAZON]) {
                const amazonProductDescription = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'product', 'attributes', 'product_description', 'value']);

                if (amazonProductDescription) {
                    const walmartDescription = form.getFieldValue([tab, 'listingPerMarketplace', currentTab, 'product', 'attributes', 'shortDescription']);
                    if (!walmartDescription || walmartDescription === '') {
                        values[tab].listingPerMarketplace[currentTab].product.attributes.shortDescription = amazonProductDescription;
                    }
                }
                const amazonVariants = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'variants']);

                if (amazonVariants) {
                    for (const idx in values[tab].listingPerMarketplace[sellerMarketplaces.AMAZON].variants) {
                        const amazonVariantDescription = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'variants', idx, 'attributes', 'product_description', 'value']);
                        if (amazonVariantDescription) {
                            const currentTabVariant = form.getFieldValue([tab, 'listingPerMarketplace', currentTab, 'variants', idx]);
                            if (currentTabVariant) {
                                if (!currentTabVariant.attributes.shortDescription || currentTabVariant.attributes.shortDescription === '') {
                                    values[tab].listingPerMarketplace[currentTab].variants[idx].attributes.shortDescription = amazonVariantDescription;
                                }
                            }
                        }
                    }
                }

                form.setFieldsValue(values);
                return values;
            }
        }
    }

    const handleVariantGroupInformationCopy = () => {
        const productGroupId = orderForm.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.WALMART, 'product', 'attributes', 'variantGroupId']);
        const values = form.getFieldValue();
        let edited;
        if (productGroupId) {
            const ownProductGroupIdValue = form.getFieldValue('variantGroupId');
            if (!ownProductGroupIdValue || ownProductGroupIdValue === '') {
                edited = true;
                values['variantGroupId'] = productGroupId;
            }
        }

        const isPrimaryVariant = orderForm.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.WALMART, 'product', 'attributes', 'isPrimaryVariant']);
        if (isPrimaryVariant && isPrimaryVariant === 'Yes') {
            edited = true;
            values['isPrimaryVariant'] = 'No';
        }
        if (edited) {
            form.setFieldsValue(values);
            setForceRender((forceRender + 1));
        }

    }

    const handleIsVisible = (values) => {
        const formData = values || form.getFieldValue();
        console.log(formData, isMain)
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

    useEffect(() => {
        if (currentTab === sellerMarketplaces.WALMART && form && canEditItem) {
            const newFormData = handleAttributeCopyFromAmazon();
            handleIsVisible(newFormData);
        } else {
            handleIsVisible(null);
        }
    }, [currentTab])

    useEffect(() => {
        if (modalEditVariantVisible !== undefined && currentTab === sellerMarketplaces.WALMART && orderForm && canEditItem && variantValuesSet !== undefined) {
            handleVariantGroupInformationCopy();
        }
    }, [modalEditVariantVisible, variantValuesSet, form])

    useEffect(() => { }, [forceRender])

    const fixedName = (nameToFix) => nameToFix ? nameToFix.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
    const isFieldRequiredProperty = (required, property) => required && Array.isArray(required) && property ? required.includes(property) : false;

    const getNameArray = (fieldName, parentName, fieldKey) => {
        let names = [];
        if (parentName) {
            if (Array.isArray(parentName)) {
                names = names.concat(parentName)
            }
            else {
                names.push(parentName);
            }
        }
        if (fieldKey === 0) {
            names.push(fieldKey)
        }
        if (fieldName) {
            names.push(fieldName);
        }
        return names
    }

    const getFieldDescription = (field) => {
        if (field) {
            if (field.description) return field.description;
            if (field.title) return field.title;
        }
        return '';
    }

    const inputTypeTextArea = (field, parentName, requireds, fieldKey) => {
        return (
            <Item style={{ marginBottom: 15 }} name={getNameArray(field.name, parentName, fieldKey)}
                {...(fieldKey && { fieldKey: [fieldKey, field.name] })}
                rules={[{
                    required: isFieldRequiredProperty(requireds, field?.name),
                    message: `${fixedName(field?.name)} ${t('isRequired')}`
                }]}>
                <Input.TextArea showCount
                    maxLength={field?.maxLength} rows={2}
                    placeholder={canEditItem ? getFieldDescription(field) : ''}
                    disabled={!canEditItem}
                    minLength={field?.minLength ? field?.minLength : 1}
                />
            </Item>
        )
    }

    const inputTypeNumber = (field, parentName, requireds, fieldKey) => {
        return (
            <Item style={{ marginBottom: 1 }} name={getNameArray(field.name, parentName, fieldKey)}
                {...(fieldKey && { fieldKey: [fieldKey, field.name] })}
                rules={[{
                    required: isFieldRequiredProperty(requireds, field?.name),
                    message: `${fixedName(field.name)} ${t('isRequired')}`
                }]}>
                <InputNumber style={{ width: '100%' }}
                    min={field?.minimum}
                    placeholder={canEditItem ? getFieldDescription(field) : ''}
                    disabled={!canEditItem}
                    max={field?.maximum}
                />
            </Item>
        )
    }

    const inputTypeSelection = (field, parentName, requireds, fieldKey) => {
        return (
            <Item name={getNameArray(field.name, parentName, fieldKey)}
                {...(fieldKey && { fieldKey: [fieldKey, field.name] })}
                rules={[{
                    required: isFieldRequiredProperty(requireds, field?.name),
                    message: `${fixedName(field?.name)} ${t('isRequired')}`
                }]}>
                <Select allowClear suffixIcon={field && getFieldDescription(field) !== '' && <Tooltip title={getFieldDescription(field)}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    placeholder={canEditItem ? getFieldDescription(field) : ''}
                    showSearch={true}
                    disabled={!canEditItem} >
                    {field.enum?.map((option, index) => (
                        <Option value={field.enum[index]} key={index}>{option}</Option>
                    ))}
                </Select>
            </Item>
        )
    }

    const mapBaseField = (field, parentName, requireds, fieldKey) => (
        <>
            {field.type === "selection" && inputTypeSelection(field, parentName, requireds, fieldKey)}
            {field.type === "textArea" && inputTypeTextArea(field, parentName, requireds, fieldKey)}
            {(field.type === "integer" || field.type === "number") && inputTypeNumber(field, parentName, requireds, fieldKey)}
        </>
    );

    const mapFields = (field, index, parentName, requireds, fieldKey) => {
        const names = getNameArray(field.name, parentName, fieldKey)
        switch (field.type) {
            case 'object':
                return (
                    <>
                        {
                            field.fields.map((newField) =>
                                <Row
                                    md={(18 / field.fields.length) % 1 !== 0 ?
                                        index % 2 !== 0 ? Math.floor(18 / field.fields.length) :
                                            Math.ceil(18 / field.fields.length) : 18 / field.fields.length}
                                    key={fieldKey ? fieldKey : index}
                                >
                                    {mapFields(newField, index, names, requireds, fieldKey)}
                                </Row>
                            )
                        }
                    </>
                );

            case 'array':
                return (
                    <List name={names}>
                        {(fields, { add, remove }) => (
                            <Col md={16}>
                                {fields.map(({ key, name, fieldKey }) => {
                                    return (
                                        <Row>
                                            <Col md={12}>
                                                {
                                                    field.fields.map((newField) => mapFields(newField, index, name, requireds, fieldKey))
                                                }
                                            </Col>
                                            <Col md={4}>
                                                <MinusCircleOutlined style={{ margin: '0 8px', color: '#999', fontSize: 20 }}
                                                    className="dynamic-delete-button" onClick={() => remove(name)}
                                                    disabled={!canEditItem} />
                                            </Col>
                                            <Divider />
                                        </Row>)
                                })}
                                <Item>
                                    <Button disabled={!canEditItem} type="dashed" onClick={() => add()} style={{ width: '60%' }}
                                        icon={<PlusOutlined />}>
                                        {t('onboarding.add')} {field.name ? fixedName(field.name) : ''}
                                    </Button>
                                </Item>
                            </Col>
                        )}
                    </List>
                )

            default:
                return (<Col style={{ width: "100%" }}> {mapBaseField(field, parentName ? parentName : false, requireds, fieldKey)} </Col>)
        }
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
                                    <Text>Recuerde que el producto principal es un item y debe completar todos sus datos.</Text><br />
                                    <Text>Si el producto tiene variantes considere que tanto el padre como las variantes deben tener exactamente el mismo group id, y atributo de variante y debe indicar cual es la variante principal (isPrimaryVariant) e indicar, además, cuales no.</Text><br />
                                    <Text>No olvide completar los identificadores principales para cada producto y variant</Text>
                                </Col>
                            </Row>

                            {orderRetrieved?.LAP?.listingPerMarketplace?.Walmart?.product?.attributes?.notFound ?
                                <Row>
                                    <Col span={24}>
                                        <Alert
                                            message="Error de sincronización desde Walmart"
                                            showIcon
                                            description="El proceso de sincronización no pudo obtener más información del producto correspondiente al SKU. 
      Por favor, verifique que el SKU/UPC/GTIN es correcto en los sistemas de Walmart, sincronice nuevamente. Si el mensaje persiste, por favor contacte al equipo de soporte de Walmart en https://sellerhelp.walmart.com/s indicando que el producto no puede ser obtenido."
                                            type="error"
                                            action={
                                                <Button size="small" target="_blank" href="https://sellerhelp.walmart.com/s" danger>
                                                    Contactar a soporte
                                                </Button>
                                            }
                                        />
                                    </Col>
                                </Row>
                                : null}

                        </Panel>
                    </Collapse>
                    {propertiesInfo?.properties?.map((field, index) => (
                        <Row style={{ width: "100%", marginTop: 2 }} key={index}>
                            <Col span={6}>
                                <Text className="text-capitalize">
                                    {propertiesInfo.required?.includes(field.name) && <span style={{ color: 'red' }}>* </span>}
                                    {field.name?.replace(/([a-z])([A-Z])/g, '$1 $2')}
                                </Text>
                            </Col>
                            <Col span={18}> {mapFields(field, index, path, propertiesInfo.required)} </Col>
                        </Row>
                    ))}
                    <Divider />
                    {path && fulfillmentType()}
                </>)
            }
        </>
    )
}