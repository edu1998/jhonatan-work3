import React from 'react';

import { Upload, Spin } from 'antd';
import amazonS3Api from '../../../api/aws-s3'
import produce from 'immer';
import { openNotification } from '../../../components/Toastr';
import { validSizesImagesForMarkets, validFormatsImagesForMarkets, listingStates, sellerMarketplaces } from '../../../utils/const';
import { canEdit } from '../../../utils/functions';
import { PlusOutlined } from '@ant-design/icons';
import partnerApi from '../../../api/partner';
import { getErrorMessage } from '../../../api/api';
import { useParams } from 'react-router';

export default ({ isVariant, setSavingDraft, isLap, productId, form, type, limit, step, images, setImages, tab, currentTab, marketplace, session, requiresValidation, group }) => {

    const { listingId } = useParams();

    const setUploading = (uploading) => {
        const newImages = produce(images, draft => {
            draft[tab][marketplace]['uploading_' + type + group] = uploading;
            return draft;
        })
        setImages(newImages);
    }

    let variantIndex = 0;

    if (isVariant) {
        variantIndex = images[tab][marketplace].variants.findIndex((v) => { return v.id === productId });
    }

    const UploadButton = () => (
        <div>
            <Spin spinning={images[tab][marketplace]['uploading_' + type + group] === true}>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </Spin>
        </div>
    );


    const beforeUpload = async (file) => {
        const result = await getSizesAndBase64(file);
        if (requiresValidation) {
            if (isValidFormat(file) && isValidSize(marketplace, result.sizes, file.size)) {
                setUploading(true);
                const data = await uploadImageS3({ type: file.type, name: file.name, weight: file.size, base64: result.base64, uid: file.uid, foo: 'foo' })
                if (data?.location && data?.key) {
                    file.preview = data.location
                    file.thumbUrl = data.location
                    file.key = data.key
                }
                setUploading(false);
                return file;
            } else {
                return Upload.LIST_IGNORE;
            }
        } else {
            setUploading(true);
            const data = await uploadImageS3({ type: file.type, name: file.name, weight: file.size, base64: result.base64, uid: file.uid, foo: 'foo' })
            if (data?.location && data?.key) {
                file.preview = data.location
                file.thumbUrl = data.location
                file.key = data.key
            }
            setUploading(false);
            return file;
        }
    }

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok")
        }, 0);
    }

    const addImage = (file) => {
        setSavingDraft(true);
        let values = form.getFieldsValue();
        let payload = { tab, marketplace, type, image: file, productId: productId, group: group };
        partnerApi.addImage(session.userInfo.partner_id[0], listingId, payload).then(() => {
            setSavingDraft(false);
        }, (error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setSavingDraft(false);
        })
    }


    const removeImage = (uid) => {
        setSavingDraft(true);
        let values = form.getFieldsValue();
        let payload = { tab, marketplace, type, image: uid, productId: productId, group: group };
        partnerApi.removeImage(session.userInfo.partner_id[0], listingId, payload).then(() => {
            setSavingDraft(false);
        }, (error) => {
            openNotification({ status: false, content: getErrorMessage(error) });
            setSavingDraft(false);
        })
    }

    const addImageToProduct = (changed, draft) => {
        let added = false
        let idx = draft[tab][marketplace].product[type].findIndex((img) => { return changed.file.key == img.key });
        if (idx > -1) {
            draft[tab][marketplace].product[type][idx] = { ...changed.file, status: "done", percent: 100, response: "ok", group: group };
        } else {
            added = true;
            draft[tab][marketplace].product[type].push({ ...changed.file, status: "done", percent: 100, response: "ok", group: group });
        }
        return added;
    }

    const addImageToVariant = (changed, draft) => {
        let added = false;
        let variantIdx = draft[tab][marketplace].variants.findIndex((v) => { return v.id === productId });
        let idx = draft[tab][marketplace].variants[variantIdx][type].findIndex((img) => { return changed.file.key == img.key });
        if (idx > -1) {
            draft[tab][marketplace].variants[variantIdx][type][idx] = { ...changed.file, status: "done", percent: 100, response: "ok", group: group };
        } else {
            added = true;
            draft[tab][marketplace].variants[variantIdx][type].push({ ...changed.file, status: "done", percent: 100, response: "ok", group: group });
        }
        return added;
    }


    const onChangeFileUpload = (changed) => {
        if (changed.file.status != 'removed') {
            let added = false;
            const newImages = produce(images, draft => {
                if (!isVariant) {
                    added = addImageToProduct(changed, draft, added);
                } else {
                    added = addImageToVariant(changed, draft, added);
                }
                return draft;
            })
            if (added) {
                addImage(changed.file);
            }
            setImages(newImages);
        }
    }

    const isValidFormat = (file) => {
        if (!file) {
            openNotification({ status: false, content: `Debe adjuntar una imágen.` })
            return false
        }
        if (!file.type) {
            openNotification({ status: false, content: `No se puedo determinar el formato de la imágen.` })
            return false
        }
        if (!validFormatsImagesForMarkets.includes(file.type)) {
            openNotification({ status: false, content: `Revise la extensión de su archivo ${file.type.split('/')[1].toUpperCase()}. Debe ser JPG, JPEG, PNG, TIFF. ` })
            return false
        }
        return true
    }

    const isValidSize = (mkt, fileSizes, fileWeight) => {
        console.log(marketplace)
        const minimumSize = validSizesImagesForMarkets[`${marketplace.includes(sellerMarketplaces.AMAZON) ? sellerMarketplaces.AMAZON : marketplace}MinimumSize`]
        const maximumSize = validSizesImagesForMarkets[`${marketplace.includes(sellerMarketplaces.AMAZON) ? sellerMarketplaces.AMAZON : marketplace}MaximumSize`]
        const maximumWeight = validSizesImagesForMarkets[`${marketplace.includes(sellerMarketplaces.AMAZON) ? sellerMarketplaces.AMAZON : marketplace}MaximumWeight`]
        const { width, height } = fileSizes
        if (width > height && width < minimumSize) {
            openNotification({ status: false, content: `El lado más largo de su imágen es el ancho, con  ${width}px, pero debe tener ${minimumSize}px o más.` })
            return false
        } else if (width < height && height < minimumSize) {
            openNotification({ status: false, content: `El lado más largo de su imágen es la altura, con  ${height}px, pero debe tener ${minimumSize}px o más.` })
            return false
        } else if (width === height && width < minimumSize) {
            openNotification({ status: false, content: `Su imágen es cuadrada (largo=alto), con  ${height}px, pero debe tener ${minimumSize}px o más.` })
            return false
        }
        if (minimumSize > width > maximumSize) {
            openNotification({ status: false, content: `Ancho y alto debe ser entre ${minimumSize}px y ${maximumSize}px. Su imágen posee ${width}px:${height}px.` })
            return false
        }
        if (maximumWeight && (fileWeight / 1024 / 1024) > maximumWeight) {
            openNotification({ status: false, content: `La imágen no puede superar los ${parseFloat(maximumWeight).toFixed(2)} MB. Su imágen pesa ${parseFloat(fileWeight / 1024 / 1024).toFixed(2)} MB.` })
            return false
        }
        return true
    }


    const getSizesAndBase64 = async (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return await new Promise(resolve => {
            reader.addEventListener('load', async (event) => {
                const _loadedImageUrl = event.target.result
                const image = document.createElement('img')
                image.src = _loadedImageUrl
                resolve(await new Promise(resolve => {
                    image.addEventListener('load', () => {
                        const { width, height } = image
                        resolve({ base64: _loadedImageUrl, sizes: { width, height } })
                    })
                }));
            })
        });
    }

    const uploadImageS3 = async (image) => {
        try {
            const { data } = await amazonS3Api.upload(image)
            if (!data?.location || !data?.key) {
                openNotification({ status: false, content: 'Tuvimos problemas al cargar la imágen en Amazon S3. Intente luego.' })
                return
            }
            return data
        } catch (error) {
            openNotification({ status: false, content: error.response.data.message })
            return false
        }
    }

    async function deleteImageS3(tabkey) {
        try {
            const { data } = await amazonS3Api.deleteImageByKey(tabkey)
            if (!data) {
                openNotification({ status: data, content: 'Error al eliminar la imágen en Amazon S3.' })
            }
        } catch (error) {
            openNotification({ status: false, content: error.response.data.message })
        }
    }

    const deleteImage = async (file) => {
        if (file.id) {
            const newImages = produce(images, draft => {
                if (!isVariant) {
                    let idx = draft[tab][marketplace].product[type].findIndex((img) => { return file.id == img.id });
                    if (idx > -1) {
                        draft[tab][marketplace].product[type].splice(idx, 1);
                    }
                } else {
                    let idx = draft[tab][marketplace].variants[variantIndex][type].findIndex((img) => { return file.id == img.id });
                    if (idx > -1) {
                        draft[tab][marketplace].variants[variantIndex][type].splice(idx, 1);
                    }
                }

                return draft;
            })
            setImages(newImages);
            deleteImageS3(file.name);
            removeImage(file.name);
        } else {
            if (file.uid) {
                const newImages = produce(images, draft => {
                    let idx = draft[tab][marketplace].product[type].findIndex((img) => { return file.uid == img.uid });
                    if (idx > -1) {
                        draft[tab][marketplace].product[type].splice(idx, 1);
                    }
                    return draft;
                })
                setImages(newImages);
                deleteImageS3(file.uid);
                removeImage(file.uid);
            }
        }
    }

    return (

        <Upload
            accept="image/jpg,image/jpeg,image/png,image/tiff"
            maxCount={limit} multiple
            customRequest={dummyRequest}
            onChange={(changed) => { onChangeFileUpload(changed) }}
            onRemove={(file) => deleteImage(file)}
            listType="picture-card"
            beforeUpload={(file) => { return beforeUpload(file) }}
            disabled={(session?.userInfo?.role == 'Admin' ?
                ('LAP' != currentTab || step?.state != listingStates.PENDING_LAP) :
                ('Client') != currentTab || ![listingStates.PENDING_CLIENT, listingStates.PENDING].includes(step?.state))}
            fileList={isVariant ? images[tab][marketplace].variants[variantIndex][type]?.filter(image => image.group === group) : images[tab][marketplace].product[type]?.filter(image => image.group === group)}
        >
            {(isVariant ? images[tab][marketplace].variants[variantIndex][type] : images[tab][marketplace].product[type]).length >= limit ? null : <UploadButton />}
        </Upload>

    );
}