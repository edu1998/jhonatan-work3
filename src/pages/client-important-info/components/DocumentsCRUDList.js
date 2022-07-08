import React, { useEffect, useState } from 'react';

import 'antd/dist/antd.css';
import { Button, Row, Tooltip, List, Spin, Input, Popconfirm } from 'antd';
import { EditOutlined, StarOutlined, StarFilled, CloseOutlined, SaveFilled, WarningOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroller';
import { useTranslation } from 'react-i18next';

import { nameToSlug } from '../../../utils/functions';
import { documentTypes } from '../../../utils/const';
import { openNotification } from '../../../components/Toastr';
import documentAPI from '../../../api/document';
import partnerAPI from '../../../api/partner';
import { getErrorMessage } from '../../../api/api';

const competitorCustomIndex = -2;

const DocumentsCRUDList = ({ isURL, change, setChange, sortPinned, title, titleIcon, handleInfiniteOnLoad, hasMore, loading, dataSource, setDataSource, icon, documentType, partnerId, competitorsFile, setCompetitorsFile }) => {

    const { t } = useTranslation();

    const [scrollRef, setScrollRef] = useState();

    const [editingName, setEditingName] = useState('');
    const [editingLink, setEditingLink] = useState('');
    const [editingUrl, setEditingUrl] = useState('');
    const [editingUrlFinal, setEditingUrlFinal] = useState([]);
    const [confrimAlert, setConfirmAlert] = useState(false);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [pinnedIndex, setPinnedIndex] = useState(-1);
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [dataSourceUrls, setDataSourceUrls] = useState([]);

    useEffect(() => {
        if (dataSource && dataSource.length > 0) {
            if(isURL){
                if(dataSource[0].website){
                    let validData = dataSource[0].website.split('https://datastudio.google.com/embed/reporting/')
                    if(validData[0] === "") {
                        let valueArrayViejo = validData.splice(1)
                        let newData = valueArrayViejo.map((data, index) => {
                            return {
                                id: index,
                                name: index === 0 ? 'Ventas' : index === 1 ? 'Marketing' : index === 2 ? 'Reportes en vivo' : 'NameDefault',
                                url: `https://datastudio.google.com/embed/reporting/${data}`,                                
                            }
                        })
                        setDataSourceUrls(newData)
                    } else {
                        let link = new String(dataSource[0].website)
                        if(link.includes('[')){
                            let arrayBase = link.split('[')
                            let newJson = JSON.parse(`[${arrayBase[1]}`)
                            setDataSourceUrls(newJson)
                        }
                    }
                }
            }
            dataSource.forEach((element, index) => {
                if (element.pinned) {
                    setPinnedIndex(index);
                }
            })
        }
    }, [dataSource]);


    const editingUrlAll = (e) => {
        let values = {
            link: e.target.value 
        }
        setEditingUrl(values)
    }

    const onEdit = async (item, index) => {
        if (index === editingIndex) {
            let newObject = item;
            if (!editingName || !editingLink) {
                openNotification({ status: false, content: t('documents.emptyFields') });
            } else if (editingName.length < 5) {
                openNotification({ status: false, content: t('documents.titleLengthError') });
            } else if (!editingLink.match(/^(ftp|http|https):\/\/[^ "]+$/)) {
                openNotification({ status: false, content: t('documents.linkFormatError') });
            } else {
                let errorAPI = false;
                if (item.name !== editingName || item.link !== editingLink) {
                    const correctName = editingName[0].toUpperCase() + editingName.slice(1);
                    const newDocument = { ...item, name: correctName, link: editingLink, documentType: item.documentType ? item.documentType : documentType, partnerId: item.partnerId ? item.partnerId : partnerId };
                    let savedItem;
                    setLoadingAPI(true);
                    if (item.id) {
                        // UPDATE
                        await documentAPI.update(newDocument)
                            .catch((error) => {
                                errorAPI = true;
                                openNotification({ status: false, content: getErrorMessage(error) });
                            });
                    } else {
                        // SAVE
                        savedItem = await documentAPI.insert(newDocument)
                            .catch((error) => {
                                errorAPI = true;
                                openNotification({ status: false, content: getErrorMessage(error) });
                            });
                    }
                    setLoadingAPI(false);
                    if (!errorAPI)
                        newObject = savedItem ? savedItem.data : newDocument;
                    !errorAPI && openNotification({ status: true, content: t('documents.savedSuccessfully') });
                }
                if (!errorAPI) {
                    setDataSource((prevState) => {
                        const newState = prevState;
                        if (index === competitorCustomIndex) {
                            setCompetitorsFile({ ...newObject });
                        } else {
                            newState[index] = { ...newObject };
                        }
                        return [...newState];
                    });
                    setEditingIndex(-1);
                }
            }
        } else {
            clearPotentialNew();
            setEditingName(item.name);
            setEditingLink(item.link);
            setEditingIndex(index);
        }
    };

    const editWebsite = async (item, index) => {
        if(item.id) {
            setEditingName(item.name)
            setEditingUrl(item.url)
        } else {
            setEditingName('')
            setEditingUrl('')
        }
        if (index === editingIndex) {
            if (!editingName || !editingUrl) {
                openNotification({ status: false, content: t('documents.emptyFields') });
            } else if (editingName.length < 5) {
                openNotification({ status: false, content: t('documents.titleLengthError') });
            } else if (!editingUrl.match(/^(ftp|http|https):\/\/[^ "]+$/)) {
                openNotification({ status: false, content: t('documents.linkFormatError') });
            } else {
                let dataUrlFinal = dataSourceUrls.map((element, i) => {
                    if (i === index) {
                        return {
                            id: index,
                            name: editingName,
                            url: editingUrl,
                        }
                    }
                    return element
                })
                let newObject = item;

                // MANEJANDO ERROR DE PARNER
                let savedItem;
                let errorAPI = false;
                let partnerActive = await partnerAPI.findByIdPartner(dataSource[0].id)
                    .catch((error) => {
                        errorAPI = true;
                        openNotification({ status: false, content: getErrorMessage(error) });
                    });

                // AQUI SE CONVIERTE EL JSON A STRING
                let websiteStructura = { website: JSON.stringify(dataUrlFinal)}
                const newWebsite = {...partnerActive.data, website: websiteStructura.website };

                setLoadingAPI(true);
                if (partnerActive.data.id) {
                    // UPDATE
                    await partnerAPI.updateWebsite(newWebsite)
                        .catch((error) => {
                            errorAPI = true;
                            openNotification({ status: false, content: getErrorMessage(error) });
                        });
                }
                setLoadingAPI(false);
                if (!errorAPI)
                    newObject = savedItem ? savedItem.data : newWebsite;
                !errorAPI && openNotification({ status: true, content: t('documents.savedSuccessfully') });
                setChange(change+1)
                setEditingUrlFinal([])
            }
        } else {
            clearPotentialNew();
            setEditingIndex(index);
        }
    }

    const clearPotentialNew = () => {
        const lastIndex = dataSource.length-1;
        const lastItem = dataSource[lastIndex];
        if (lastItem && !lastItem.id)
            onDelete(lastItem, lastIndex);
    };

    const onPin = async (item, index) => {
        if (item.id) {
            const newItem = item;
            newItem.pinned = !item.pinned;
            setLoadingAPI(true);
            await documentAPI.pin(newItem.id)
                .then((result) => {
                    setDataSource((prevState) => {
                        const newState = prevState;
                        newState[index] = {
                            ...newState[index],
                            ...newItem
                        };
                        if (pinnedIndex !== -1) {
                            newState[pinnedIndex] = {
                                ...newState[pinnedIndex], 
                                pinned: false
                            };
                        }
                        return [...newState];
                    });
                    if (newItem.pinned === false) {
                        setPinnedIndex(-1);
                        openNotification({ status: true, content: t('documents.unpinnedSuccessfully') });
                    } else {
                        setPinnedIndex(index);
                        openNotification({ status: true, content: t('documents.pinnedSuccessfully') });
                    }
                    setDataSource((prevState) => ([...sortPinned(prevState)]));
                })
                .catch((error) => {
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
            setLoadingAPI(false);
        }
    };

    const onDelete = async (item, index) => {
        let errorAPI = false;
        if (item.id) {
            setLoadingAPI(true);
            await documentAPI.delete(item.id)
                .then((result) => {
                    openNotification({ status: true, content: t('documents.removedSuccessfully') });
                })
                .catch((error) => {
                    errorAPI = true;
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
            setLoadingAPI(false);
        }
        if (!errorAPI) {
            setDataSource((prevState) => {
                const newState = prevState;
                newState.splice(index, 1);
                return [...newState];
            });
        }
    };

    const onDeleteUrl = async (item, index) => {
        let errorAPI = false;
        setDataSourceUrls((prevState) => {
            const newState = prevState;
            newState.splice(index, 1);
            return [...newState];
        });

        let partnerActive = await partnerAPI.findByIdPartner(dataSource[0].id)
            .catch((error) => {
                errorAPI = true;
                openNotification({ status: false, content: getErrorMessage(error) });
            });

        let websiteStructura = { website: JSON.stringify(dataSourceUrls)}
        const newWebsite = {...partnerActive.data, id:partnerId, website: websiteStructura.website };        
        
        await partnerAPI.updateWebsite(newWebsite)
            .catch((error) => {
                errorAPI = true;
                openNotification({ status: false, content: getErrorMessage(error) });
            });      
    };

    const addHandle = () => {
        setEditingName('');
        setEditingLink('');
        setDataSource((prevState) => {
            const newState = prevState;
            newState.push({ });
            return [...newState];
        });
        setEditingIndex(dataSource.length - 1);
        setTimeout(() => {
            scrollRef.scrollTop = scrollRef.offsetHeight + 500;
        }, 500);
    };

    const addHandleLinks = () => {
        setEditingName('');
        setEditingLink('');
        setEditingUrl('')
        setDataSourceUrls((prevState) => {
            const newState = prevState;
            newState.push({ });
            return [...newState];
        });
        setEditingIndex(dataSourceUrls.length - 1);
        setTimeout(() => {
            scrollRef.scrollTop = scrollRef.offsetHeight + 500;
        }, 500);
    };

    const handleCancel = () => {
        setConfirmAlert(false);
    }

    const handleOk = async () => {
        // DELETE
        setConfirmAlert(false);

    }

    return (
        <>
            <Row className="document-card-title">
                <div className="document-card-title-content">
                    {titleIcon}
                    <h2>{title}</h2>
                </div>
                {
                    !isURL ?
                        <Button className="document-add-button" onClick={addHandle} disabled={loadingAPI || (dataSource && dataSource.length > 0 && !dataSource[dataSource.length-1].id)}>{t('documents.add')}</Button>
                    :
                        <Button className="document-add-button" onClick={addHandleLinks} disabled={loadingAPI || (dataSourceUrls && dataSourceUrls.length > 1 && !dataSourceUrls[dataSourceUrls.length-1].id) }>{t('documents.add')}</Button>
                }
            </Row>
            {!loadingAPI ? (
                <div className="document-content-list" ref={(ref) => setScrollRef(ref)}>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore = {handleInfiniteOnLoad}
                        hasMore = {hasMore && !loading}
                        useWindow={false}
                        getScrollParent={() => scrollRef}
                    >
                        {documentType === documentTypes.text && 
                            <div className="document-row-parent document-competitor">
                                <Row className="document-row-content">
                                    {icon}
                                    {competitorCustomIndex === editingIndex ? (
                                        !isURL ?
                                            <div className="document-row-edition">
                                                <div className="document-row-edition-property">
                                                    <h5 className="document-row-edition-label">{t('documents.title')}</h5>
                                                    <Input defaultValue={editingName} placeholder={t('documents.title')} size="small" onChange={(e) => {setEditingName(e.currentTarget.value)}} maxLength={50} disabled={true} />
                                                </div>
                                                <div className="document-row-edition-last-property">
                                                    <h5 className="document-row-edition-label">{t('documents.link')}</h5>
                                                    <Input defaultValue={editingLink} placeholder={t('documents.link')} size="small" onChange={(e) => {setEditingLink(e.currentTarget.value)}} maxLength={2000} autoFocus={true} disabled={loadingAPI} />
                                                </div>
                                            </div>
                                        :
                                            <div className="document-row-edition">
                                                <div className="document-row-edition-property">
                                                    <h5 className="document-row-edition-label">{t('documents.title')}</h5>
                                                    <Input defaultValue={'Website'} placeholder={'URL'} size="small" onChange={(e) => {setEditingName(e.currentTarget.value)}} maxLength={50} disabled={true} />
                                                </div>
                                                <div className="document-row-edition-last-property">
                                                    <h5 className="document-row-edition-label">{t('documents.link')}</h5>
                                                    <Input defaultValue={editingUrl ? editingUrl : dataSource.website ? dataSource.website : ''} placeholder={t('documents.link')} size="small" onChange={(e) => {setEditingUrl(e.currentTarget.value)}} maxLength={2000} autoFocus={true} disabled={loadingAPI} />
                                                </div>
                                            </div>                                        
                                    ) : (
                                        !isURL ?
                                            <a href={competitorsFile?.link} target="blank" className="document-list-item document-list-item-competitor">{competitorsFile?.name?.length > 50 ? (competitorsFile?.name.substring(0, 50) + '...') : competitorsFile?.name}</a>
                                        :
                                            <a href="#" target="blank" className="document-list-item document-list-item-competitor">DASHBOARDS</a>

                                    )}
                                </Row>
                                <div>
                                    <Tooltip title={competitorCustomIndex === editingIndex ? t('documents.save') : t('documents.edit')}>
                                        {
                                            !isURL ?
                                                <Button type="dashed" shape="circle" icon={competitorCustomIndex === editingIndex ? <SaveFilled /> : <EditOutlined />} className="document-action-button" onClick={() => onEdit(competitorsFile, competitorCustomIndex)} disabled={loadingAPI} />
                                            :
                                                <></>
                                        }
                                   
                                    </Tooltip>
                                </div>
                            </div>
                        }
                        {
                            !isURL ?
                                <List
                                    dataSource={dataSource}
                                    size="small"
                                    renderItem={(item, index) => (
                                        <>
                                            <List.Item key={item.id} style={{ backgroundColor: index === editingIndex && '#001eff17' }} className="document-row-parent">
                                                <Row className="document-row-content">
                                                    {icon}
                                                    {index === editingIndex ? (
                                                        <div className="document-row-edition">
                                                            <div className="document-row-edition-property">
                                                                <h5 className="document-row-edition-label">{t('documents.title')}</h5>
                                                                <Input defaultValue={editingName} placeholder={t('documents.title')} size="small" onChange={(e) => {setEditingName(e.currentTarget.value)}} maxLength={50} autoFocus={true} disabled={loadingAPI} />
                                                            </div>
                                                            <div className="document-row-edition-last-property">
                                                                <h5 className="document-row-edition-label">{t('documents.link')}</h5>
                                                                <Input defaultValue={editingLink} placeholder={t('documents.link')} size="small" onChange={(e) => {setEditingLink(e.currentTarget.value)}} maxLength={2000} disabled={loadingAPI} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <a href={item.link} target="blank" className="document-list-item">{item.name.length > 50 ? (item.name.substring(0, 50) + '...') : item.name}</a>
                                                    )}
                                                </Row>
                                                <div>
                                                    <Tooltip title={index === editingIndex ? t('documents.save') : t('documents.edit')}>
                                                        <Button type="dashed" shape="circle" icon={index === editingIndex ? <SaveFilled /> : <EditOutlined />} className="document-action-button" onClick={() => onEdit(item, index)} disabled={loadingAPI} />
                                                    </Tooltip>
                                                    <Tooltip title={item.pinned ? t('documents.unpin') : t('documents.pin')}>
                                                        <Button type="dashed" shape="circle" icon={item.pinned ? <StarFilled className="document-pinned-row" /> : <StarOutlined />} className="document-action-button" onClick={() => onPin(item, index)} disabled={loadingAPI || !item.id} />
                                                    </Tooltip>
                                                    <Tooltip title={t('documents.remove')}>
                                                        <Popconfirm
                                                            title={t('documents.confirmDelete')}
                                                            onConfirm={() => onDelete(item, index)}
                                                            onCancel={() => {}}
                                                            icon={<WarningOutlined />}
                                                            okText={t('yes')}
                                                            cancelText={t('no')}
                                                            okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                                        >
                                                            <Button type="dashed" shape="circle" icon={<CloseOutlined />} className="document-action-button" disabled={loadingAPI} />
                                                        </Popconfirm>
                                                    </Tooltip>
                                                </div>
                                            </List.Item>
                                        </>
                                    )}>
                                    {loading && hasMore && (
                                        <div className="generic-spinner">
                                            <Spin />
                                        </div>
                                    )}
                                </List>
                            :
                                <List
                                    dataSource={dataSourceUrls}
                                    size="small"
                                    renderItem={(item, index) => (
                                        <>
                                            <List.Item key={item.id} style={{ backgroundColor: index === editingIndex && '#001eff17' }} className="document-row-parent">
                                                <Row className="document-row-content">
                                                    {icon}
                                                    {index === editingIndex ? (
                                                        <div className="document-row-edition">
                                                            <div className="document-row-edition-property">
                                                                <h5 className="document-row-edition-label">{t('documents.title')}</h5>
                                                                <Input defaultValue={item.name ? item.name : editingName} placeholder={t('documents.title')} size="small" onChange={(e) => {setEditingName(e.currentTarget.value)}} maxLength={50} autoFocus={true} disabled={loadingAPI} />
                                                            </div>
                                                            <div className="document-row-edition-last-property">
                                                                <h5 className="document-row-edition-label">{t('documents.link')}</h5>
                                                                <Input defaultValue={item.url ? item.url : editingUrl} name="link" placeholder={t('documents.link')} size="small" onChange={(e) => {setEditingUrl(e.currentTarget.value)}} maxLength={2000} disabled={loadingAPI} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <a href={item.link} target="blank" className="document-list-item">{item.name ? item.name : editingName}</a>
                                                    )}
                                                </Row>
                                                <div>
                                                    <Tooltip title={index === editingIndex ? t('documents.save') : t('documents.edit')}>
                                                        {
                                                            !isURL ?
                                                                <Button type="dashed" shape="circle" icon={index === editingIndex ? <SaveFilled /> : <EditOutlined />} className="document-action-button" onClick={() => onEdit(item, index)} disabled={loadingAPI} />
                                                            :
                                                                <Button type="dashed" shape="circle" icon={index === editingIndex ? <SaveFilled /> : <EditOutlined />} className="document-action-button" onClick={() => editWebsite(item, index)} disabled={loadingAPI} />
                                                        }
                                                    </Tooltip>
                                                    <Tooltip title={item.pinned ? t('documents.unpin') : t('documents.pin')}>
                                                        <Button type="dashed" shape="circle" icon={item.pinned ? <StarFilled className="document-pinned-row" /> : <StarOutlined />} className="document-action-button" onClick={() => onPin(item, index)} disabled={loadingAPI || !item.id} />
                                                    </Tooltip>
                                                    {
                                                        !isURL ?
                                                            <Tooltip title={t('documents.remove')}>
                                                                <Popconfirm
                                                                    title={t('documents.confirmDelete')}
                                                                    onConfirm={() => onDelete(item, index)}
                                                                    onCancel={() => {}}
                                                                    icon={<WarningOutlined />}
                                                                    okText={t('yes')}
                                                                    cancelText={t('no')}
                                                                    okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                                                >
                                                                    <Button type="dashed" shape="circle" icon={<CloseOutlined />} className="document-action-button" disabled={loadingAPI} />
                                                                </Popconfirm>
                                                            </Tooltip>
                                                        :
                                                            <Tooltip title={t('documents.remove')}>
                                                                <Popconfirm
                                                                    title={t('documents.confirmDelete')}
                                                                    onConfirm={() => onDeleteUrl(item, index)}
                                                                    onCancel={() => {}}
                                                                    icon={<WarningOutlined />}
                                                                    okText={t('yes')}
                                                                    cancelText={t('no')}
                                                                    okButtonProps={{ style: { backgroundColor: '#5365E3' } }}
                                                                >
                                                                    <Button type="dashed" shape="circle" icon={<CloseOutlined />} className="document-action-button" disabled={loadingAPI} />
                                                                </Popconfirm>
                                                            </Tooltip>
                                                    }
                                                </div>
                                            </List.Item>
                                        </>
                                    )}>
                                    {loading && hasMore && (
                                        <div className="generic-spinner">
                                            <Spin />
                                        </div>
                                    )}
                                </List>
                        }
                    </InfiniteScroll>
                </div>
            ) : (
                <div className="generic-spinner">
                    <Spin />
                </div>
            )}
        </>
    );
}

export default React.memo(DocumentsCRUDList);