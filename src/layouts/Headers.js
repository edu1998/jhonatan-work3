import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// AntD
import { Layout, Menu } from 'antd';
import DropDownheader from './DropDownheader';
//
import newLogo from '../assets/LAP_Marketplace.jpg';
import { nameToSlug } from '../utils/functions';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const { Header } = Layout;


export const Headers = () => {

    const { t } = useTranslation();
    const [dashboardAnalitycs, setDashboardAnalitycs] = useState([])
    const session = useSelector(store => store.Session.session);


    useEffect(() => {
        if (session.userInfo.website) {
            let validData = session.userInfo.website.split('https://datastudio.google.com/embed/reporting/')
            if (validData[0] === "") {
                let valueArrayViejo = validData.splice(1)
                let newData = valueArrayViejo.map((data, index) => {
                    return {
                        id: index,
                        name: index === 0 ? 'Ventas' : index === 1 ? 'Marketing' : index === 2 ? 'Reportes en vivo' : 'NameDefault',
                        url: `https://datastudio.google.com/embed/reporting/${data}`,
                    }
                })
                setDashboardAnalitycs(newData)
            } else {
                let link = new String(session.userInfo.website);
                let arrayBase = link.split('[');
                if (Array.isArray(arrayBase) && arrayBase?.length > 1) {
                    try {
                        let newJson = JSON.parse(`[${arrayBase[1]}`);
                        setDashboardAnalitycs(newJson);
                    } catch (error) {
                        console.log('Error on setDashboardAnalitycs Headers, ',error);
                    }
                }
            }
        }
    }, [])

    const linkAdapte = (value) => {
        let link = new String(value)
        let arrayBase = link.split('https://datastudio.google.com/embed/reporting/')
        let arrayFinal = arrayBase.splice(1)
        return arrayFinal[0]
    }

    return (
        <Header className="header" style={{ backgroundColor: '#20303c' }}>
            <div style={{ display: 'inline-flex', width: '100%' }}>
                <div className="logo" >
                    <Link to="/" >
                        <img src={newLogo} className="logo" alt="logo de LAP MKT" height={55} />
                    </Link>
                </div>
                <Menu mode="horizontal" defaultSelectedKeys={['/']} selectedKeys={[window.location.pathname]} style={{ marginLeft: 'auto' }}>
                    <Menu.Item key="/">
                        <Link to="/" >{t('menu.home')}</Link>
                    </Menu.Item>
                    <Menu.Item key="/orders">
                        <Link to="/orders" >{t('menu.orders')}</Link>
                    </Menu.Item>

                    <Menu.SubMenu key="analytics" title={<Link to="/analytics" >{t('menu.analytics')}</Link>}>
                        <Menu.Item key="/analytics">
                            <Link to="/analytics" >{t('menu.analytics')}</Link>
                        </Menu.Item>
                        {
                            dashboardAnalitycs.map((item) => (
                                item?.url ?
                                    <Menu.Item key={`/data-studio/${nameToSlug(item.name)}/${item.link}`}>
                                        <Link to={`/data-studio/${nameToSlug(item.name)}/${linkAdapte(item.url)}`}>{item.name}</Link>
                                    </Menu.Item>
                                    :
                                    <></>

                            ))
                        }
                    </Menu.SubMenu>
                    {
                        session.userInfo.login.split('@')[0].toUpperCase() != 'TECH' ?
                            <Menu.Item key="/my-account">
                                <Link to="/my-account" >{t('menu.myAccount')}</Link>
                            </Menu.Item>
                            :
                            <></>
                    }
                    {
                        session.userInfo.isAdmin ?
                            <Menu.Item key="/status">
                                <Link to="/status" >Estado</Link>
                            </Menu.Item> :
                            <></>
                    }

                </Menu>
                <div style={{ marginRight: -25, marginLeft: 'auto' }}>
                    <DropDownheader />
                </div>
            </div>
        </Header>

    );
}
