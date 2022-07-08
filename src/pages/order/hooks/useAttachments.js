import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import partnerAPI from '../../../api/partner';
import { openNotification } from '../../../components/Toastr';
import { documentTypes } from '../../../utils/const';
import documentAPI from '../../../api/document';
import orderAPI from '../../../api/order';
import { useTranslation } from 'react-i18next';
import order from '../../../api/order';


const useAttachments = ({ orderId }) => {

    const { t } = useTranslation()
    const session = useSelector(store => store.Session.session)
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllDocuments = async () => {
        setLoading(true)
        try {
            const { data } = await orderAPI.getDocuments(orderId)
            console.log("entra a cargar los documentos", data);
            setDocuments(data);
            setLoading(false)
        } catch (error) {
            console.log("error", error);
            setLoading(false)
            openNotification({ status: false, content: error.response.data.message })
        }
    }

    useEffect(async () => {
        if (orderId){
            getAllDocuments()
        }           
    }, [orderId])


    return {
        loading,
        documents,
        getAllDocuments
    };
}
export default useAttachments