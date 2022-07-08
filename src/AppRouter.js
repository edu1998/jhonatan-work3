import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Pages
import { Home } from './pages/home/Home';
import { Login } from './pages/login/Login';
import { NotFound } from './pages/NotFound';
import { MyAccount } from './pages/myAccount/MyAccount';

import { SessionExpired } from './pages/SessionExpired';
import DocumentsCRUD from './pages/client-important-info/DocumentsCRUD';
// Auth
import { isExpired } from './helpers/auth-helpers';
import { initAxiosInterceptors } from './api/api';
// Redux
import { useDispatch, useSelector } from "react-redux";
import Index from './routers/index';
import { Onboarding } from './pages/onboarding/Onboarding';
import OnboardingIndex from './pages/onboarding/index';
import Support from './pages/support/index';
import RequestPasswordReset from './pages/login/RequestPasswordReset';
import ResetPassword from './pages/login/ResetPassword';
import { Order } from './pages/order/Order';
import Pedidos from './pages/order/Pedidos';
import Clients from './pages/Clients/index';
import DocumentsIndex from './pages/perfil/subPages/documents';
import { NewOrder } from './pages/order/NewOrder';
import { Analytics } from './pages/analytics/Analytics';
import { DataStudio } from './pages/dataStudio/DataStudio';
import { ServerStatus } from './pages/status/ServerStatus';
import * as queryString from 'query-string';
import accessKeysApi from './api/aws-access-keys'
import { Spin } from 'antd';

const AppRouter = () => {
    const dispatch = useDispatch();
    const session = useSelector(store => store.Session.session);
    const language = useSelector(store => store.Session.language);
    const [loadingConsent, setLoadingConsent] = useState(false);
    const token = session?.token;
    if (token) {
        if (isExpired(token) && !['/login', '/recover-password', '/my-account/seller-account/Shopify'].includes(window.location.pathname) && !window.location.pathname.includes('/reset-password')) {
            window.location = "/session-expired";
        } else {
            initAxiosInterceptors(token, language);
        }
    } else if (!token && !['/login', '/recover-password', '/my-account/seller-account/Shopify/consent'].includes(window.location.pathname) && !window.location.pathname.includes('/reset-password')) {
        let qs = queryString.parse(window.location.search);
        if(qs && qs.hmac && qs.shop) {
            //get correct url
            setLoadingConsent(false);
            accessKeysApi.getConsentUrl(0, 'Shopify').then((resp) => {
                let shop = qs.shop.replace('.myshopify.com','');
                window.location = resp.data.consentUrl.replace('%%shop%%', shop);
                setLoadingConsent(false);
            }).catch(() => {
                window.location = '/login';
                setLoadingConsent(false);
            });
        } else {
            window.location = '/login';
        }
        
    }
    
    return (
        <Spin spinning={loadingConsent}>
            {!loadingConsent&&<Router>
                <div className="App">
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/recover-password" component={RequestPasswordReset} />
                        <Route exact path="/reset-password/:partnerId" component={ResetPassword} />
                        <Route exact path="/session-expired" component={SessionExpired} />
                        <Route path="/my-account/seller-account/:marketplace/:consent" component={MyAccount}/>

                        <Index exact path="/" component={Home} roles={['Admin', 'Client', 'Braian Cliente', 'Lap']}/>
                        
                        <Index path="/my-account" component={MyAccount} roles={['Admin', 'Client']}/>
                        <Index exact path="/restock" component={Order} roles={['Admin', 'Client', 'Lap']}/>
                        <Index exact path="/restock/:orderId" component={NewOrder} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/onboarding/:listingId" component={Onboarding} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/onboarding" component={OnboardingIndex} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/productos" component={DocumentsCRUD} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/publicaciones" component={DocumentsCRUD} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/pedidos" component={Pedidos} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/my-documents" component={DocumentsIndex} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/clientes" component={Clients} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/lap-academy" component={DocumentsCRUD} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/analytics" component={Analytics} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/status" component={ServerStatus} roles={['Admin', 'Lap']}/>
                        <Index path="/data-studio/:option/:url" component={DataStudio} roles={['Admin', 'Client', 'Lap']}/>
                        <Index path="/test" component={DocumentsCRUD} roles={['Admin', 'Lap']}/>
                        <Index path="/soporte" component={Support} roles={['Admin', 'Lap', 'Client']}/>
                        <Route path="*" component={NotFound} />
                    </Switch>
                </div>
            </Router>
            }
        </Spin>
    )
}
export default AppRouter