import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Row, Col, Spin, Statistic, Button, Modal, Space } from 'antd';
import { useSelector } from 'react-redux';
import Listing from './components/Listing';
import partnerApi from '../../api/partner';
import { Link, useHistory } from 'react-router-dom';
import { FileTextFilled, LeftOutlined, UnorderedListOutlined, ExportOutlined, PlusOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import serverStatus from '../../api/serverStatus';

const OnboardingIndex = () => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    const history = useHistory();
    const [serverStatusData, setServerStatus] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState();
    const [profileCompleted, setProfileCompleted] = useState(true);

    const showModal = (currentTask) => {
        setCurrentTask(currentTask);
      setIsModalVisible(true);
    };
  
    const handleOk = () => {
      setCurrentTask(undefined);
      setIsModalVisible(false);
    };
  
    const handleCancel = () => {
      setCurrentTask(undefined);
      setIsModalVisible(false);
    };
  

    return (
        <PageHeader title={' '} onBack={() => { history.push("/") }}>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>{JSON.stringify(currentTask, null, 2)}</p>
            </Modal>
            <Row className="account-status">
                <Col span={24}>
                    <Listing profileCompleted={profileCompleted} />
                </Col>
            </Row>            
        </PageHeader>
    )
}


export default OnboardingIndex