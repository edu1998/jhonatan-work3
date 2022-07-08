import React, { useEffect, useState } from 'react';
import {
    Row, Col, Divider, Input, Spin, Modal
} from 'antd';
import {
    ExclamationCircleOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import 'antd/dist/antd.css';
import '../../onboarding/onboarding.css';
import orderApi from '../../../api/order';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import { orderGeneralStates } from '../../../utils/const';

const StateChangeModal = ({ orderId, state, modalStateChangeVisible, setModalStateChangeVisible, setSuccessfullyChanged, nextState }) => {

    const { t } = useTranslation();

    const [idAmazon, setIdAmazon] = useState('');
    const [additionalNoteStateChange, setAdditionalNoteStateChange] = useState('');
    const [loadingStateChange, setLoadingStateChange] = useState(false);

    const handleChangeStateOk = async () => {
        if (nextState === orderGeneralStates.SHIPPED && !idAmazon) {
            openNotification({ status: false, content: 'Debe ingresar el id de amazon' });
        } else {
            setLoadingStateChange(true);
            await orderApi.changeState(orderId, { state: nextState, note: additionalNoteStateChange, idAmazon: idAmazon })
                .then((response) => {
                    openNotification({ status: true, content: 'State changed successfully' });
                    setIdAmazon('');
                    setAdditionalNoteStateChange('');
                    setSuccessfullyChanged(true);
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
            setLoadingStateChange(false);
            setModalStateChangeVisible(false);
        }
    }

    return <>
        <Modal
            title={t('orders.newOrder.changeStateModal.title')}
            centered
            width={500}
            visible={modalStateChangeVisible}
            onOk={handleChangeStateOk}
            onCancel={() => setModalStateChangeVisible(false)}
            cancelText={t('orders.newOrder.table.modal.buttonCancel')}
            okText={t('orders.newOrder.table.modal.buttonUpdate')}
        >
            <Row style={{ justifyContent: 'center' }}>
                <Col style={{ textAlign: 'center' }}>
                    {!loadingStateChange ? <>
                        <Row style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', width: '100%' }}>
                                <ExclamationCircleOutlined style={{ textAlign: 'center', color: '#E8833A', fontSize: '40px', alignSelf: 'center', marginRight: '20px', marginLeft: '20px' }} />
                                <Col style={{ marginRight: '20px' }}>
                                    <span style={{ display: 'block', textAlign: 'center', fontWeight: 'bold' }}>CAMBIO DE ESTADO</span>
                                    <span style={{ color: '#E8833A' }}>{state? state.toUpperCase() : "No state"} <ArrowRightOutlined /> {nextState?.toUpperCase()}</span>
                                </Col>
                            </div>
                        </Row>
                        <Divider className="divider-margin" orientation="left" style={{ backgroundColor: '#E8833A' }} />
                        {nextState === orderGeneralStates.SHIPPED &&
                            <Row>
                                <span>ID Amazon</span>
                                <Input onChange={(event) => setIdAmazon(event.currentTarget.value)} />
                            </Row>
                        }
                        <Row>
                            <span>Nota opcional</span>
                            <Input.TextArea onChange={(event) => setAdditionalNoteStateChange(event.currentTarget.value)} />
                        </Row>
                    </> :
                        <Row justify="center" align="middle" style={{ zIndex: "100000" }} >
                            <Col>
                                <Spin style={{ zIndex: "100000" }} size="large" />
                            </Col>
                        </Row>
                    }
                </Col>
            </Row>
        </Modal>


    </>
}

export default React.memo(StateChangeModal);