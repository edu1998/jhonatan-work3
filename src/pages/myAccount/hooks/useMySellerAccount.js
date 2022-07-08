import { useState } from 'react'
import amazonSPApi from '../../../api/aws-sp'
import marketplacesApi from '../../../api/marketplace'
import accessKeysApi from '../../../api/aws-access-keys'
import { openNotification } from '../../../components/Toastr'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import * as Actions from '../../../redux/session/action';
import { initialMySellerAccountEbay, initialMySellerAccountWalmart, sellerMarketplaces } from '../../../utils/const'

const useMySellerAccount = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false)
    const [marketplaces, setMarketplaces] = useState(false)
    const [isValidAccount, setIsValidAccount] = useState(false)
    const [loadingIsValidAccount, setLoadingIsValidAccount] = useState(false)
    const [loadingMySellerAccount, setLoadingMySellerAccount] = useState(false)
    const [loadingGetMarketplaces, setLoadingGetMarketplaces] = useState(false)
    const [loadingGetMySellerAccount, setLoadingGetMySellerAccount] = useState(false)
    const [loadingGetLapSellerAccounts, setLoadingGetLapSellerAccounts] = useState(false)

    async function getMySellerAccountByMarketplace(session, marketplace, mySellerAccount, setMySellerAccount) {
        console.log(mySellerAccount)
        setLoadingGetMySellerAccount(true)
        try {
            const { data } = await accessKeysApi.findByIdAndMarketplace(session?.userInfo?.commercial_partner_id[0], marketplace);
            setMySellerAccount(data)
            setIsValidAccount(false)
            setShowForm(data.credentials)
            setLoadingGetMySellerAccount(false)
        } catch (error) {
            setLoadingGetMySellerAccount(false)
            setIsValidAccount(false)
        }
    }

    async function checkMySellerAccount(mySellerAccount) {
        setLoadingIsValidAccount(true)
        try {
            const { data } = await amazonSPApi.login(mySellerAccount)
            console.log(data)
            setIsValidAccount(data)
            setLoadingIsValidAccount(false)
            openNotification({ status: data, content: t('myAccount.successfulMessage1') })
        } catch (error) {
            setIsValidAccount(false)
            setLoadingIsValidAccount(false)
            openNotification({ status: false, content: error.response.data.message })
        }
    }

    async function createMySellerAccount(mySellerAccount, setMySellerAccount) {
        // delete mySellerAccount.x_seller_marketplace; // temporalmente
        setLoadingMySellerAccount(true);
        try {
            const { data } = await accessKeysApi.create(mySellerAccount)
            setIsValidAccount(false)
            setMySellerAccount(data)
            // console.log(data)
            setLoadingMySellerAccount(false)
            dispatch(Actions.updateSellerAccountStatusSession(true))
            openNotification({ status: true, content: data ? t('myAccount.successfulMessage2') : t('myAccount.failedMessage') })
        } catch (error) {
            setIsValidAccount(false)
            setLoadingMySellerAccount(false)
            openNotification({ status: false, content: error.response.data.message })
        }
    }

    async function updateMySellerAccount(mySellerAccount, setMySellerAccount) {
        // delete mySellerAccount.x_seller_marketplace; // temporalmente - ver en odoo
        setLoadingMySellerAccount(true)
        try {
            const { data } = await accessKeysApi.update(mySellerAccount.id, mySellerAccount)
            setIsValidAccount(false)
            // console.log(data)
            setMySellerAccount(data)
            setLoadingMySellerAccount(false)
            dispatch(Actions.updateSellerAccountStatusSession(true))
            openNotification({ status: true, content: data ? t('myAccount.successfulMessage2') : t('myAccount.failedMessage') })
        } catch (error) {
            setIsValidAccount(false)
            setLoadingMySellerAccount(false)
            openNotification({ status: false, content: error.response.data.message })
        }
    }

    // async function createMySellerAccountWithLAPCredentials(session, marketplace, setMySellerAccount) {
    //     // console.log( session.userInfo.externalUserId, marketplace)
    //     // console.log( session.userInfo.id, marketplace)
    //     setLoadingMySellerAccount(true)
    //     // delete marketplace.x_seller_marketplace
    //     try {
    //         const { data } = await accessKeysApi.createWithPartnerCredentials(session.userInfo.id, marketplace)
    //         // console.log(data)
    //         setMySellerAccount(data);
    //         setLoadingMySellerAccount(false);
    //         dispatch(Actions.updateSellerAccountStatusSession(true));
    //         openNotification({ status: true, content: data ? t('myAccount.successfulMessage2') : t('myAccount.failedMessage') });
    //     } catch (error) {
    //         // console.log(error.response.data.message)
    //         setIsValidAccount(false);
    //         setLoadingMySellerAccount(false);
    //         openNotification({ status: false, content: error.response.data.message });
    //     }
    // }

    async function getMarketplaces() {
        setLoadingGetMarketplaces(true)
        try {
            const { data } = await marketplacesApi.findAll()
            setMarketplaces(data)
            setLoadingGetMarketplaces(false);
        } catch (error) {
            setLoadingGetMarketplaces(false);
            console.log(error)
            // openNotification({ status: false, content: error.response.data.message });
        }
    }

    return {
        showForm,
        setShowForm,
        isValidAccount,
        setIsValidAccount,
        marketplaces,
        getMarketplaces,
        setIsValidAccount,
        checkMySellerAccount,
        updateMySellerAccount,
        createMySellerAccount,
        loadingIsValidAccount,
        loadingMySellerAccount,
        loadingGetMarketplaces,
        loadingGetMySellerAccount,
        loadingGetLapSellerAccounts,
        setLoadingMySellerAccount,
        setLoadingGetMySellerAccount,
        getMySellerAccountByMarketplace,
        // createMySellerAccountWithLAPCredentials
    };
}
export default useMySellerAccount