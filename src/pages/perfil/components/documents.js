import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Button, Card, Spin, List } from 'antd';
import { PlaySquareOutlined, FolderOpenOutlined, YoutubeOutlined, FilePptOutlined } from '@ant-design/icons';
import Introduction from './Introduction';
import { sortPinned } from '../../client-important-info/DocumentsCRUD';
import { documentTypes } from '../../../utils/const';
import { openNotification } from '../../../components/Toastr';
import ModalViewVideo from './ModalViewVideo'
import { getErrorMessage } from '../../../api/api';

import partnerAPI from '../../../api/partner';

const Documents = ({ }) => {

    const [videos, setVideos] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [competitorsFile, setCompetitorsFile] = useState({});
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataVideo, setDataVideo] = useState({});
    const [codeVideo, setCodeVideo] = useState('')

    const session = useSelector(store => store.Session.session);

    useEffect(() => {
        getAllDocuments(session.userInfo.partner_id[0]);
    }, []);

    const openModalView = (video) => {
        CodeVideo(video)
        setDataVideo({data: video, code: codeVideo, show: true})
        setIsModalVisible(true)
    }

    const CodeVideo = (data) => {
        if(data.link){
          let url = data.link
          let code = url.split('=')
          setCodeVideo(code[1])
        }
    }    

    const getAllDocuments = async (partner) => {
        setLoading(true);
        await partnerAPI.getAllDocuments(partner)
            .then((documents) => {
                const competitorFile = documents.data.find((doc) => doc.documentType === documentTypes.competitors);
                setCompetitorsFile(competitorFile);
                const vids = documents.data.filter((doc) => doc.documentType === documentTypes.video);
                if (vids && vids.length > 0) {
                    setVideos(sortPinned(vids));
                }
                const documentos = documents.data.filter((doc) => doc.documentType === documentTypes.text);
                if (documentos && documentos.length > 0) {
                    setDocuments(sortPinned(documentos));
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            });
    };

    return !loading ? (
        <>
        <Row className="home-support-parent">
            <Col span={24} xs={24} sm={24} md={24}>
                <Card className="home-support-card">        
                    <Row>
                      <Col span={8} md={6} >
                        <div className="home-listing-card-content">
                          <Col>
                            <div className="home-listing-card-content">
                              <div style={{ textAlign: 'left' }}>
                              <span className="home-listing-title" style={{ fontSize: '22px', marginTop: '10px' }} >
                                <FolderOpenOutlined className="home-document-card-icon btn-primary" />
                                <span style={{ marginLeft: 10 }}>Documentos</span>
                              </span>
                              </div>
                              <span className="home-listing-title-description">
                                Aqui podrás visualizar todos tus documentos
                              </span>
                            </div>
                          </Col>
                        </div>
                      </Col>
                    </Row>         
                    <Row style={{ marginTop: 30 }}>
                        <ModalViewVideo
                            data={dataVideo}
                            code={codeVideo}
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}/>
                        <Introduction />
                        <Col span={10} xs={24} sm={10} md={10}>
                            <Card className="home-document-card">
                                <div className="home-document-card-header">
                                    <h3><PlaySquareOutlined className="home-document-card-icon btn-primary" />LAP Academy</h3>
                                    <p className="home-document-title-description">Videos explicativos y tutoriales paso a paso.</p>
                                </div>
                                <List style={{ overflowY: 'scroll', height: 200 }}
                                    dataSource={videos}
                                    size="small"
                                    renderItem={(video, index) => (
                                        <>
                                            <List.Item key={video.id}>
                                                <List.Item.Meta
                                                    avatar={<YoutubeOutlined className="home-document-video-icon" />}
                                                    title={<a onClick={() => openModalView(video)} href="#">{video.name}</a>}
                                                    description=""
                                                />
                                            </List.Item>
                                        </>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col span={10} xs={24} sm={10} md={10}>
                            <Card className="home-document-card">
                                <div>
                                    <div className="home-document-card-header">
                                        <h3><FolderOpenOutlined className="home-document-card-icon btn-primary" />Documentos</h3>
                                        <p className="home-document-title-description">Carpeta compartida entre tu empresa y LAP.</p>
                                    </div>
                                    {competitorsFile.link!=='' && (
                                        <p className="home-document-competitor">
                                            <FilePptOutlined className="home-document-text-icon" />
                                                <Button type="link" className="btn-link home-document-competitor-button" href={competitorsFile.link} 
                                                    target="blank" 
                                                >
                                                {competitorsFile.name}
                                                </Button>
                                        </p>
                                    )}
                                </div>
                                <List style={{ overflowY: 'scroll', height: 150 }}
                                    dataSource={documents}
                                    size="small"
                                    renderItem={(document, index) => (
                                        <>
                                            <List.Item key={document.id}>
                                                <List.Item.Meta
                                                    avatar={<YoutubeOutlined className="home-document-video-icon" />}
                                                    title={<a onClick={() => openModalView(document)} href="#">{document.name}</a>}
                                                    description=""
                                                />
                                            </List.Item>
                                        </>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        </>
    ) : (
        <div className="generic-spinner">
            <Spin />
        </div>
    );
}

export default React.memo(Documents);