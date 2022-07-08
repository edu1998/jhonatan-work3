import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Comment, Form, Input, Modal, Badge, Tooltip } from 'antd';
import { CheckCircleFilled, RightOutlined, SyncOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useForm } from 'antd/lib/form/Form';
import supportAPI from '../../../../api/support';
import { openNotification } from '../../../../components/Toastr';
import { getErrorMessage } from '../../../../api/api';

const {TextArea} = Input;
const SupportRequests = ({ supportRequests, setSupportRequests, listingId }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);

    const [modalVisible, setModalVisible] = useState(false)
    const [activeCount, setActiveCount] = useState(0)
    const [editing, setEditing] = useState();
    const [saving, setSaving] = useState(false);

    const toggleModal = () => {
        if (modalVisible) {
            setModalVisible(false);
        } else {
            setModalVisible(true);
        }
    }

    useEffect(() => {
        if(supportRequests){
            setActiveCount(supportRequests.filter(sr => sr.isActive).length);
        }
    }, [supportRequests])

    if (!supportRequests || supportRequests.length === 0) {
        return null;
    }

    const saveLapMessage = async (values)=> {
        setSaving(true);
        const objectToInsert = { lapMessage: values.lapMessage, requestId: supportRequests[editing].id, listingId: listingId };
        await supportAPI.reply(objectToInsert)
            .then((result) => {
                let newRequests = supportRequests.map((sr, idx)=> {
                    if(editing === idx){
                        sr.isActive = false;
                        sr.updatedAt = new Date();
                        sr.lapMessage = values.lapMessage;
                    }
                    return sr;
                });
                setSupportRequests(newRequests);
                setSaving(false);
                setEditing(undefined);
            })
            .catch((error) => {
                setSaving(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    }

    const Editor = ({ }) => (
        <Form onFinish={saveLapMessage}>
          <Form.Item name={"lapMessage"}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" loading={saving} type="primary">
              Resolver solicitud
            </Button>
          </Form.Item>
        </Form>
      );

    return (
        <>
            <Badge count={activeCount}>
                <Button type="dashed" onClick={toggleModal}>Soporte</Button>
            </Badge>
            <Modal visible={modalVisible} onCancel={()=>{setModalVisible(false)}} onOk={()=>setModalVisible(false)}>
                <Row>
                    <Col span={24}>
                    
                        {supportRequests?.map((req, idx) => {
                            return <Comment
                                actions={ editing != idx && req.isActive && session.userInfo.isAdmin ? [<Button type="link" onClick={()=>{setEditing(idx)}}>Responder</Button>]:[]}
                                author={<a>{session.userInfo.role !== 'Admin' ? session.userInfo.name : t('onboarding.tab1')}</a>}
                                datetime={
                                    <Tooltip title={moment(req.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                                      <span>{moment(req.createdAt).fromNow()}</span>
                                    </Tooltip>
                                  }
                                content={
                                    <p>
                                        {req.clientMessage}
                                    </p>
                                }
                            >
                                {editing === idx && <Editor />}
                                {req.lapMessage &&
                                    <Comment
                                        author={<a>LAP</a>}
                                        datetime={
                                            <Tooltip title={moment(req.updatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                                              <span>{moment(req.updatedAt).fromNow()}</span>
                                            </Tooltip>
                                          }
        
                                        content={
                                            <p>
                                                {req.lapMessage}
                                            </p>
                                        }
                                    >
                                    </Comment>}
                            </Comment>
                        })}

                    </Col>
                </Row>

            </Modal>
        </>
    );
}

export default SupportRequests;