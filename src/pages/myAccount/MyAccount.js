import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Row, Col, Avatar, Layout } from 'antd';
import { UserOutlined, LeftOutlined, CheckCircleFilled } from '@ant-design/icons';
import { CompanyData } from './components/steps/CompanyData';
import { BankAccountData } from './components/steps/BankAccountData';
import { initialMyAccountData, initialMyBankAccountData } from '../../utils/const';
import { checkProperties, checkProfile } from '../../utils/functions';
import { openNotification } from '../../components/Toastr';
import partnerApi from '../../api/partner';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../../redux/partner/action';
import * as ActionsSession from '../../redux/session/action';
import { useTranslation } from 'react-i18next';
import { MySellerAccount } from './components/steps/MySellerAccount';
import { Welcome } from './components/steps/Welcome';
import { useParams, useLocation } from 'react-router';
import './myAccount.css';

const { Content, Sider } = Layout;

export const MyAccount = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { search } = useLocation();
    const { marketplace, consent } = useParams();
    const session = useSelector(store => store.Session.session);
    const partner = useSelector(store => store.Partner.partner);
    const myAccountDataPersisted = useSelector(store => store.Partner.myAccountData);
    const [selected, setSelected] = useState(0);
    const [toSellerAccount, setToSellerAccount] = useState(false);
    const [loadingMyAccount, setLoadinMyAccount] = useState(false);
    const [myAccountDatastatus, setMyAccountDataStatus] = useState(false);
    const [myBankAccountDataStatus, setMyBankAccountDataStatus] = useState(false);
    const [myAccountData, setMyAccountData] = useState(initialMyAccountData);
    const [mySellerAccount, setMySellerAccount] = useState();
    const [myBankAccountData, setMyBankAccountData] = useState(initialMyBankAccountData);
    const [profileCompleted, setProfileCompleted] = useState(false);

    const searchParams = React.useMemo(() => new URLSearchParams(search), [search]);
    const linkToStep = searchParams?.get("step");

    useEffect(() => {
        setLoadinMyAccount(true);
    }, [])

    useEffect(() => {
        if (linkToStep) {
            setSelected(Number(linkToStep));
        }
    }, [profileCompleted])

    useEffect(() => {
        if (marketplace && consent) {
            setSelected(2);
        }
    }, [marketplace, consent])

    useEffect(() => {
        if (session) {
            dispatch(Actions.getPartner());
            partnerApi.findById(session.userInfo.partner_id[0])
                .then(res => {
                    if (res.status === 200) {
                        delete res.data.x_product_template_ids;
                        dispatch(Actions.getPartnerSuccess(res.data));
                        // setProfileCompleted(checkProperties(res.data));
                        setProfileCompleted(checkProfile(res.data, session.userInfo));
                    }
                    else { dispatch(Actions.getPartnerFailed(res.data.message)); }
                })
                .catch(error => {
                    dispatch(Actions.getPartnerFailed(error));
                })
        }
    }, [])


    useEffect(() => {
        if (myAccountData.id) {
            setMyAccountDataStatus(checkProperties(myAccountData));
            if (linkToStep) {
                setSelected(linkToStep);
            }
        }
    }, [myAccountData.id])

    useEffect(() => {
        if (myBankAccountData.acc_number) {
            setMyBankAccountDataStatus(checkProperties(myBankAccountData));
            myAccountData.acc_number = myBankAccountData.acc_number;
        }
        if (myBankAccountData.x_routing_number) myAccountData.x_routing_number = myBankAccountData.x_routing_number;
        if (myBankAccountData.bank) myAccountData.bank_ids = myBankAccountData.bank;
    }, [myBankAccountData])

    useEffect(() => {
        if (myAccountDataPersisted || partner) {
            const dataPerBank = !myAccountDataPersisted?.acc_number ? partner : myAccountDataPersisted;
            if (dataPerBank?.banks?.length > 0) {
                setMyBankAccountData({
                    ...myBankAccountData,
                    bank: dataPerBank?.banks[dataPerBank.banks.length - 1]?.bank_name || null,
                    acc_number: dataPerBank?.banks[dataPerBank.banks.length - 1]?.acc_number || null,
                    x_routing_number: dataPerBank?.banks[dataPerBank.banks.length - 1]?.x_routing_number || null,
                });
            }
            // formateo a null los datos que me vienen en false (xq no son campos booleanos)
            const dataPerAccount = !myAccountDataPersisted ? partner : myAccountDataPersisted;
            delete dataPerAccount.bank_ids;

            const vat = dataPerAccount.ref ? dataPerAccount.ref : dataPerAccount.vat;
            setMyAccountData({
                ...dataPerAccount,
                company_id: session?.userInfo?.company_id[0],
                id: session?.userInfo?.partner_id[0],
                ref: vat || "",
                zip: !dataPerAccount.zip ? null : dataPerAccount.zip,
                industry_id: !dataPerAccount.industry_id ? null : dataPerAccount.industry_id,
                birthday: myAccountDataPersisted ? dataPerAccount.birthday : session?.userInfo?.birthday ? session?.userInfo?.birthday : null,
                passport_id: myAccountDataPersisted ? dataPerAccount.passport_id : session?.userInfo?.passport_id ? session?.userInfo?.passport_id : null,
                x_fantasy_name: myAccountDataPersisted?.x_fantasy_name || partner?.x_fantasy_name || null,
                x_employees_number: myAccountDataPersisted?.x_employees_number || partner?.x_employees_number || null,
                x_sales_range: myAccountDataPersisted?.x_sales_range || partner?.x_sales_range || null,
                x_project_name: myAccountDataPersisted?.x_project_name || partner?.x_project_name || null,
                phone: myAccountDataPersisted ? dataPerAccount.phone : session?.userInfo?.phone ? session?.userInfo?.phone : null,
                name: myAccountDataPersisted ? dataPerAccount.name : session?.userInfo?.name ? session?.userInfo?.name : null,
                country_id: myAccountDataPersisted?.country_id || partner?.country_id || null,
            });
        } else {
            if (session) {
                setMyAccountData({
                    ...initialMyAccountData,
                    company_id: session.userInfo.company_id[0],
                    id: session.userInfo.partner_id[0]
                });
            }
        }

    }, [partner, myAccountDataPersisted])

    useEffect(() => {
        setLoadinMyAccount(false);
        if (myAccountData.id && myBankAccountData.acc_number) {
            if (checkProperties(myAccountData) && checkProperties(myBankAccountData))
                setToSellerAccount(true);
        }
    }, [myAccountData.id, myBankAccountData.acc_number])

    const handleSubmitBankAccount = async () => {
        delete myAccountData.banks;
        if (checkProperties(myAccountData) && checkProperties(myBankAccountData)) {
            myAccountData['id'] !== null ? updatePartner() : addPartner();
        } else {
            openNotification({ status: false, content: 'Faltan datos por completar!' });
        }
    }

    const handleSubmitCompanyData = async () => {
        myAccountData['id'] !== null ? updatePartner() : addPartner();
    }

    const addPartner = () => {
        dispatch(Actions.addPartner());
        partnerApi.insert(myAccountData)
            .then(res => {
                setToSellerAccount(true);
                dispatch(Actions.addPartnerSuccess(res.data));
                openNotification({ status: true, content: 'Datos de la cuenta guardados con éxito!' });
            })
            .catch(error => {
                setToSellerAccount(false);
                const message = error?.response?.data?.message;
                dispatch(Actions.addPartnerFailed());
                openNotification({ status: false, content: message ? `${message}` : 'Error al guardar los datos de la cuenta!' });
            })
    }

    const updatePartner = () => {
        dispatch(Actions.updatePartner());
        partnerApi.update(myAccountData)
            .then(res => {
                const response = res.data;
                setToSellerAccount(true);
                dispatch(Actions.updatePartnerSuccess(response));
                dispatch(ActionsSession.updateUserInfo(myAccountData));
                getDataByPartner();
                openNotification({ status: true, content: 'Se actualizaron los datos de la cuenta!' });
                { session?.userInfo?.isAdmin || session?.userInfo?.x_can_publish ? setSelected(selected + 2) : setSelected(selected + 3) }
            })
            .catch(error => {
                setToSellerAccount(false);
                dispatch(Actions.updatePartnerFailed());
                const message = error?.response?.data?.message;
                openNotification({ status: false, content: message ? message : 'Error al actualizar los datos de la cuenta!' });
            })
    }

    const getDataByPartner = () => {
        dispatch(Actions.getPartner());
        partnerApi.findById(session.userInfo.partner_id[0])
            .then(res => {
                if (res.status === 200) {
                    delete res.data.parent_id;
                    delete res.data.x_product_template_ids;
                    dispatch(Actions.getPartnerSuccess(res.data));
                }
                else { dispatch(Actions.getPartnerFailed(res.data.message)); }
            })
            .catch(error => {
                dispatch(Actions.getPartnerFailed(error.response.data.message));
            })
    }

    useEffect(() => {
        if ([0].includes(selected) && (myAccountData?.acc_number && myAccountData?.banks)) {
            dispatch(Actions.savePartnerData(myAccountData));
        }
        if (selected === 1) {
            dispatch(Actions.savePartnerData(myAccountData));
        }
    }, [selected])

    return (
        <div className="content-div">
            <Row>
                <Col xs={8} sm={8} md={4}>
                    <Link to="/" >
                        <LeftOutlined className="side-bar-icon-back" />
                    </Link>
                    <Avatar size={44} icon={<UserOutlined />} />
                </Col>
                <Col xs={16} sm={16} md={20} className="text-align-left">
                    <span className="font-size-20">{t('myAccount.section')}</span><br />
                    <span>{t('myAccount.subPrincipalTitle')}</span>
                </Col>
            </Row>
            <Row className="margin-top-50">
                <Col span={24}>
                    <Layout>
                        <Sider width={200}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={[selected.toString()]}
                                openKeys={[selected.toString()]}
                                selectedKeys={[selected.toString()]}
                                className="side-bar-menu"
                            >
                                <Menu.Item onClick={() => { setSelected(0) }} key="0">
                                    {t('myAccount.sideBarItem1')} {selected === 0 && !myAccountDatastatus ?
                                        <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" />
                                        : (selected === 0 && myAccountDatastatus) || selected >= 1 ?
                                            <CheckCircleFilled className="check-status-my-account side-bar-icon-item dot-green" />
                                            : <span className="dot-gray margin-left-40" />}
                                </Menu.Item>
                                {/*<Menu.Item onClick={() => {
                                    if (myBankAccountDataStatus) {
                                        setSelected(1);
                                    }
                                }} key="1">{t('myAccount.sideBarItem2')}
                                    {selected === 0 && !myBankAccountData.bank && !myBankAccountData.acc_number ?
                                        <span className="dot-gray margin-left-40" />
                                        : ((selected === 1 && !myBankAccountDataStatus) ||
                                            (selected === 0 && (!myBankAccountDataStatus && (myBankAccountData.bank || myBankAccountData.acc_number)))) ?
                                            <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" />
                                            : ((selected === 1 && myBankAccountDataStatus) || (selected === 0 && myBankAccountDataStatus) || selected > 1)
                                            &&
                                            <CheckCircleFilled className="check-status-my-account side-bar-icon-item dot-green" />}
                                </Menu.Item>*/}
                                {(session?.userInfo?.isAdmin || session?.userInfo?.x_can_publish) && (
                                    <>
                                        <Menu.Item onClick={() => {
                                            { (profileCompleted.res) && setSelected(2) }
                                        }} key="2">{t('myAccount.sideBarItem3')}
                                            {(selected === 2 && !session?.userInfo?.sellerAccountStatus)
                                                && <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" />}
                                            {(selected > 2 || session?.userInfo?.sellerAccountStatus)
                                                && <CheckCircleFilled className="check-status-my-account side-bar-icon-item dot-green" />}
                                            {(selected < 2 && !session?.userInfo?.sellerAccountStatus)
                                                && <span className="dot-gray margin-left-40" />}
                                        </Menu.Item>
                                    </>
                                )}
                                <Menu.Item key="3">{t('myAccount.sideBarItem4')}
                                    {selected === 3 && <CheckCircleFilled className="check-status-my-account side-bar-icon-item primary" />}
                                    {selected < 3 && <span className="dot-gray  side-bar-icon-item margin-left-40" />}
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout className="padding-layout">
                            <Content
                                className="site-layout-background padding-layout-content"
                            >
                                {selected === 0 && (
                                    <CompanyData
                                        myAccountData={myAccountData}
                                        setMyAccountData={setMyAccountData}
                                        loadingMyAccount={loadingMyAccount}
                                        handleSubmit={handleSubmitCompanyData}
                                        setSelected={setSelected} selected={selected} />
                                )}
                                {selected === 1 && (
                                    <BankAccountData
                                        toSellerAccount={toSellerAccount}
                                        isCompleted={myBankAccountDataStatus}
                                        myBankAccountData={myBankAccountData}
                                        handleSubmit={handleSubmitBankAccount}
                                        setMyBankAccountData={setMyBankAccountData}
                                        setSelected={setSelected} selected={selected}
                                    />
                                )}
                                {selected === 2 && (
                                    <MySellerAccount
                                        mySellerAccount={mySellerAccount}
                                        setMySellerAccount={setMySellerAccount}
                                        setSelected={setSelected} selected={selected}
                                    />
                                )}
                                {selected === 3 && (
                                    <Welcome setSelected={setSelected} selected={selected} />
                                )}
                            </Content>
                        </Layout>
                    </Layout>
                </Col>
            </Row>
        </div >
    )
}