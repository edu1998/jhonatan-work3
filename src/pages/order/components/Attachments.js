import { Col, Divider, Popconfirm, Row, Tabs, Form, Input, Button, Select, Switch, Tooltip, Table, Skeleton, ConfigProvider, Space, Collapse, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { DownloadOutlined, PlusOutlined, DeleteOutlined, CheckOutlined, InfoCircleTwoTone } from '@ant-design/icons';
import useAttachments from '../hooks/useAttachments';
import { useSelector } from 'react-redux';
import { orderGeneralStates } from '../../../utils/const';
import { documentTypes } from '../../../utils/const';
import moment from 'moment';
import s3Api from '../../../api/aws-s3';
import orderAPI from '../../../api/order';

import AddDocumentModal from './AddDocumentModal';

const { Option } = Select;
const { Item } = Form;
const { Panel } = Collapse;
const { Text, Title } = Typography;

export const Attachments = ({ partnerId, orderId, state, sentType }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    const [showModal, setShowModal] = useState(false);

    const {
        loading,
        documents,
        getAllDocuments
    } = useAttachments({ orderId, partner: partnerId });

    const handleAddDocument = () => {
        setShowModal(true);
    }

    const downloadDocument = async (document) => {
        let { data } = await s3Api.getOrderDocumentDownloadUrl(orderId, document.id, document)
        window.open(data.url);
    }

    const deleteDocument = async (document) => {
        await orderAPI.deleteDocument(orderId, document.id);
        getAllDocuments();
    }


    const documentsColumns = [
        {
            title: 'TIPO',
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => <>{t('orders.documents.' + text + '.label')}</>
        },
        {
            title: 'COMENTARIO',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'CREADO POR',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (text, record) => <>{record.createdBy}</>
        },
        {
            title: '',
            key: 'actions',
            dataIndex: 'actions',
            width: 100,
            render: (text, record, index) => (
                <Space>
                    <Popconfirm
                        title="¿Está seguro de eliminar este documento?"
                        onConfirm={()=> {deleteDocument(record)}}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="ghost" danger icon={<DeleteOutlined />}></Button>
                    </Popconfirm>
                    <Button type="primary" onClick={() => { downloadDocument(record) }} icon={<DownloadOutlined />}></Button>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Row justify="space-between">
                <Col span="12" >
                <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
                    <h2 className="title-primary">
                        {t('orders.newOrder.contents.subtitle3')}{' '}
                    </h2>
                    <span className="text-color-gray">{t('orders.newOrder.contents.subtitleDescription3')} </span>
                    </div>
                    <div className="justifiContentAttachments">
                    </div>                                                 
                </Col>
                <Col span={2} >
                    <Button icon={<PlusOutlined />} onClick={handleAddDocument}>{t('orders.buttonAdd')}</Button>
                </Col>
            </Row>
            <Row justify="space-between" className="text-align-left">
                <Col span={24}>
                    {
                        !sentType ?                
                        <Collapse defaultActiveKey={['0']} ghost className="measures-collapse">
                            <Panel header={t('onboarding.measuresAndPrices.help')} key="1">
                                <Row className="measures-help-container">
                                    <Col className="measures-help-card">
                                        <Title level={5} style={{ color: '#8DD7CF' }}>Etiqueta Producto Amazon</Title>
                                        <Row className="measures-help-details">
                                            <Col className="measures-help-details-item">
                                                <Text className="measures-help-details-item-text ">Pegar una en cada producto, tapando/retirando los otros códigos de barra.
                                                Identificación: Revisar códigos FNSKU en la orden de compra.</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Row className="measures-help-card">
                                        <Title level={5} style={{ color: '#D3475D' }}>Etiqueta Caja Amazon</Title>
                                        <Col className="measures-help-details">
                                            <Row>
                                                <Col className="measures-help-details-item">
                                                    <Text className="measures-help-details-item-text ">Pegar una al costado de la caja.
                                                    Identificación: Revisar códigos SKU en la orden de compra.</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="measures-help-card">
                                        <Title level={5} style={{ color: '#E88544' }}>Etiqueta Caja FedEX</Title>
                                        <Col className="measures-help-details">
                                            <Row>
                                                <Col className="measures-help-details-item">
                                                    <Text className="measures-help-details-item-text ">Solicitar una ventana adhesiva (sobre transparente) al recolector y pegarla en la caja 1 para documentos.</Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 1 Amazon - Ventana:</strong> Página 2, 3 y 4 + Commercial Invoice (x4) + <span className="spanTextAlertAttachments">Certificado de Origen (para productos chilenos) + Prior Notice (para productos regidos por la FDA)</span></span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 2 Amazon - Pegar Etiqueta:</strong> Página 5 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 3 Amazon - Pegar Etiqueta:</strong> Página 6 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 4 Amazon - Pegar Etiqueta:</strong> Página 7 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 5 Amazon - Pegar Etiqueta:</strong> Página 8 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 6 Amazon - Pegar Etiqueta:</strong> Página 9  </span><br/><span>
                                                    Y así sucesivamente hasta la última caja. </span></Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Row>
                            </Panel>
                        </Collapse>
                        :
                        <Collapse defaultActiveKey={['0']} ghost className="measures-collapse">
                            <Panel header={t('onboarding.measuresAndPrices.help')} key="1">
                                <Row className="measures-help-container">
                                    <Col className="measures-help-card">
                                        <Title level={5} style={{ color: '#8DD7CF' }}>Etiqueta Producto Amazon</Title>
                                        <Row className="measures-help-details">
                                            <Col className="measures-help-details-item">
                                                <Text className="measures-help-details-item-text ">Pegar una en cada producto, tapando/retirando los otros códigos de barra.
                                                Identificación: Revisar códigos FNSKU en la orden de compra.</Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Row className="measures-help-card">
                                        <Title level={5} style={{ color: '#D3475D' }}>Etiqueta Caja Amazon</Title>
                                        <Col className="measures-help-details">
                                            <Row>
                                                <Col className="measures-help-details-item">
                                                    <Text className="measures-help-details-item-text ">Pegar una al costado de la caja.
                                                    Identificación: Revisar numeración en la orden de compra.</Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="measures-help-card">
                                        <Title level={5} style={{ color: '#E88544' }}>Etiqueta Caja FedEX</Title>
                                        <Col className="measures-help-details">
                                            <Row>
                                                <Col className="measures-help-details-item">
                                                    <Text className="measures-help-details-item-text ">Solicitar una ventana adhesiva (sobre transparente) al recolector y pegarla en la caja 1 para documentos.</Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 1 Amazon - Ventana:</strong> Página 2, 3 y 4 + Commercial Invoice (x4) + <span className="spanTextAlertAttachments">Certificado de Origen (para productos chilenos) + Prior Notice (para productos regidos por la FDA)</span></span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 2 Amazon - Pegar Etiqueta:</strong> Página 5 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 3 Amazon - Pegar Etiqueta:</strong> Página 6 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 4 Amazon - Pegar Etiqueta:</strong> Página 7 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 5 Amazon - Pegar Etiqueta:</strong> Página 8 </span></Text>
                                                </Col>
                                                <Col className="measures-help-details-item">
                                                    <CheckOutlined className="measures-help-details-item-icon" /><Text className="measures-help-details-item-text "><span><strong>Caja 6 Amazon - Pegar Etiqueta:</strong> Página 9  </span><br/><span>
                                                    Y así sucesivamente hasta la última caja. </span></Text>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Row>
                            </Panel>
                        </Collapse>
                    }                        
            </Col>
            </Row>

            <Row>
                <Col xs={24} sm={24} md={24} >
                    <Table loading={loading} columns={documentsColumns}
                        dataSource={documents}
                        footer={() =>
                            <Col style={{ alignItems: 'flex-end', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                                <Button icon={<PlusOutlined />} onClick={handleAddDocument}>{t('orders.buttonAdd')}</Button>
                            </Col>
                        }
                    />
                </Col>
            </Row>
            <AddDocumentModal getAllDocuments={getAllDocuments} modalVisible={showModal} setModalVisible={setShowModal} orderId={orderId}></AddDocumentModal>
        </>
    )
}
