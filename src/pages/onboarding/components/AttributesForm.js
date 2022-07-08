import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Space, Card } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { validateMessages } from '../../../utils/const';
import { useTranslation } from 'react-i18next';
import AmazonOrder from './steps/ordersByMarketplace/AmazonOrder';
import WalmartOrder from './steps/ordersByMarketplace/WalmartOrder';
import EbayOrder from './steps/ordersByMarketplace/EbayOrder';
import 'antd/dist/antd.css';
import ShopifyOrder from './steps/ordersByMarketplace/ShopifyOrder';

const componentByMarketplace = {
    "Amazon": AmazonOrder,
    "Amazon Mexico": AmazonOrder,
    "Amazon Canada": AmazonOrder,
    "Amazon Brazil": AmazonOrder,
    "Walmart": WalmartOrder,
    "Ebay": EbayOrder,
    "EbayCanada": EbayOrder,
    "EbaySpain": EbayOrder,
    "EbayGermany": EbayOrder,
    "Shopify": ShopifyOrder
}

const OrderByMarketplace = (props) => {
    const Comp = componentByMarketplace[props.currentTab];
    return <Comp {...props} />
}


export const AttributesForm = ({ getOrder, canEditItem, currentItem, toggleModalEditVariant, propertiesInfo, handleUpdateFormAttributes,
    tab, currentTab, disabled, orderRetrieved, setOrderRetrieved, orderForm, modalEditVariantVisible, firstMkt }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    
    const [isPack, setIsPack] = useState(false);
    const [variantValuesSet, setVariantValuesSet] = useState(false);

    useEffect(() => {
        if (currentItem?.defaultCode) {
            form.resetFields();
            let attributes = currentItem.attributes?.length ? currentItem.attributes[0] : currentItem.attributes;
            if (currentItem?.defaultCode) {
                let data = {
                    ...attributes,
                    condition_type: { value: 'new_new' },
                    parentage_level: { value: 'child' },
                    child_parent_sku_relationship: { child_relationship_type: 'variation', parent_sku: orderRetrieved[tab].listingPerMarketplace[currentTab]?.product?.defaultCode },
                }
                form.setFieldsValue(data);
                setVariantValuesSet(!variantValuesSet);
            }
        }
    }, [currentItem, currentTab, tab])

    const onFinish = () => {
        let indexToUpdate = orderRetrieved[tab].listingPerMarketplace[currentTab]?.variants?.findIndex(element => element.defaultCode === currentItem.defaultCode);
        if (indexToUpdate !== -1) {
            orderRetrieved[tab].listingPerMarketplace[currentTab].variants[indexToUpdate] = { ...currentItem, attributes: form.getFieldsValue() }
        } else {
            orderRetrieved[tab].listingPerMarketplace[currentTab].variants = [{ ...currentItem, attributes: form.getFieldsValue() }]
        }
        setOrderRetrieved(orderRetrieved)
        closeModal();
    }

    const closeModal = () => {
        form.resetFields();
        toggleModalEditVariant();
    };

    return (
        <>
            {!disabled && <Alert message={t('modalAddProductVariant.alertMessage')} action={
                <Space>
                    <Button size="small" type="link" icon={<CloseOutlined />} onClick={closeModal}>{t('onboarding.alertButtonClose')}</Button>
                    <Button className="btn-primary" onClick={onFinish} disabled={disabled}>{t('onboarding.modalVariantsButtonSave')}  </Button>
                </Space>
            } />}
            <Form name="formulario" form={form} layout="vertical" onFinish={onFinish}
                validateMessages={validateMessages} className="text-align-left">
                <Card style={{ margin: '20px', backgroundColor: '#e7e7e730', borderRadius: '5px' }}>
                    {currentTab && currentItem && (
                        <OrderByMarketplace isVariant={true} getOrder={getOrder} listingId={orderRetrieved.Client.id} defaultCode={currentItem.defaultCode}
                            externalId={currentItem.externalId} path={[]} tab={tab} orderRetrieved={currentItem.attributes} propertiesInfo={propertiesInfo}
                            canEditItem={canEditItem} currentTab={currentTab} setIsPack={setIsPack} form={form} orderForm={orderForm}
                            modalEditVariantVisible={modalEditVariantVisible} variantValuesSet={variantValuesSet}
                            handleUpdateFormAttributes={handleUpdateFormAttributes} firstMkt={firstMkt}
                        />
                    )}
                </Card>
            </Form>
        </>
    )
}