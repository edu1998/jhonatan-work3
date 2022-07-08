import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select, InputNumber, Switch, Tooltip, Typography, Button, DatePicker, Collapse, Space, Radio, Divider } from 'antd';
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
const { Item } = Form;
export default (props) => {

    const {
        propertiesInfo, canEditItem, setIsPack, orderRetrieved, form, path, currentTab, tab, isVariant, isMain
    } = props;

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);

    const [isVisible, setIsVisible] = useState(false);

    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 24, offset: 0 },
        },
    };


    const handleAttributeCopyFromAmazon = () => {
        if (tab && form && currentTab !== sellerMarketplaces.AMAZON) {

            const values = form.getFieldValue();
            if (values && values[tab] && values[tab]?.listingPerMarketplace && values[tab]?.listingPerMarketplace[sellerMarketplaces.AMAZON]) {
                const amazonProductDescription = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'product', 'attributes', 'product_description', 'value']);

                if (amazonProductDescription) {
                    const shopifyAttributes = form.getFieldValue([tab, 'listingPerMarketplace', currentTab, 'product', 'attributes']);
                    if (!shopifyAttributes.body_html || !shopifyAttributes?.body_html === '') {
                        values[tab].listingPerMarketplace[currentTab].product.attributes.body_html = amazonProductDescription;
                    }
                }
                const amazonVariants = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'variants']);

                if (amazonVariants) {
                    for (const idx in values[tab].listingPerMarketplace[sellerMarketplaces.AMAZON].variants) {
                        const amazonVariantDescription = form.getFieldValue([tab, 'listingPerMarketplace', sellerMarketplaces.AMAZON, 'variants', idx, 'attributes', 'product_description', 'value']);
                        if (amazonVariantDescription) {
                            const currentTabVariant = form.getFieldValue([tab, 'listingPerMarketplace', currentTab, 'variants', idx]);
                            if (currentTabVariant) {
                                if (!currentTabVariant.attributes.body_html || currentTabVariant.attributes.body_html === '') {
                                    values[tab].listingPerMarketplace[currentTab].variants[idx].attributes.body_html = amazonVariantDescription;
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

    useEffect(() => {
        if (currentTab === sellerMarketplaces.SHOPIFY && form && canEditItem) {
            const newFormData = handleAttributeCopyFromAmazon();
            handleIsVisible(newFormData);
        } else {
            handleIsVisible(null);
        }
    }, [currentTab])


    const inputTypeArray = (property, field) => {
        return (
            <Form.List
                name={[...path, property.name]}
            >
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
                                    <Input style={{ width: '60%' }} disabled={!canEditItem}
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
                <Input disabled={!canEditItem} maxLength={property.maxLength} />
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
                    disabled={!canEditItem} onChange={(event) => {
                        ['title'].includes(property.name) && event.target.value.toLowerCase().includes('pack') ?
                            setIsPack(true) : setIsPack(false);
                    }}
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
                <InputNumber style={{ width: '100%' }} min={0} disabled={!canEditItem} />
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
                <DatePicker showTime format={property.aspectFormat} disabled={!canEditItem} />
            </Item>
        )
    }

    const inputTypeTags = (property) => {
        return (
            <Item style={{ marginBottom: 0 }} name={[...path, property.name]}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Select disabled={!canEditItem} mode="tags" style={{ width: '100%' }} placeholder={property.label}></Select>
            </Item>
        )
    }

    const inputTypeSelection = (property) => {
        return (
            <Item style={{ width: '100%', marginBottom: 0 }} name={[...path, property.name]}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Select allowClear suffixIcon={property?.description && <Tooltip title={property.description}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } showSearch={true} style={{ width: '100%' }} disabled={!canEditItem}>
                    {property.options?.map((option, index) => (
                        <Option value={option} key={index}>{option}</Option>
                    ))}
                </Select>
            </Item>
        )
    }

    const inputTypeBoolean = (property) => {
        return (
            <Item valuePropName="checked" style={{ width: '100%', marginBottom: 0 }} name={[...path, property.name]}
                rules={[{
                    required: property.required,
                    message: `${property?.name?.replace(/_/g, " ")} ${t('isRequired')}`
                }]}>
                <Switch disabled={!canEditItem} />
            </Item>
        )
    }

    const ItemRow = (property, index) => {
        return (<Row style={{ marginTop: 4, marginBottom: 4 }} key={index}>
            <Col span={6}>
                <Space size="small">
                    <Text className="text-capitalize">
                        {property.required && <span style={{ color: 'red' }}>* </span>}
                        {property.label?.replace(/_/g, " ")}
                    </Text>
                    {property?.info && <Tooltip title={property.info}><InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} /></Tooltip>}
                </Space>
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
                {property.type === 'boolean' &&
                    inputTypeBoolean(property)
                }
                {property.type === 'textArea' &&
                    inputTypeTextArea(property)
                }
                {(property.type === 'integer' || property.type === 'number') &&
                    inputTypeNumber(property)
                }
                {(property.type === 'tags') &&
                    inputTypeTags(property)
                }
            </Col>
        </Row>);
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
                    <Collapse style={{ marginBottom: 24 }} bordered={false} defaultActiveKey={['1']}>
                        <Panel styles={{ textAlign: 'left' }} header={'Consideraciones'} key={1}>
                            <Row>
                                <Col span={24}>
                                    <Text>Recuerde que el producto principal NO es un item, sólo complete los inputs requeridos y marcados con *.</Text><br />
                                    <Text>Si el Listing tiene variantes, sólo difiera en uno de sus atributos.</Text>
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                    {propertiesInfo.properties?.map((property, index) => {
                        return (
                            isVariant ? property.showInVariants ? ItemRow(property, index) : null : ItemRow(property, index)
                        )
                    })}
                    <Divider />
                    {path && fulfillmentType()}
                </>)
            }
        </>
    )
}