import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Form, Select, Popconfirm, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import partnerApi from '../../../api/partner';
import 'antd/dist/antd.css';

const { Text } = Typography;
const { Option } = Select;
const { Item } = Form;

export const FBAMatchingModal = ({ visible, setVisible, partnerId, getListingsPerPageInit }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [productsToMatchOnFBA, setProductsToMatchOnFBA] = useState([]);
    const [loadingGetProducts, setLoadingGetProducts] = useState(false);
    const [loadingProcess, setLoadingProcess] = useState(false);

    useEffect(() => {
        if (visible?.product) {
            filterSkusPerOriginAndFBA();
            if (visible.product?.fbaSku) {
                form.setFieldsValue({ 'fbaSku': visible.product.fbaSku });
            }
        }
    }, [visible])

    const filterSkusPerOriginAndFBA = async () => {
        setLoadingGetProducts(true);
        let products = [];
        await partnerApi.productsWithInventoryAtOriginFba(partnerId, visible.product?.marketplace)
            .then((response) => {
                for (const product of response?.data) {
                    if (product?.defaultCode && product?.externalId) {
                        if (!products?.find(p => p.defaultCode === product.defaultCode && p.marketplace === product.marketplace)) {
                            products.push(product)
                        }
                    }
                }
            }).catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingGetProducts(false);
        setProductsToMatchOnFBA(products);
    }

    const handleCancelModal = () => {
        setVisible({ value: false, data: null });
    }

    const onsubmit = async (value) => {
        if (!value && !visible?.product?.fbaSku) {
            openNotification({ status: false, content: `Deeb seleccionar un SKU` });
            return;
        }

        value ? (await updateFbaSku(value)) : (await deleteFbaSku());
    };

    const updateFbaSku = async (value) => {
        setLoadingProcess(true);
        await partnerApi.updateFbaSkuByProduct(partnerId, visible.product?.id, value)
            .then((response) => {
                if (response?.data?.success) {
                    openNotification({ status: true, content: `Se establece la relación con éxito` });
                    visible['product']['fbaSku'] = value;
                    setVisible(visible);
                    form.setFieldsValue('fbaSku', value);
                    getListingsPerPageInit();
                } else {
                    openNotification({ status: true, content: `Error al establecer la relación de inventario en orígen para el sku: ${visible?.product?.defaultCode}` });
                }
            }).catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingProcess(false);
    }

    const deleteFbaSku = async () => {
        setLoadingProcess(true);
        await partnerApi.deleteFbaSkuByProduct(partnerId, visible.product?.id)
            .then((response) => {
                if (response?.data?.success) {
                    openNotification({ status: true, content: `Se elimina la relación con éxito` });
                    visible['product']['fbaSku'] = null;
                    setVisible(visible);
                    form.resetFields();
                    getListingsPerPageInit();
                } else {
                    openNotification({ status: true, content: `Error al eliminar la relación de inventario en orígen para el sku: ${visible?.product?.defaultCode}` });
                }
            }).catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingProcess(false);
    }


    return (
        <div>
            <Modal title={visible?.title}
                visible={visible?.value}
                onCancel={handleCancelModal}
                width={800} centered destroyOnClose
                footer={[
                    <Button
                        key="cancel"
                        onClick={handleCancelModal}>
                        Cerrar
                    </Button>
                ]}>
                <Form name="formulario" form={form} >
                    <Row >
                        <Col span={14} style={{ margin: 5 }}>
                            <Item rules={[{ required: true }]} name={'fbaSku'} label={'SKU'}>
                                <Select loading={loadingGetProducts}
                                    showSearch filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    } >
                                    {productsToMatchOnFBA?.map((item, index) => {
                                        return <Option key={index} value={item.defaultCode}>
                                            {item?.defaultCode} <Text type="secondary">({t(`dashboard.marketplaces.${item.marketplace.replace(' ', '')}`)})</Text>
                                        </Option>
                                    })}
                                </Select>
                            </Item>
                        </Col>
                        {!visible?.product?.fbaSku ?
                            <Col span={4} style={{ margin: 5 }}>
                                <Popconfirm
                                    title={`Seguro que desea establecer el vínculo para el sku: 
                                ${visible?.product?.defaultCode} (${visible?.product?.marketplace}) 
                                con el sku seleccionado en FBA?`}
                                    onConfirm={() => onsubmit(form.getFieldsValue()?.fbaSku)}
                                    icon={<WarningOutlined />}
                                    okText={t('yes')}
                                    cancelText={t('no')}

                                >
                                    <Button loading={loadingProcess} >Agregar vínculo</Button>
                                </Popconfirm>
                            </Col> :
                            <Col span={4} style={{ margin: 5 }}>
                                <Popconfirm
                                    title={`Seguro que desea eliminar el vínculo para el sku: 
                                ${visible?.product?.defaultCode}?`}
                                    onConfirm={() => onsubmit(null)}
                                    icon={<WarningOutlined />}
                                    okText={t('yes')}
                                    cancelText={t('no')}
                                >
                                    <Button loading={loadingProcess}>Eliminar vínculo</Button>
                                </Popconfirm>
                            </Col>
                        }
                    </Row>
                </Form>
            </Modal >
        </div >
    )
};