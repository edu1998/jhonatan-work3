import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Divider, Input, Button, Spin, Form, Comment, Tooltip, Avatar } from 'antd';
import { UpOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';

import { orderGeneralStates } from '../../../utils/const';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import orderApi from '../../../api/order';
import { useForm } from 'antd/lib/form/Form';

const Notes = ({ orderId, tab, step, state }) => {

    const { t, i18n } = useTranslation();
    const [form] = useForm();
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [loadingAddNote, setLoadingAddNote] = useState(false);
    const [noteToAdd, setNoteToAdd] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [notes, setNotes] = useState([]);

    const session = useSelector(store => store.Session.session);

    useEffect(() => {
        moment.locale(i18n.language);
        getNotes();
    }, []);

    const getNotes = async () => {
        setLoadingNotes(true);
        await orderApi.getNotes(orderId)
            .then((response) => {
                setNotes(response.data);
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingNotes(false);
    }

    const handleAddNote = async (values) => {
        setLoadingAddNote(true);
        await orderApi.saveNote(orderId, { step: step.step, message: values.noteToAdd })
            .then((response) => {
                setNotes((prevState) => {
                    return [
                        {
                            author: session.userInfo.name,
                            createdAt: new Date(),
                            message: values.noteToAdd
                        },
                        ...prevState
                    ];
                });
                form.resetFields();
                openNotification({ status: true, content: 'Note added successfully' });
            })
            .catch((error) => {
                openNotification({ status: false, content: getErrorMessage(error) });
            });
        setLoadingAddNote(false);
    }

    return (
        <Spin spinning={loadingNotes || loadingAddNote}>
            <Form form={form} onFinish={handleAddNote}>
                <Row>
                    <Col xs={24} sm={24} md={24} >
                        <Row>
                            <Col xs={2}>
                                <span>Notas:</span>
                            </Col>
                            <Col xs={22} sm={22} md={22}>
                                <Form.Item name="noteToAdd" rules={[{ required: true, message: "El campo es requerido" }]}>
                                    <Input.TextArea
                                        rows={2}
                                        name="noteToAdd" disabled={state !== orderGeneralStates.DRAFT}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            <Col xs={12} sm={12} md={12} style={{ textAlign: 'left' }} >
                                <Button type="link" onClick={() => setShowNotes(!showNotes)}>
                                    {!showNotes ? <DownOutlined style={{ color: '#5365E3' }} /> : <UpOutlined style={{ color: '#5365E3' }} />} Ver todos
                                </Button>
                            </Col>
                            <Col xs={12} sm={12} md={12} style={{ textAlign: 'right' }} >
                                <Button loading={loadingAddNote} className="btn-basic-green" htmlType="submit" disabled={state !== orderGeneralStates.DRAFT}>
                                    {t('orders.buttonSave')}</Button>
                            </Col>
                        </Row>
                        {showNotes &&
                            <>
                                <div style={{ marginTop: 20 }}>
                                    <Divider className="divider-margin" orientation="left" />
                                    {notes?.map((item, index) => (
                                        <Row key={index}>
                                            <Col span={24}  >
                                                <Comment
                                                    author={<a>{item.author}</a>}
                                                    avatar={<Avatar>{item.author.split(" ").map((n)=>n[0]).join(" ")}</Avatar>}
                                                    content={
                                                        <p style={{width:'100%', textAlign:'left'}}>
                                                           {item.message}
                                                        </p>
                                                    }
                                                    datetime={
                                                        <Tooltip title={moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                                                            <span>{moment(item.createdAt).fromNow()}</span>
                                                        </Tooltip>
                                                    }
                                                />
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            </>
                        }
                    </Col>
                </Row>
            </Form>
        </Spin>
    )
}

export default React.memo(Notes);