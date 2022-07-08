import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Select, Spin, InputNumber, Popconfirm, Typography, Alert } from 'antd';
import { SaveFilled, WarningOutlined, RedoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import listingAPI from '../../../api/listing';
import { useSelector } from 'react-redux';
import 'antd/dist/antd.css';

const { Text, Title } = Typography;
const antIcon = <RedoOutlined spin />;

export const FBMModal = ({ visible, setVisible, setLoadingSyncStock, loadingSyncStock, partnerId, clientListings, getListingsPerPageInit }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [productMarkets, setProductMarkets] = useState([]);
    const session = useSelector(store => store.Session.session);

    useEffect(() => {
        if (visible?.product?.defaultCode && visible?.clientListings?.length > 0) {
            let productMkts = [];
            for (const listing of clientListings) {
                for (const product of listing.products) {
                    if (product.defaultCode === visible.product.defaultCode && !productMkts.find(mkt => mkt === product.marketplace)) {
                        productMkts.push(product.marketplace);
                    }
                }
            }
            setProductMarkets(productMkts);
            form.setFieldsValue({ 'marketplacesToUpdate': productMkts, 'quantity': visible?.product?.inventory?.fbmStock || 0 });
        }
    }, [visible])

    const handleCancelModal = () => {
        setVisible({ value: false, data: null });
    }

    const onSubmit = (values) => {
        syncFbmStockByListing(values);
    };

    const syncFbmStockByListing = async (data) => {
        const values = {
            commercialPartnerId: session.userInfo.isAdmin ? partnerId : session.userInfo.commercial_partner_id[0],
            sku: visible.product.defaultCode,
            ...data
        }
        setLoadingSyncStock({ loading: true, listingIndex: visible.product.productIndex });
        await listingAPI.syncFbmStock(values)
            .then((result) => {
                const data = result.data;
                if (data.success) {
                    getListingsPerPageInit();
                    openNotification({ status: true, content: 'Sincronización de stock con FBM de manera exitosa' });
                } else {
                    openNotification({
                        status: false,
                        content: data?.errors?.length > 0 ? data?.errors.join('.') : 'Falló la sincronización de stock'
                    });
                }
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingSyncStock({ loading: false, listingIndex: null });
    }

    return (
        <div>
            <Modal title={visible?.title}
                visible={visible?.value}
                onCancel={handleCancelModal}
                width={800}
                centered
                destroyOnClose
                footer={[
                    <Button
                        key="cancel"
                        onClick={handleCancelModal}>
                        Cerrar
                    </Button>,
                    <Popconfirm
                        title={'Seguro que desea actualizar stock?'}
                        onConfirm={() => form.submit()}
                        onCancel={() => { }}
                        icon={<WarningOutlined />}
                        okText={t('yes')}
                        cancelText={t('no')}
                        okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                    >
                        <Button type="text" icon={loadingSyncStock.loading ? <Spin indicator={antIcon} /> : <SaveFilled />} >Actualizar</Button>
                    </Popconfirm>
                ]}>
                <Alert style={{ marginBottom: 20 }} message={'Recuerde que eBay suele limitar las cantidades en el inventario. Recomendamos validar su cuenta con el administrador de LAP.'} type="warning" showIcon />
                <Form name="formulario" form={form} onFinish={onSubmit}
                    labelCol={{ span: 6 }} wrapperCol={{ span: 12 }}>
                    <Row >
                        <Col span={24} >
                            <Form.Item name="quantity" rules={[{ required: true }]} label={t('home.listing.stock')}>
                                <InputNumber min={0} style={{ width: '100%' }} placeholder={'Cantidad'} />
                            </Form.Item>
                        </Col>
                        {productMarkets?.length > 0 &&
                            <Col span={24} >
                                <Form.Item name="marketplacesToUpdate" rules={[{ required: true }]}
                                    label={t('home.listing.modalFBM.marketplaces')}
                                    tooltip={t('home.listing.modalFBM.marketplacesDescription')}
                                >
                                    <Select mode="multiple" style={{ width: '100%' }}>
                                        {productMarkets.map(item => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        }
                    </Row>
                </Form>
            </Modal >
        </div >
    )
};

