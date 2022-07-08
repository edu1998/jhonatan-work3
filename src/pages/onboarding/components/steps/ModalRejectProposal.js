import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, Modal, Row, Spin } from 'antd';
import 'antd/dist/antd.css';
import partnerApi from '../../../../api/partner';
import orderApi from '../../../../api/order';
import { openNotification } from '../../../../components/Toastr';
import { getErrorMessage } from '../../../../api/api';
import { listingStates } from '../../../../utils/const.js';

const ModalRejectProposal = ({ remakeModalVisible, updateStep,  setRemakeModalVisible, formItemLayout, partnerId, listingId, setMyOrder, step, orderId, goBack, setGoBack, setSuccessfullyReverted }) => {

    const { t } = useTranslation();

    const [loadingRejectProposal, setLoadingRejectProposal] = useState(false);
    const [form] = Form.useForm();

    const handleOk = () => {
        form.submit();
    }

    const onFinish = async (fields) => {
        // SEND TO API REJECT WITH COMMENT
        setLoadingRejectProposal(true);
        if (listingId) {
            await partnerApi.rejectProposal(partnerId, listingId, { step: step, message: fields.rejectMessage })
                .then((response) => {
                    openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                    updateStep([{...step, state: listingStates.PENDING_LAP}]);
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
        } else if (orderId) {
            if (goBack) {
                setLoadingRejectProposal(true);
                await orderApi.goBack(orderId, { message: fields.rejectMessage })
                    .then((response) => {
                        setSuccessfullyReverted(true);
                    })
                    .catch((error) => {
                        openNotification({ status: false, content: getErrorMessage(error) });
                    })
                setLoadingRejectProposal(false);
                setGoBack(false);
            } else {
                await orderApi.rejectProposal(orderId, { message: fields.rejectMessage })
                    .then((response) => {
                        openNotification({ status: true, content: t('onboarding.sentSuccessfully') });
                        updateStep([{step: step, state: listingStates.PENDING_LAP}]);                       
                    })
                    .catch((error) => {
                        openNotification({ status: false, content: getErrorMessage(error) });
                    });
            }
        }
        setLoadingRejectProposal(false);
        setRemakeModalVisible(false);
    }

    return (
        <Modal
            title={t('onboarding.rejectProposal')}
            visible={remakeModalVisible}
            onCancel={() => setRemakeModalVisible(false)}
            onOk={handleOk}
            okButtonProps={{ className: 'btn-link-filled', type: 'default' }}
            cancelButtonProps={{ className: 'btn-primary' }}
            centered
            width={800}
        >
            {loadingRejectProposal ? (
                <Row justify="center" align="middle" >
                    <Col>
                        <Spin size="large" />
                    </Col>
                </Row>
            ) : (
                <Form name="formulario" form={form} {...formItemLayout} onFinish={onFinish} className="text-align-left form-padding-top">
                    <Form.Item label={t('onboarding.rejectMessage')} className="input-form-margin-bottom" name="rejectMessage" rules={[{ required: true }]}>
                        <Input.TextArea name="rejectMessage" rows={10} />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
}

export default React.memo(ModalRejectProposal);