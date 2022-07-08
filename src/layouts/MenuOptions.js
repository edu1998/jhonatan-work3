import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Menu, Button, Switch, Layout, Avatar, Spin } from 'antd';
import newLogo from '../assets/LAP_Marketplace.jpg';
import { nameToSlug } from '../utils/functions';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DropDownheader from './DropDownheader';
import authApi from "../api/auth"
import * as Actions from '../redux/session/action'
import partnerApi from "../api/partner";
import {
    AppstoreOutlined,
    SettingOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    ProfileOutlined,
    MessageOutlined,
    DollarCircleOutlined,
    DesktopOutlined,
    HomeOutlined,
    ContainerOutlined,
    LogoutOutlined,
    IdcardOutlined,
    FolderOutlined,
    BankOutlined,
    TeamOutlined,
    LoadingOutlined,
    UserOutlined,
    MailOutlined,
} from '@ant-design/icons';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const MenuOptions = ({ changeMenu, widthMenu }) => {

    const { Footer } = Layout;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [dashboardAnalitycs, setDashboardAnalitycs] = useState([])
    const session = useSelector(store => store.Session.session);
    const [mode, setMode] = useState('inline');
    const [theme, setTheme] = useState('dark');
    const [collapsed, setCollapsed] = useState(false);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [initLoading, setInitLoading] = useState(true);
    
    const linkAdapte = (value) => {
        let link = new String(value)
        let arrayBase = link.split('https://datastudio.google.com/embed/reporting/')
        let arrayFinal = arrayBase.splice(1)
        return arrayFinal[0]
    }

    async function handleLogout() {
        authApi.logout();
        await dispatch(Actions.logout());
        window.location = "/login";
    }

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
                setInitLoading(false)
                setDashboardAnalitycs(newData)
            } else {
                let link = new String(session.userInfo.website);
                let arrayBase = link.split('[');
                if (Array.isArray(arrayBase) && arrayBase?.length > 1) {
                    try {
                        let newJson = JSON.parse(`[${arrayBase[1]}`);
                        setDashboardAnalitycs(newJson);
                    } catch (error) {
                        console.log('Error on setDashboardAnalitycs Headers, ', error);
                    }
                }
                setInitLoading(false)
            }
        }
    }, [])

    useEffect(() => {
        if (session && session.userInfo) {
            setUser(session);
            if (!logo) getLogo();
        }
        return () => {
            setLogo(null);
            setLoading(false);
        }
    }, [session])

    const getLogo = () => {
        setLoading(true);
        partnerApi.findLogoById(session.userInfo.partner_id[0])
            .then(res => {
                setLogo(res.data)
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
            })
    }

    return (
        <div className="contentMenuOptions">
        {
            /*
                    <div style={{ position: 'fixed', marginLeft: 40 }}>
                        <div style={{ position: 'absolute', top: '500px', width: '150px'}}>
                            <Link><LogoutOutlined /> Cerrar Sesión</Link>
                        </div>
                    </div>          
    */
        }
            {
                !widthMenu.options ? (
                    <div style={{ marginTop: 100 }}>
                        <Menu mode={'vertical'} theme={theme} defaultSelectedKeys={['/']} selectedKeys={[window.location.pathname]} style={{ marginLeft: 'auto', backgroundColor: '#010c33' }} inlineCollapsed={collapsed}>
                            <Menu.SubMenu key="/" title={<Link to="/" ><AppstoreOutlined /></Link>}>
                                <Menu.Item key="/">
                                    <Link to="/" ><AppstoreOutlined />Dashboard</Link>
                                </Menu.Item>
                                {
                                    dashboardAnalitycs.map((item) => (
                                        <Menu.Item key={`/data-studio/${nameToSlug(item.name)}/${linkAdapte(item.url)}`}>
                                            <Link to={`/data-studio/${nameToSlug(item.name)}/${linkAdapte(item.url)}`} >{item.name}</Link>
                                        </Menu.Item>                                    
                                    ))
                                }
                            </Menu.SubMenu>
                            <Menu.SubMenu key="#" title={<Link to="#" ><ProfileOutlined /></Link>}>
                                <Menu.Item key="/onboarding">
                                    <Link to="/onboarding" >Tus publicaciones</Link>
                                </Menu.Item>
                                <Menu.Item key="/productos">
                                    <Link to="/productos" >Tus productos</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                            <Menu.SubMenu key="/restock" title={<Link to="/restock" ><DollarCircleOutlined /></Link>}>
                                <Menu.Item key="/restock">
                                    <Link to="/restock" >Restock</Link>
                                </Menu.Item>
                                <Menu.Item key="/pedidos">
                                    <Link to="/pedidos" >Pedidos</Link>
                                </Menu.Item>
                            </Menu.SubMenu>
                            {
                               /* <Menu.Item key="/lap-academy">
                                    <Link to="/lap-academy" ><BankOutlined /></Link>
                                </Menu.Item>*/
                            }

                            {
                                session.userInfo.isAdmin ?
                                    <>
                                        <Menu.Item key="/clientes">
                                            <Link to="/clientes" ><TeamOutlined /></Link>
                                        </Menu.Item>
                                        <Menu.Item key="/status">
                                            <Link to="/status" ><IdcardOutlined /></Link>
                                        </Menu.Item>
                                    </>
                                    :
                                    <></>
                            }

                            <Menu.SubMenu className="menuAvatar" style={{ marginTop: 200, marginBottom: 10 }} key="perfil" title={<Link to="#" >
                                {loading ? (
                                    <Spin indicator={antIcon}><Avatar icon={<UserOutlined />} /> </Spin>
                                ) : (
                                    logo ?
                                        <Avatar style={{ marginBottom: 20, marginLeft: -15 }} src={'data:image/png;base64,' + logo
                                        } /> :
                                        <Avatar style={{ marginBottom: 20, marginLeft: -15 }} icon={<UserOutlined />} />
                                )}</Link>}>
                                {
                                    session.userInfo.login.split('@')[0].toUpperCase() != 'TECH' ?
                                        <>
                                            <Menu.Item key="/my-account">
                                                <Link to="/my-account" ><HomeOutlined /> {t('menu.myAccount')}</Link>
                                            </Menu.Item>
                                            <Menu.Item key="/my-documents">
                                                <Link to="/my-documents" ><FolderOutlined /> Mis Documentos</Link>
                                            </Menu.Item>
                                            <Menu.Item key="/soporte">
                                                <Link to="/soporte" ><MessageOutlined /> Soporte</Link>
                                            </Menu.Item>
                                            <Menu.Item key="" style={{ marginTop: 30 }} onClick={handleLogout}>
                                                <Link><LogoutOutlined /> Cerrar Sesión</Link>
                                            </Menu.Item>
                                        </>
                                        :
                                        <>
                                            <Menu.Item key="/soporte">
                                                <Link to="/soporte" ><MessageOutlined /> Soporte</Link>
                                            </Menu.Item>
                                            <Menu.Item key="" style={{ marginTop: 30 }} onClick={handleLogout}>
                                                <Link><LogoutOutlined /> Cerrar Sesión</Link>
                                            </Menu.Item>
                                        </>
                                }
                            </Menu.SubMenu>
                        </Menu>
                    </div>
                ) :
                    (
                        <div style={{ marginTop: 9 }}>
                            <Menu mode={mode} theme={theme} defaultSelectedKeys={['/']} selectedKeys={[window.location.pathname]} style={{ marginLeft: 'auto', backgroundColor: '#010c33' }} inlineCollapsed={collapsed}>
                                <Menu.SubMenu key="/" title={<Link to="/" ><AppstoreOutlined /> Dashboard</Link>}>
                                    <Menu.Item key="/">
                                        <Link to="/" ><AppstoreOutlined /> Dashboard</Link>
                                    </Menu.Item>
                                    {
                                        dashboardAnalitycs.map((item) => (
                                            <Menu.Item key={`/data-studio/${nameToSlug(item.name)}/${linkAdapte(item.url)}`}>
                                                <Link to={`/data-studio/${nameToSlug(item.name)}/${linkAdapte(item.url)}`} >{item.name}</Link>
                                            </Menu.Item>                                    
                                        ))
                                    }
                                </Menu.SubMenu>
                                {
                                    !session.userInfo.isAdmin ?
                                        <Menu.SubMenu key="/onboarding" title={<Link to="/onboarding" ><ProfileOutlined /> Listings</Link>}>
                                            <Menu.Item key="/onboarding">
                                                <Link to="/onboarding" >Tus publicaciones</Link>
                                            </Menu.Item>
                                            {/* <Menu.Item key="/productos">
                                                <Link to="/productos" >Tus productos</Link>
                                            </Menu.Item> */}
                                        </Menu.SubMenu>
                                        :
                                        <></>
                                }
                                <Menu.SubMenu key="/restock" title={<Link to="/restock" ><DollarCircleOutlined /> Orders</Link>}>
                                    <Menu.Item key="/restock">
                                        <Link to="/restock" >Restock</Link>
                                    </Menu.Item>
                                    <Menu.Item key="/pedidos">
                                        <Link to="/pedidos" >Pedidos</Link>
                                    </Menu.Item>
                                </Menu.SubMenu>
                                {/* <Menu.Item key="/lap-academy">
                            <Link to="/lap-academy" ><BankOutlined /> Lap Academy</Link>
                        </Menu.Item>                       */}
                                {session.userInfo.isAdmin ?
                                    <>
                                        <Menu.Item key="/clientes">
                                            <Link to="/clientes" ><TeamOutlined /> Clientes</Link>
                                        </Menu.Item>
                                        <Menu.Item key="/status">
                                            <Link to="/status" ><IdcardOutlined /> Estado</Link>
                                        </Menu.Item>
                                    </>
                                    :
                                    <></>
                                }
                                <Menu.SubMenu style={{ marginTop: 205 }} key="#1" title={<Link to="#" >
                                    {loading ? (
                                        <Spin indicator={antIcon}><Avatar icon={<UserOutlined />} /> </Spin>
                                    ) : (
                                        logo ?
                                            <Avatar style={{ marginRight: 5 }} src={'data:image/png;base64,' + logo
                                            } /> :
                                            <Avatar style={{ marginRight: 5 }} icon={<UserOutlined />} />
                                    )}  Mi Perfil</Link>}>
                                    {
                                        session.userInfo.login.split('@')[0].toUpperCase() != 'TECH' ?
                                            <>
                                                <Menu.Item key="/my-account">
                                                    <Link to="/my-account" ><HomeOutlined /> {t('menu.myAccount')}</Link>
                                                </Menu.Item>
                                                <Menu.Item key="/my-documents">
                                                    <Link to="/my-documents" ><FolderOutlined /> Mis Documentos</Link>
                                                </Menu.Item>
                                                <Menu.Item key="/soporte">
                                                    <Link to="/soporte" ><MessageOutlined /> Soporte</Link>
                                                </Menu.Item>
                                                <Menu.Item key="" style={{ marginTop: 30 }} onClick={handleLogout}>
                                                    <hr />
                                                    <Link><LogoutOutlined /> Cerrar Sesión</Link>
                                                </Menu.Item>                                
                                            </>
                                            :
                                            <>
                                                <Menu.Item key="/soporte">
                                                    <Link to="/soporte" ><MessageOutlined /> Soporte</Link>
                                                </Menu.Item>
                                            </>
                                    }
                                </Menu.SubMenu>
                            </Menu>
                        </div>

                    )
            }


        </div>
    )
}

export default MenuOptions