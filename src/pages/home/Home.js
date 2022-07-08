import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Layout } from 'antd';
import DashboardFilter from './components/DashboardFilter';
import DashboardTable from './components/DashboardTable';
import SalesByMarketplaceAndPurchaseDate from './components/charts/SalesPerMarketplace';
import { BellOutlined, WarningOutlined } from '@ant-design/icons';
import { checkProfile } from '../../utils/functions';
import partnerApi from '../../api/partner';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../../redux/partner/action';
import { getErrorMessage } from '../../api/api';
import TopSalesTableBySku from './components/charts/TopSalesTableBySku';
import TopSalesPieChartBySku from './components/charts/TopSalesPieChartBySku';
import SalesPieChartByMarketplace from './components/charts/SalesPieChartByMarketplace';
import selectors from '../../redux/analytic/dashboard/selectors';
import 'antd/dist/antd.css';
import './home.css';

const { Title } = Typography;

export const Home = () => {
    const dispatch = useDispatch();
    const session = useSelector(store => store.Session.session);
    const loading = useSelector(selectors.selectLoading);

    const [profileCompleted, setProfileCompleted] = useState(false);
    const [listingCounter, setListingCounter] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [countListings, setCountListings] = useState([]);

    let partnerId = 1; // admin
    const isAdmin = session.userInfo.isAdmin;
    if (!isAdmin) {
        partnerId = session.userInfo.commercial_partner_id[0];
    }

    useEffect(() => {
        if (session) {
            setLoadingProfile(true);
            dispatch(Actions.getPartner());
            partnerApi.findById(session.userInfo.partner_id[0])
                .then(res => {
                    if (res.status === 200) {
                        delete res.data.x_product_template_ids;
                        dispatch(Actions.getPartnerSuccess(res.data));
                        setProfileCompleted(checkProfile(res.data, session.userInfo));
                        setLoadingProfile(false);
                    }
                    else { dispatch(Actions.getPartnerFailed(res.data.message)); }
                })
                .catch(error => {
                    setLoadingProfile(false);
                    dispatch(Actions.getPartnerFailed(getErrorMessage(error)));
                })
        }
    }, [])

    useEffect(() => {
        if (session) {
            const values = {
                partnerId: session.userInfo.commercial_partner_id[0]
            }
            partnerApi.getListingsPerPage(values)
                .then(res => {
                    if (res.status === 200) {
                        let arrList = res?.data?.data.map(obj => obj.state)
                        let count = {}
                        arrList.forEach(function (x) { count[x] = (count[x] || 0) + 1 })
                        setListingCounter(res.data);
                        setCountListings(count)
                    }
                    else { console.log(res.data.message) }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [])

    return (
        <div className="content-div" style={{ backgroundColor: '#f9f9f9' }}>
            <Row>
                <Col span={11} style={{ textAlign: 'left' }}>
                    <Card bordered={false} style={{ width: '98.5%', height: '100%' }}>
                        <Row>
                            <Col span={12}>
                                <Title level={3} className="titlePages">Bienvenido {session?.userInfo?.name}</Title>
                                {!session?.userInfo?.isAdmin && <span>¡Completa tus datos y empecemos a vender más!</span>}
                            </Col>
                        </Row>
                        {!session?.userInfo?.isAdmin &&
                            <Row>
                                <Col span={12}>
                                    <div className="home-info">
                                        <div>
                                            <BellOutlined />
                                            <span className="home-info-text">{`Tienes ${listingCounter?.data?.length || 0} Listing(s) cargado(s)`}</span>
                                        </div>
                                        <div>
                                            <WarningOutlined />
                                            <span className="home-info-text">Pendientes LAP: {countListings?.Pendiente || 0}</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        }
                    </Card>
                </Col>
                <Col span={13}>
                    <Card bordered={false} style={{ width: '100%', height: '100%' }}>
                        <Row justify="end">
                            <Col >
                                { /*<UpdateDate/>*/}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ marginTop: 30 }}>
                                <DashboardFilter isAdmin={isAdmin} partnerId={partnerId} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: 5 }}>
            </Row>
            {!loading &&
                <>
                    <Row style={{ textAlign: 'left' }}>
                        <Col span={24}>
                            <Card bordered={false} style={{ width: '100%', marginTop: 5 }}>
                                <Title level={4}>Resumen de ventas</Title>
                                <SalesByMarketplaceAndPurchaseDate />
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ textAlign: 'left' }}>
                        <Col span={10}>
                            <Card bordered={false} style={{ width: '100%', marginTop: 5, height: '99%' }}>
                                <Title level={4}>Top 5 ventas</Title>
                                <TopSalesTableBySku />
                            </Card>
                        </Col>
                        <Col span={7}>
                            <Card bordered={false} style={{ width: '100%', marginTop: 5 }}>
                                <Title level={4}>Ventas por SKU</Title>
                                <TopSalesPieChartBySku />
                            </Card>
                        </Col>
                        <Col span={7}>
                            <Card bordered={false} style={{ width: '100%', marginTop: 5 }}>
                                <Title level={4}>Ventas por marketplace</Title>
                                <SalesPieChartByMarketplace />
                            </Card>
                        </Col>
                    </Row>
                </>
            }
            <Row>
                <Col span={24}>
                    <div className="site-card-border-less-wrapper" style={{ marginTop: 10 }}>
                        <Card bordered={false} style={{ width: '100%' }}>
                            <Row>
                                <Col span={12} style={{ textAlign: 'left' }}>
                                    <Title level={5}></Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} style={{ textAlign: 'left', marginTop: 30, overflowY: 'hidden' }}>
                                    <Row>
                                        <Layout className="padding-layout" style={{ width: '100%' }}>
                                            <div className="site-layout-background padding-layout-content content-padding" style={{ width: '100%' }}>
                                                <Col span={24} xs={24} sm={24} md={24}>
                                                    <DashboardTable></DashboardTable>
                                                </Col>
                                            </div>
                                        </Layout>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
