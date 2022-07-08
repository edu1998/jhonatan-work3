import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Modal, Row, Spin, Divider, Select } from 'antd';
import 'antd/dist/antd.css';
import orderDocumentsApi from '../../../api/order-documents';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import { shippingTypes, formItemLayout } from '../../../utils/const';

const { Item } = Form;

const AMDocumentModal = ({ amDocumentModalVisible, setAMDocumentModalVisible, create, document, setSuccessfullyEndDocuments }) => {

    const { t } = useTranslation();

    const [loadingApi, setLoadingApi] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (!create && document) {
            form.setFieldsValue({
                document_id: document.shippingDocId,
                shipping_type: document.shippingType,
                document_link: document.shippingDocLink,
                container: document.containerId
            })
        } else {
            form.resetFields();
        }
    }, [document, create]);

    const handleOk = () => {
        form.submit();
    }

    const onFinish = async (fields) => {
        // SEND TO API REJECT WITH COMMENT
        setLoadingApi(true);
        const body = {
            id: document?.id,
            shippingDocId: fields.document_id,
            shippingType: fields.shipping_type,
            shippingDocLink: fields.document_link,
            containerId: fields.container
        };
        if (create) {
            await orderDocumentsApi.create(body)
                .then((response) => {
                    openNotification({ status: true, content: 'Creado correctamente.' });
                    setSuccessfullyEndDocuments(true);
                    setAMDocumentModalVisible(false);
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
        } else {
            await orderDocumentsApi.update(document.id, body)
                .then((response) => {
                    openNotification({ status: true, content: 'Actualizado correctamente.' });
                    setSuccessfullyEndDocuments(true);
                    setAMDocumentModalVisible(false);
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
        }
        setLoadingApi(false);
    }

    return (
        <Modal
            title={create ? t('orders.newOrder.contents.shippingDocumentCreate') : t('orders.newOrder.contents.shippingDocumentUpdate')}
            visible={amDocumentModalVisible}
            onCancel={() => setAMDocumentModalVisible(false)}
            onOk={handleOk}
            okButtonProps={{ className: 'btn-link-filled', type: 'default' }}
            cancelButtonProps={{ className: 'btn-primary' }}
            centered
            width={800}
        >
            {loadingApi ? (
                <Row justify="center" align="middle" >
                    <Col>
                        <Spin size="large" />
                    </Col>
                </Row>
            ) : (
                <Form name="formulario" form={form} {...formItemLayout} onFinish={onFinish} className="text-align-left form-padding-top">
                    <Item label={t('orders.newOrder.contents.input3')} name="document_id" rules={[{ required: true }]}>
                        <Input
                            name="document_id" disabled={!create}
                            placeholder={t('orders.newOrder.contents.input3')}
                        />
                    </Item>
                    <Divider className="divider-margin" orientation="left" />
                    <Col xs={24} sm={24} md={24}>
                        <Item label={t('orders.newOrder.contents.input2')} name="shipping_type" rules={[{ required: true }]}>
                            <Select name="shipping_type" defaultValue="" style={{ width: '100%' }}>
                                {Object.entries(shippingTypes).map(entry => 
                                    <Select.Option key={entry[0]} value={entry[1]}>{entry[1]}</Select.Option>
                                )}
                            </Select>
                        </Item>
                    </Col>
                    <Divider className="divider-margin" orientation="left" />
                    <Col xs={24} sm={24} md={24}>
                        <Item label={'Link'} name="document_link" rules={[{ required: true }]}>
                            <Input
                                name="document_link"
                                placeholder={t('documents.link')}
                            />
                        </Item>
                    </Col>
                    <Divider className="divider-margin" orientation="left" />
                    <Col xs={24} sm={24} md={24}>
                        <Item label={t('orders.newOrder.contents.input4')} name="container" rules={[{ required: true }]}>
                            <Input style={{ width: '50%' }}
                                name="container"
                                placeholder={'Número'}
                            />
                        </Item>
                    </Col>
                </Form>
            )}
        </Modal>
    );
}

export default React.memo(AMDocumentModal);