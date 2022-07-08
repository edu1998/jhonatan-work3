import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Modal, Row, Spin, Divider, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import orderDocumentsApi from '../../../api/order-documents';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import { shippingTypes, formItemLayout } from '../../../utils/const';
import s3Api from '../../../api/aws-s3';
import orderApi from '../../../api/order';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

const types = ['OTHER',
    'AMAZON_PRODUCT_LABEL',
    'AMAZON_BOX_LABEL',
    'FEDEX_BOX_LABEL',
    'COMMERCIAL_INVOICE',
    'ORIGIN_CERTIFICATE',
    'PRIOR_NOTICE'
]

const AMDocumentModal = ({ modalVisible, orderId, setModalVisible, getAllDocuments }) => {

    const { t } = useTranslation();
    const [saving, setSaving] = useState(false);
    const [files, setFiles] = useState([]);

    const [form] = Form.useForm();

    const handleOk = () => {
        form.submit();
    }

    const onFinish = async (fields) => {
        setSaving(true);
        try {
            let {data} = await s3Api.uploadOrderDocument(orderId, files[0].originFileObj);
            await orderApi.addDocument(orderId, {...fields, uuid: data.uuid, originalFileName: data.originalFileName});
            form.resetFields();
            getAllDocuments();
            setModalVisible(false);
            setFiles([]);
            setSaving(false);
        } catch (e) {
            setSaving(false);
        }
        
    }

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok")
        }, 0);
    }

    const onChangeFileUpload = (changed) => {
        setFiles(changed.fileList);
        if(changed.fileList&& changed.fileList.length>0){
            form.setFieldsValue({file:"hasFile"});
        }else {
            form.setFieldsValue({file:undefined});
        }
    }

    const deleteImage = () => {

    }

    const beforeUpload = () => {

    }

    const UploadButton = () => (
        <div>
            <Spin spinning={saving}>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </Spin>
        </div>
    );

    return (
        <Modal
            title={"Agregar documento"}
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={handleOk}
            okButtonProps={{ loading:saving,  type: "primary" }}
            cancelButtonProps={{ type: 'default' }}
            centered
            width={800}
        >
            <Spin spinning={saving}>
            <Form name="formulario" form={form} {...formItemLayout} onFinish={onFinish} className="text-align-left form-padding-top">
                <Item label={"Tipo"} name="type" rules={[{ required: true }]}>
                    <Select onChange={(newType) => { form.setFieldsValue({ comment: t('orders.documents.' + newType + '.comment') }) }}>
                        {types.map((type) => {
                            return (<Option key={type} value={type} label={t('orders.documents.' + type + '.label')}>
                                {t('orders.documents.' + type + '.label')}
                            </Option>);
                        })}
                    </Select>
                </Item>
                <Item label={"Comentario"} name="comment" rules={[{ required: false }]}>
                    <TextArea rows={4} />
                </Item>
                <Divider className="divider-margin" orientation="left" />
                <Col xs={24} sm={24} md={24}>
                <Item label={"Documento"} name="file" rules={[{ required: true }]}>
                <Upload
                        maxCount={1} 
                        customRequest={dummyRequest}
                        onChange={(changed) => { onChangeFileUpload(changed) }}
                        onRemove={(file) => deleteImage(file)}
                        listType="picture-card"
                        beforeUpload={(file) => { return beforeUpload(file) }}
                        fileList={files}
                    >
                        {files.length===0 && <UploadButton />}
                    </Upload>
                </Item>

                </Col>
            </Form>
            </Spin>
        </Modal>
    );
}

export default React.memo(AMDocumentModal);