import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Collapse, Row, Divider, Col, Typography, Space, Form, InputNumber } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { marketplaceCurrency } from '../../../utils/const';
import 'antd/dist/antd.css';

const { Text, Title } = Typography;
const { Panel } = Collapse;
const { Item } = Form;

export const TableMeasuresAndCosts = ({ form, measuresRetrieved, tab, currentTab, canEditItem }) => {
    const { t } = useTranslation();

    const [productsList, setProductsList] = useState();
    const [hasVariants, setHasVariants] = useState();
    const [refresh, setRefresh] = useState({ status: false, index: null });

    useEffect(() => {
        if (measuresRetrieved && tab && currentTab) {
            let productsList = [];
            if (measuresRetrieved[tab]?.listingPerMarketplace[currentTab]?.variants?.length > 0) {
                productsList = measuresRetrieved[tab]?.listingPerMarketplace[currentTab].variants;
                setHasVariants(true);
            } else {
                productsList = [measuresRetrieved[tab]?.listingPerMarketplace[currentTab].product];
                setHasVariants(false);
            }
            setProductsList(productsList);
            setRefresh({ status: true, index: 0 });
        }
    }, [measuresRetrieved, tab, currentTab])

    const percentageInput = (name, index, readOnly) => {
        const property = measuresRetrieved[tab]?.listingPerMarketplace[currentTab]?.variants?.length > 0 ?
            [tab, "listingPerMarketplace", currentTab, "variants", index] :
            [tab, "listingPerMarketplace", currentTab, "product"];

        return (
            <Item name={[...property, name]} style={{ marginBottom: 0 }}
                rules={[{
                    required: true,
                    message: `${name} ${t('isRequired')}`
                }]}>
                <InputNumber
                    min={0}
                    max={100}
                    readOnly={readOnly}
                    bordered={!readOnly}
                    disabled={!canEditItem}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    onChange={() => setRefresh({ status: true, index: index })} />
            </Item>
        )
    }

    const pricesInput = (name, index, readOnly, bordered, productData) => {
        const property = measuresRetrieved[tab]?.listingPerMarketplace[currentTab]?.variants?.length > 0 ?
            [tab, "listingPerMarketplace", currentTab, "variants", index] :
            [tab, "listingPerMarketplace", currentTab, "product"];
        const currency = productData?.attributes?.length > 0 ? productData?.attributes[0]?.list_price?.currency : marketplaceCurrency[currentTab];
        return (
            <Item name={[...property, name]} style={{ marginBottom: 0 }}>
                <InputNumber
                    min={0}
                    max={100}
                    readOnly={readOnly}
                    bordered={bordered}
                    disabled={!canEditItem}
                    style={{ width: '100%' }}
                    formatter={value => `${currency} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\USD|MXN|CAD|BRL|EUR|COP|CLP|THIS|ARS\s?|(,*)/g, '')}
                    onChange={() => setRefresh({ status: true, index: index })} />
            </Item>
        )
    }

    useEffect(() => {
        if (refresh.status) {
            getCostPerMkt(refresh.index);
            getTotalPerPercentType(refresh.index);
            setRefresh({ status: false, index: null });
        }
    }, [refresh])

    useEffect(() => {
        if (productsList?.length > 0) {
            for (const [idx, product] of productsList?.entries()) {
                setRefresh({ status: true, index: idx });
            }
        }
    }, [productsList])

    const getTotalPerPercentType = (index) => {
        let currentProduct = null;
        if (!currentTab || !tab) {
            return 0;
        }

        if (hasVariants && productsList?.length > 0) {
            currentProduct = [tab, "listingPerMarketplace", currentTab, "variants", index];
        } else {
            currentProduct = [tab, "listingPerMarketplace", currentTab, "product"];
        }
        let productData = form.getFieldValue(currentProduct);
        if (!productData) {
            return;
        }

        let referralFeeCost = parseFloat(productData.price) * productData['referralFeePercent'] / 100;
        productData['referralFeeCost'] = (referralFeeCost).toFixed(2);
        let LAPFee = parseFloat(productData.price) * productData['LAPFee'] / 100;
        productData['LAPFeeCost'] = (LAPFee).toFixed(2);
        setRefresh({ status: false, index: null });
    }

    const getCostPerMkt = (index) => {
        let currentProduct = null;
        let referralFeeCost = 0;
        let fulfillmentCost = 0;
        let storageCost = 0;

        if (hasVariants && productsList?.length > 0) {
            currentProduct = [tab, "listingPerMarketplace", currentTab, "variants", index];
        } else {
            currentProduct = [tab, "listingPerMarketplace", currentTab, "product"];
        }

        let productData = form.getFieldValue(currentProduct);
        if (!productData) {
            return;
        }

        let price = parseFloat(String(productData.price));
        let referralFeePercent = parseFloat(String(productData[`referralFeePercent`]));
        referralFeeCost = referralFeePercent ? (price * referralFeePercent / 100) : 0;
        fulfillmentCost = parseFloat(String(productData[`fulfillmentCost`])) || 0;
        storageCost = parseFloat(String(productData[`storageCost`])) || 0;

        let deliveryCost = parseFloat(String(productData[`deliveryCost`])) || 0;
        let lapFeeCost = parseFloat(String(productData[`LAPFeeCost`])) || 0;
        let holdCost = parseFloat(String(productData[`holdCost`])) || 0;

        productData[`totalCost`] = referralFeeCost + fulfillmentCost + storageCost;
        productData[`totalPercent`] = (productData[`totalCost`] * 100 / productData.price).toFixed(2);
        productData[`cif`] = (productData.price - productData[`totalCost`]).toFixed(2);
        productData[`total`] = (productData.price - productData[`totalCost`] - deliveryCost - lapFeeCost - holdCost).toFixed(2);
    }

    const columns = [
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text style={{ alignSelf: 'center', marginRight: '10px' }}>SKU</Text>
                </Row>
            ),
            dataIndex: "sku",
            key: "sku",
            render: (text, record) => <Row style={{ width: 100 }}>
                <Col>
                    <Text ellipsis={{ tooltip: record.defaultCode }}>{record.defaultCode}</Text>
                </Col>
            </Row>
        },
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text style={{ alignSelf: 'center', marginRight: '10px' }}>PRODUCTO</Text>
                </Row>
            ),
            dataIndex: "producto",
            key: "producto",
            render: (text, record) => <Row style={{ width: 100 }}>
                <Col>
                    <Text ellipsis={{ tooltip: record?.title }} style={{ width: 100 }}>{record?.title}</Text>
                </Col>
            </Row>
        },
        {
            title: 'PRECIO DE VENTA',
            dataIndex: "price",
            key: "price",
            render: (text, record, index) => <Row style={{ width: 125 }}>
                <Col>
                    {pricesInput('price', index, false, true, record)}
                </Col>
            </Row>
        },
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text className="measures-table-referral-title">REFERRAL FEE</Text>
                </Row>
            ),
            dataIndex: "referral",
            key: "referral",
            render: (text, record, index) => {
                return <Row className="measures-table-values-container" style={{ width: 200 }}>
                    <Col span={12}>
                        {pricesInput('referralFeeCost', index, true, false, record)}
                    </Col>
                    <Col span={12}>
                        {percentageInput('referralFeePercent', index, false)}
                    </Col>
                </Row>
            }
        },
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text className="measures-table-fulfillment-title">FULFILLMENT (FBA)</Text>
                </Row>
            ),
            dataIndex: "fulfillment",
            key: "fulfillment",
            render: (text, record, index) => {
                return <Row style={{ width: 125 }}>
                    <Col>
                        {pricesInput('fulfillmentCost', index, false, record)}
                    </Col>
                </Row>
            }
        },
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text className="measures-table-storage-title">STORAGE</Text>
                </Row>
            ),
            dataIndex: "storage",
            key: "storage",
            render: (text, record, index) => {
                return <Row style={{ width: 125 }}>
                    <Col>
                        {pricesInput('storageCost', index, false, record)}
                    </Col>
                </Row>
            }
        },
        {
            title: () => (
                <Row className="measures-table-title-container" >
                    <Text className="measures-table-cif-title-container" ellipsis={{ tooltip: 'PRECIO DE VENTA - FEES AMAZON' }}>PRECIO DE VENTA - FEES AMAZON)</Text>
                </Row>
            ),
            dataIndex: "cifPrice",
            key: "cifPrice",
            render: (text, record, index) => {
                return <Row style={{ width: 125 }} >
                    <Col span={24}>
                        {pricesInput('cif', index, true, false, record)}
                    </Col>
                </Row>
            }
        },
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text className="measures-table-storage-title" ellipsis={{ tooltip: 'COSTO DE ENVÍO UNITARIO' }}>COSTO DE ENVÍO UNITARIO</Text>
                </Row>
            ),
            dataIndex: "deliveryCost",
            key: "deliveryCost",
            render: (text, record, index) => {
                return <Row style={{ width: 125 }}>
                    <Col span={24}>
                        {pricesInput('deliveryCost', index, false, record)}
                    </Col>
                </Row>
            }
        },
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text className="measures-table-storage-title">FEE LAP</Text>
                </Row>
            ),
            dataIndex: "LAPFee",
            key: "LAPFee",
            width: 250,
            render: (text, record, index) => {
                return <Row style={{ width: 200 }}>
                    <Col span={12}>
                        {pricesInput('LAPFeeCost', index, true, false, record)}
                    </Col>
                    <Col span={12}>
                        {percentageInput('LAPFee', index, false)}
                    </Col>
                </Row>
            }
        },
        {
            title: () => (
                <Row className="measures-table-title-container">
                    <Text className="measures-table-storage-title" style={{ width: 110 }}
                        ellipsis={{ tooltip: 'COSTO DE INTERNACION' }}>RETORNO NETO</Text>
                </Row>
            ),
            dataIndex: "total",
            key: "total",
            width: 250,
            render: (text, record, index) => {
                return <Row style={{ width: 125 }}>
                    <Col>
                        <Space direction="horizontal" size={25}>
                            {pricesInput('total', index, true, false, record)}
                        </Space>
                    </Col>
                </Row>
            }
        }
    ]

    return (
        <>
            <Divider />
            <Row>
                <Col className="text-align-left">
                    <Title level={4} className="title-primary">{t('onboarding.measuresAndPrices.costsTitle')}</Title>
                    <Text type="secondary">{t('onboarding.measuresAndPrices.costsDescription')} </Text>
                </Col>
            </Row>
            <Divider className="divider-margin" />
            <Table columns={columns} className="measures-table" scroll={{ x: 1000 }}
                dataSource={productsList?.map(product => ({ ...product, key: product.defaultCode }))} />
            <Divider className="divider-margin" />
            <Collapse defaultActiveKey={['1']} ghost className="measures-collapse">
                <Panel header={t('onboarding.measuresAndPrices.help')} key="1">
                    <Row className="measures-help-container">
                        <Col className="measures-help-card">
                            <Title level={5} style={{ color: '#8DD7CF' }}>{t('onboarding.measuresAndPrices.referral')}</Title>
                            <Row className="measures-help-details">
                                <Col className="measures-help-details-item">
                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.referralItem1')}</Text>
                                </Col>
                                <Col className="measures-help-details-item">
                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.referralItem2')}</Text>
                                </Col>
                                <Col className="measures-help-details-item">
                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.referralItem3')}</Text>
                                </Col>
                            </Row>
                        </Col>
                        <Row className="measures-help-card">
                            <Title level={5} style={{ color: '#D3475D' }}>{t('onboarding.measuresAndPrices.fulfillment')}</Title>
                            <Col className="measures-help-details">
                                <Row>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.fulfillmentItem1')}</Text>
                                    </Col>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.fulfillmentItem2')}</Text>
                                    </Col>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.fulfillmentItem3')}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="measures-help-card">
                            <Title level={5} style={{ color: '#E88544' }}>{t('onboarding.measuresAndPrices.storage')}</Title>
                            <Col className="measures-help-details">
                                <Row>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.storageItem1')}</Text>
                                    </Col>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.storageItem2')}</Text>
                                    </Col>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.storageItem3')}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="measures-help-card">
                            <Title level={5} style={{ color: '#5466E3' }}>{t('onboarding.measuresAndPrices.costoUnitari')}</Title>
                            <Col className="measures-help-details">
                                <Row>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.costoUnitariItem1')}</Text>
                                    </Col>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.costoUnitariItem2')}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="measures-help-card">
                            <Title level={5} style={{ color: '#00E9A0' }}>{t('onboarding.measuresAndPrices.freeLap')}</Title>
                            <Col className="measures-help-details">
                                <Row>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.freeLapItem1')}</Text>
                                    </Col>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.freeLapItem2')}</Text>
                                    </Col>
                                    <Col className="measures-help-details-item">
                                        <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text ">{t('onboarding.measuresAndPrices.freeLapItem3')}</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Row>
                </Panel>
            </Collapse>
        </>
    )
}