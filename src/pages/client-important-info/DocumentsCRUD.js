import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'antd/dist/antd.css';
import { Modal, Spin } from 'antd';
import { FolderOpenFilled, PlaySquareFilled, FileTextFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import partnerAPI from '../../api/partner';
import { openNotification } from '../../components/Toastr';
import { getErrorMessage } from '../../api/api';

import './documentsCRUD.css';
import DocumentsCRUDList from './components/DocumentsCRUDList';
import { documentTypes } from '../../utils/const';

export const sortPinned = (dataSource) => {
    const ordered = dataSource.filter((element) => !element.pinned);
    const pinned = dataSource.find((element) => element.pinned);
    if (pinned) {
        ordered.unshift(pinned);
    }
    return ordered;
}

const DocumentsCRUD = ({ visible, setVisible, partner }) => {

    const { t } = useTranslation();

    const [videos, setVideos] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [dataPartner, setDataPartner] = useState([]);
    const [competitorsFile, setCompetitorsFile] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [hasMoreVideos, setHasMoreVideos] = useState(true);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [hasMoreDocuments, setHasMoreDocuments] = useState(true);
    const [directionUrl, setDirectionUrl] = useState(true);
    const [change, setChange] = useState(0);
    const session = useSelector(store => store.Session.session);

    
    useEffect(() => {
        if (partner) {
            setDocuments([]);
            setVideos([]);
            setLoading(true);
            partnerAPI.getAllDocuments(partner)
                .then((documents) => {
                    const competitorFile = documents.data.find((doc) => doc.documentType === documentTypes.competitors);
                    setCompetitorsFile(competitorFile);
                    const videos = documents.data.filter((doc) => doc.documentType === documentTypes.video);
                    if (videos && videos.length > 0) {
                        setVideos(sortPinned(videos));
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
            console.log(partner, 'buscando partner')
            partnerAPI.findByIdPartner(partner)
                .then((partnerData) => {
                    setDataPartner([partnerData.data])
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    openNotification({ status: false, content: getErrorMessage(error) });
                });          
        }
    }, [partner, change]);
    
    const handleOk = () => {

    };

    const handleCancel = () => {
        setVisible(false);
    };

    let clientName = 'Cliente test';

    const handleInfiniteOnLoadVideos = () => {
        // if (!loadingVideos) {
        //     if (videos.length >= 5) {
        //         setHasMoreVideos(false);
        //         setLoadingVideos(false);
        //         return;
        //     } else {
        //         setLoadingVideos(true);
        //         setTimeout(() => {
        //             setLoadingVideos(false);
        //             setVideos((prevState) => (prevState.concat(hardcodedVideos)));
        //         }, 3000);
        //     }
        // }
    };

    const handleInfiniteOnLoadDocuments = () => {
        // if (!loadingDocuments) {
        //     setLoadingDocuments(true);
        //     if (documents.length >= 5) {
        //         setHasMoreDocuments(false);
        //         setLoadingDocuments(false);
        //         return;
        //     } else {
        //         setTimeout(() => {
        //             setLoadingDocuments(false);
        //             setDocuments((prevState) => (prevState.concat(hardcodedVideos)));
        //         }, 3000);
        //     }
        // }
    };

    return (
        <Modal title={`${clientName} - ${t('documents.modalTitle')}`} width='750px' visible={visible} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <div className="document-modal-content">
                {loading ? (
                    <div className="generic-spinner">
                        <Spin />
                    </div>
                ) : (
                    <>
                        <div>
                            <DocumentsCRUDList sortPinned={sortPinned} isURL={false} title={t('documents.videoTitle')} titleIcon={<FolderOpenFilled className="document-card-title-icon"/>} handleInfiniteOnLoad={handleInfiniteOnLoadVideos} hasMore={hasMoreVideos} loading={loadingVideos} dataSource={videos} setDataSource={setVideos} icon={<PlaySquareFilled className="document-video-icon" />} documentType={documentTypes.video} partnerId={partner} />
                        </div>
                        <div className="document-card-container">
                            <DocumentsCRUDList sortPinned={sortPinned} isURL={false} title={t('documents.textTitle')} titleIcon={<FolderOpenFilled className="document-card-title-icon"/>} handleInfiniteOnLoad={handleInfiniteOnLoadDocuments} hasMore={hasMoreDocuments} loading={loadingDocuments} dataSource={documents} setDataSource={setDocuments} icon={<FileTextFilled className="document-document-icon" />} documentType={documentTypes.text} partnerId={partner} competitorsFile={competitorsFile} setCompetitorsFile={setCompetitorsFile} />
                        </div>
                        <div className="document-card-container">
                            <DocumentsCRUDList
                                isURL={directionUrl}
                                sortPinned={sortPinned}
                                btnSuccess={false}
                                title={'URL'}
                                titleIcon={<FolderOpenFilled className="document-card-title-icon"/>}
                                handleInfiniteOnLoad={handleInfiniteOnLoadDocuments}
                                hasMore={hasMoreDocuments}
                                loading={loadingDocuments}
                                dataSource={dataPartner}
                                change={change}
                                setChange={setChange}
                                setDataSource={setDataPartner}
                                icon={<FileTextFilled className="document-document-icon" />}
                                documentType={documentTypes.text}
                                partnerId={partner}
                                competitorsFile={competitorsFile}
                                setCompetitorsFile={setCompetitorsFile} />
                        </div>
                    </>    
                )}
            </div>
        </Modal>
    );
}

export default React.memo(DocumentsCRUD);