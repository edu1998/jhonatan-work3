import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, Row, Col, Spin, Statistic, Button, Modal, Space } from 'antd';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { FileTextFilled, LeftOutlined, UnorderedListOutlined, ExportOutlined, PlusOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons';
import serverStatus from '../../api/serverStatus';

export const ServerStatus = () => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    const history = useHistory();
    const [serverStatusData, setServerStatus] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState();

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
  
    useEffect(()=>{
        getServerStatus();
    }, [])

    const getServerStatus = ()=> {
        serverStatus.getServerStatus().then(resp => {
            setServerStatus(resp.data);
        })
        setTimeout(() => {
            getServerStatus();
        }, 5000);
    }

    const clearTasksForThread = (i) => {
        serverStatus.clearTaskForThread(i).then(resp => {
            setServerStatus(resp.data);
        })
    }

    const clearTasks = () => {
        serverStatus.clearTasks().then(resp => {
            setServerStatus(resp.data);
        })
    }

    const skipTaskForThread = (i)=> {
        serverStatus.skipTaskForThread(i).then(resp => {
            setServerStatus(resp.data);
        })
    }

    const skipTasks = ()=> {
        serverStatus.skipTasks().then(resp => {
            setServerStatus(resp.data);
        })       
    }

    const syncOrders = ()=> {
        serverStatus.testSync().then(resp => {
        })       
    }

    return (
        <PageHeader extra={<Space>
                                <Button type="link" danger onClick={()=>{skipTasks()}}>Saltar tarea para todos</Button>
                                <Button type="primary" danger onClick={()=>{clearTasks()}}>Limpiar tareas para todos</Button>
                                <Button type="dashed" onClick={()=>{syncOrders()}}>Sincronizar ordenes</Button>
        </Space>} title={'Estado del Servidor'} onBack={() => { history.push("/") }}>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>{JSON.stringify(currentTask, null, 2)}</p>
            </Modal>            
            {
                serverStatusData.map((data,i)=> {
                    return (
                        <Row>
                            <Col span={4}>
                                <Statistic title="Procesando" value={data.processing? 'Sí':'No'} prefix={<Spin spinning={data.processing}></Spin>} />
                            </Col>
                            <Col span={4}>
                                <Statistic title="Tareas por procesar" value={data.queue} />
                            </Col>
                            <Col>
                                { data.currentTask? <Button onClick={()=>{showModal(data.currentTask)}}>Ver tarea</Button>:null}
                                <Button type="link" danger onClick={()=>{skipTaskForThread(i)}}>Saltar tarea</Button>
                                <Button type="primary" danger onClick={()=>{clearTasksForThread(i)}}>Limpiar tareas</Button>
                            </Col>
                        </Row>           
                    );
                })
            }
        </PageHeader>
    )
}
