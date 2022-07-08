import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import partnerAPI from '../../../api/partner';
import { openNotification } from '../../../components/Toastr';
import { documentTypes, orderStates, orderSteps } from '../../../utils/const';
import orderApi from '../../../api/order';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

const newRowDataBox = { id: 'CAJA' }
const newRowSkuPerBox = { sku: '' }

const useOrderBoxes = ({ orderId, tab, form, formPerBox, formPerSku, setSteps }) => {

    const { t } = useTranslation()
    let history = useHistory()
    const session = useSelector(store => store.Session.session)
    const partner = useSelector(store => store.Partner.partner)

    const [loading, setLoading] = useState(false);

    const [isVerified, setIsVerified] = useState(false);

    const [LAPComment, setLAPComment] = useState(null)
    const [formData, setFormData] = useState();
    const [orderBoxesRetrieved, setOrderBoxesRetrieved] = useState(null)
    const [orderBoxesData, setOrderBoxesData] = useState(null)
    const [dataBoxes, setDataBoxes] = useState([newRowDataBox]);
    const [dataSkuPerBox, setDataSkuPerBox] = useState([]);
    const [skuPerBoxPercent, setSkuPerBoxPercent] = useState({ total: 0, totalInBoxes: 0, percent: 0 });

    const [acceptedProposal, setAcceptedProposal] = useState(false);
    const [remakeModalVisible, setRemakeModalVisible] = useState(false);
    const [doCheckTotalQuantityPerSku, setDoCheckTotalQuantityPerSkuPerPack] = useState(false);
    const [isValidTotalQuantityPerSku, setIsValidCheckTotalQuantityPerSkuPerPack] = useState(true);
    const [doCheckTotalQuantityPerSkuPerSingleCase, setDoCheckTotalQuantityPerSkuPerSingleCase] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            pack: true,
            unity: 'cm'
        })
    }, [])

    useEffect(() => {
        if (orderBoxesRetrieved && tab) formatDataRetrieved()
    }, [orderBoxesRetrieved, tab])
  
    const checkTotalQuantityPerSkuPerPack = () => {
        let flag = true
        if (formData.pack) {
            dataSkuPerBox.forEach(dataPerSku => {
                let maxQuantityPerSku = dataPerSku.quantity;
                let totalQuantityPerSkuPerBoxes = 0;
                dataBoxes.forEach(dataPerBox => {
                    dataPerBox?.products?.forEach(dataPerProductPerBox => {
                        if (dataPerProductPerBox.sku === dataPerSku.sku)
                            totalQuantityPerSkuPerBoxes += parseInt(dataPerProductPerBox?.quantity_per_box)
                    })
                })
                if (totalQuantityPerSkuPerBoxes > maxQuantityPerSku) {
                    openNotification({ status: false, content: `No puedes pasar las unidades de ventas para el producto con sku ` + dataPerSku.sku })
                    flag = false
                }
            })
        }
        setDoCheckTotalQuantityPerSkuPerPack(false)
        setIsValidCheckTotalQuantityPerSkuPerPack(flag)
        return flag
    }
    const checkTotalQuantityPerSkuPerSingleCase = (products) => {
        let progress = { total: 0, boxesTotal: products.length, totalInBoxes: 0, percent: 0, status:'normal' }
        let flag = true
        products.forEach(product => {
            let totalQuantityPerSkuPerBoxes = product?.boxes * product?.perBox
            progress.totalInBoxes += totalQuantityPerSkuPerBoxes;
            progress.total += product.quantity;
            if (totalQuantityPerSkuPerBoxes) {
                if (product.quantity < totalQuantityPerSkuPerBoxes) {
                    openNotification({ status: false, content: `No puedes pasar las unidades de ventas para el producto con sku ` + product?.sku })
                    flag = false
                }
            }
        })
        let percent = (progress.totalInBoxes * 100) / progress.total;
        let status = 'normal';
        if(percent === 100) {
            status = 'success';
        } else if(percent > 100){
            status = 'exception';
        }
        progress.percent = percent;
        progress.status = status;
        setSkuPerBoxPercent(progress);
        return flag
    }

    const calculateSkuPerBoxPercent = (products) => {

        let total = 0
        let totalInBoxes = 0
        let boxesTotal = []
        products.forEach(item => {
            total += item.quantity;
            item.boxes.forEach((boxed, i) => {
                if(!boxesTotal[i]){
                    boxesTotal[i] = 0;
                }
                boxesTotal[i] += parseInt(boxed);
                totalInBoxes += parseInt(boxed);  
            })           
        })        
        let percent = (totalInBoxes * 100) / total;
        let status = 'normal';
        if(percent === 100) {
            status = 'success';
        } else if(percent > 100){
            status = 'exception';
        }
        setSkuPerBoxPercent({ total: total, boxesTotal, totalInBoxes: totalInBoxes, percent: percent, status })
    }

    const calculateSkuPerCasePercent = (products) => {

        let total = 0
        let totalInBoxes = 0
        let boxesTotal = []
        products.forEach(item => {
            total += item.quantity;
            item.boxes.forEach((boxed, i) => {
                if(!boxesTotal[i]){
                    boxesTotal[i] = 0;
                }
                boxesTotal[i] += parseInt(boxed);
                totalInBoxes += parseInt(boxed);  
            })           
        })        
        let percent = (totalInBoxes * 100) / total;
        let status = 'normal';
        if(percent === 100) {
            status = 'success';
        } else if(percent > 100){
            status = 'exception';
        }
        setSkuPerBoxPercent({ total: total, boxesTotal, totalInBoxes: totalInBoxes, percent: percent, status })
    }

    const formatDataRetrieved = () => {
        form.resetFields();
        formPerSku.resetFields();
        formPerBox.resetFields();

        let indexOwners = orderBoxesRetrieved?.owners.findIndex(e => e.owner === tab)
        let currentOwner = orderBoxesRetrieved.owners[indexOwners]
        form.setFieldsValue({
            ...currentOwner,
            unity: currentOwner?.unity ? currentOwner.unity : 'cm', boxQuantity: currentOwner?.boxQuantity ? currentOwner?.boxQuantity : currentOwner?.orderBoxesDto?.length
        })

        let fd = { ...currentOwner, allProducts: currentOwner.allProducts.map((prod)=> {
            return {...prod, units_per_pack: prod.units_pack, tax_code: prod.tax_code, expiration_date: prod.expiration_date ? moment(prod.expiration_date):null, boxes: currentOwner.pack ? currentOwner.orderBoxesDto.map((box)=>{
                let foundProd = box.products.find((boxProd)=> {
                    return boxProd.sku == prod.sku
                });
                if(foundProd){
                    return foundProd.quantity_per_box;
                }
                return 0;
            }): prod.boxes};
        }), shippingType: currentOwner?.shippingType, shippingAmount: currentOwner.shippingAmount, pallets: currentOwner?.pallets, unity: currentOwner?.unity ? currentOwner.unity : 'cm', boxQuantity: currentOwner?.boxQuantity ? currentOwner?.boxQuantity : currentOwner?.orderBoxesDto?.length };
        setFormData(fd);
        if(fd.pack) {
            calculateSkuPerBoxPercent(fd.allProducts);
        } else {
            checkTotalQuantityPerSkuPerSingleCase(fd.allProducts);
        }
        formPerSku.setFieldsValue(fd);
        formPerBox.setFieldsValue(fd);
    }

    const formatData = () => {
        let owners = orderBoxesRetrieved.owners
        let data = owners.map((item, index) => {
            if (item.owner === tab) {
                let owner = {
                    ...item,
                    ...formData,
                };

                if(formData.pack) {
                    owner.orderBoxesDto = [];
                    let values = formPerSku.getFieldsValue();
                    let boxesValues = formPerBox.getFieldsValue();
                    boxesValues.orderBoxesDto.map((item, boxIndex) => {
                        let total = 0
                        delete item.id;
                        delete item.key;
                        let box = { height: item.height, width: item.width, length: item.length, weight: item.weight, products: []};

                        values.allProducts.forEach((prod, prodIndex)=> {
                            box.products.push({id: formData.allProducts[prodIndex].id, quantity: prod.boxes[boxIndex], units_pack: prod.units_pack, tax_code: prod.tax_code, expiration_date:prod.expiration_date});
                        });
                        owner.orderBoxesDto.push(box);
                    });

                } else {
                    owner.orderBoxesDto = [];
                    let values = formPerSku.getFieldsValue();
                    values.allProducts.forEach((prod, idx)=> {
                        owner.orderBoxesDto.push({
                            ...prod,
                            products: [{...prod, id: formData.allProducts[idx].id, quantity: prod.perBox}]
                        })
                    });
                }

                return owner;
            } else {
                return item
            }
        })

        let indexCurrentStep = orderBoxesRetrieved?.steps?.findIndex(e => e.step === orderSteps.CAJAS)
        let stepsData = orderBoxesRetrieved.steps.map((item, index) => {
            if (index === indexCurrentStep) {
                return {
                    ...item,
                    LAPComment: LAPComment
                }
            } else { return item }
        })
        return {
            ...orderBoxesRetrieved,
            owners: data,
            steps: stepsData
        }
    }

    const handleCommonErrors = () => {
        let currentOwner = orderBoxesRetrieved?.owners?.find(e => e.owner === tab)
        if ([undefined, null].includes(currentOwner)) {
            openNotification({ status: false, content: `Error al obtener la Orden en ` + tab })
            return false
        }
        if ([undefined, null].includes(orderId)) {
            openNotification({ status: false, content: `Error al obtener el id de la Orden. Revise su URL. ` })
            return false
        }
        if ([undefined, null].includes(session?.userInfo?.partner_id[0])) {
            openNotification({ status: false, content: `Error al obtener el id del Partner. ` })
            return false
        }
        return true
    }

    const onFinishFailed = (errorInfo) => {
        let errors = errorInfo.errorFields.map(e => e.errors.join('.'));
        openNotification({ status: false, content: errors.join('. ') })
    };

    const handleErrorsInForms = () => {
        let errors = 0
        let flag = true

        if (formData?.pack)
            flag = checkTotalQuantityPerSkuPerPack()
        else
            flag = checkTotalQuantityPerSkuPerSingleCase(formPerSku.getFieldsValue().allProducts)

        if (!flag) errors += 1

        if (Object.entries(form.getFieldsValue())?.length > 0) {
            Object.entries(form.getFieldsValue()).forEach(entry => {
                if ([undefined, null, ''].includes(entry[1]))
                    errors += 1
            });
        }

        if (Object.entries(formPerBox.getFieldsValue())?.length > 0) {
            Object.entries(formPerBox.getFieldsValue()).forEach(entry => {
                if ([undefined, null, ''].includes(entry[1]))
                    errors += 1
            });
        }

        if (Object.entries(formPerSku.getFieldsValue())?.length > 0) {
            Object.entries(formPerSku.getFieldsValue()).forEach(entry => {
                if ([undefined, null, ''].includes(entry[1]))
                    errors += 1
            });
        }

        if (errors > 0) {
            flag = false
            openNotification({ status: false, content: `Debes completar el formulario` })
            flag = false
        }

        return flag
    }

    const hanldeErrorsBoxAtributtes = (data) => {
        const maxUnity = formData.unity == "cm" ? 63.5 : 25;
        const maxWeight = formData.unity == "cm" ? 50 : 22.67;
        let flag = true;
        data?.map((element) => {
            if (element.width > maxUnity) {
                openNotification({ status: false, content: `La medida maxima para el ANCHO es de ${maxUnity} ${formData.unity} para la  ` + element.id });
                flag = false;
            }
            if (element.height > maxUnity) {
                openNotification({ status: false, content: `La medida maxima para la ALTURA es de ${maxUnity} ${formData.unity} para la  ` + element.id });
                flag = false;
            }
            if (element.length > maxUnity) {
                openNotification({ status: false, content: `La medida maxima para el LARGO es de ${maxUnity} ${formData.unity} para la  ` + element.id });
                flag = false;
            }
            if (element.weight > maxWeight) {
                openNotification({ status: false, content: `La medida maxima para el PESO es de ${maxWeight} ${formData.unity == 'cm' ? 'Kgs' : 'Lbs'} para la  ` + element.id });
                flag = false;
            }
        })
        return flag;
    }

    const handleSendBoxes = async () => {
        formPerBox.submit();
        formPerSku.submit();
        if (handleCommonErrors() && (session?.userInfo?.role == 'Admin' ? handleErrorsInForms() : true) && hanldeErrorsBoxAtributtes(dataBoxes)) {
            const formattedData = formatData()
            setLoading(true)
            try {
                const { data } = await orderApi.sendBoxes(orderId, formattedData)
                openNotification({ status: true, content: t('onboarding.sentSuccessfully') })
                getInitOrdersData()
                setLoading(false)
            } catch (error) {
                setLoading(false)
                openNotification({ status: false, content: error?.response?.data?.message })
                return false
            }
        }
    }

    const handleSaveDraft = async () => {
        setLoading(true)

        const formattedData = formatData()
        let flag = true
        if (formData?.pack) {
            flag = checkTotalQuantityPerSkuPerPack()
        } else {
            flag = checkTotalQuantityPerSkuPerSingleCase(formPerSku.getFieldsValue().allProducts)
        }
            
        if (!flag) {
            setLoading(false)
            return
        }

        if (handleCommonErrors()) {
            try {
                const { data } = await orderApi.updateBoxes(orderId, formattedData)
                if (data?.success) {
                    openNotification({ status: true, content: 'Borrador guardado con éxito.' })
                    getInitOrdersData()
                }
                setLoading(false)
            } catch (error) {
                setLoading(false)
                openNotification({ status: false, content: error?.response?.data?.message })
                return false
            }
        }
    }

    const getInitOrdersData = async () => {
        setLoading(true)
        try {
            const { data } = await orderApi.getBoxes(orderId)
            if (!data?.owners || !data?.id) {
                return
            }
            setSteps(data.steps);
            setOrderBoxesRetrieved(data)
            setLoading(false)
        } catch (error) {
            openNotification({ status: false, content: error?.response?.data?.message })
            setLoading(false)
        }
    }

    const onClickRejectProposal = () => {
        setRemakeModalVisible(true);
    }

    const onClickAcceptProposal = async () => {
        setLoading(true);
        await orderApi.acceptProposal(orderId)
            .then((response) => {
                setOrderBoxesRetrieved((prevState) => {
                    const otherSteps = prevState.steps.filter((step) => step.step !== orderSteps.CAJAS);
                    return {
                        ...prevState,
                        steps: [
                            ...otherSteps,
                            {
                                step: orderSteps.CAJAS,
                                state: orderStates.COMPLETED
                            }
                        ]
                    }
                })
            })
            .catch((error) => {
                openNotification({ status: false, content: error?.response?.data?.message });
            });
        setLoading(false);
        setAcceptedProposal(true);
    };

    useEffect(() => {
        form.resetFields()
        formPerSku.resetFields()
        formPerBox.resetFields()
        setLAPComment(null)
        getInitOrdersData()
    }, []);

    return {
        formData,
        setFormData,
        newRowDataBox,
        newRowSkuPerBox,
        loading,
        skuPerBoxPercent,
        orderBoxesRetrieved,
        setOrderBoxesRetrieved,
        LAPComment,
        orderBoxesData,
        setOrderBoxesData,
        dataSkuPerBox,
        setDataSkuPerBox,
        setLAPComment,
        handleSaveDraft,
        handleSendBoxes,
        onFinishFailed,
        dataBoxes,
        setDataBoxes,
        /* handle modal Proposal */
        acceptedProposal,
        setAcceptedProposal,
        onClickAcceptProposal,
        onClickRejectProposal,
        remakeModalVisible,
        setRemakeModalVisible,
        /* handle data boxes*/
        setDoCheckTotalQuantityPerSkuPerPack,
        setDoCheckTotalQuantityPerSkuPerSingleCase,
        isValidTotalQuantityPerSku,
        calculateSkuPerBoxPercent,
        calculateSkuPerCasePercent,
        checkTotalQuantityPerSkuPerSingleCase
    };
}
export default useOrderBoxes