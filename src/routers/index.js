import React, { useEffect, useState } from 'react';
import Headers from '../layouts/Header';
import MenuOptions from '../layouts/MenuOptions';
import { useSelector } from "react-redux";
import { Layout, Menu, Breadcrumb, Switch } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, LogoutOutlined } from '@ant-design/icons';
import { Redirect, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isExpired } from '../helpers/auth-helpers';
const { Header, Content, Footer, Sider } = Layout;

const Index = ({ component: Component, roles, ...rest }) => {
	
	const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);
    const [token, setToken] = useState(session ? session.token : null);
    const [widthMenu, setWidthMenu] = useState({
    	width: 240,
		marginTop: '30px',
		marginLeft: '30%',
		widthLogo: 50,
		options: [
			{
				title: t('menu.dashboard'),
				path: "dashboard",
				url: "/"
			},
			{
				title: t('menu.listings'),
				path: "listings",
				url: "/listings",
				subOptions: [
					{
						title: t('menu.tus_productos'),
						path: "tus_productos",
						url: "/tus_productos"								
					},
					{
						title: t('menu.tus_publicaciones'),
						path: "tus_publicaciones",
						url: "/tus_publicaciones"								
					}
				]
			},
			{
				title: t('menu.compras'),
				path: "compras",
				url: "/compras"
			},
			{
				title: t('menu.soporte'),
				path: "soporte",
				url: "/soporte"
			},
			{
				title: t('menu.estado'),
				path: "estado",
				url: "/estado"
			}
		]   	
    });

	const items1 = ['1', '2', '3'].map((key) => ({
	  key,
	  label: `nav ${key}`,
	}));

	const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
	  const key = String(index + 1);
	  return {
	    key: `sub${key}`,
	    icon: React.createElement(icon),
	    label: `subnav ${key}`,
	    children: new Array(4).fill(null).map((_, j) => {
	      const subKey = index * 4 + j + 1;
	      return {
	        key: subKey,
	        label: `option${subKey}`,
	      };
	    }),
	  };
	});

    const isAuthorized = () => {
        if (token && session && roles) {
            if(session.userInfo.login.split('@')[0].toUpperCase() === 'TECH') {
                return roles.includes('Lap');
            }
            return roles.includes(session.userInfo.role);
        }
        return false;
    }

    const changeMenu = (value) => {
    	setWidthMenu(value ? {
		      	width: 90,
				marginTop: '30px',
				marginLeft: '18%',
				widthLogo: 25,
				options: false
    		} : {
		    	width: 250,
				marginTop: '30px',
				marginLeft: '25%',
				widthLogo: 50,
				options: [
					{
						title: t('menu.dashboard'),
						path: "dashboard",
						url: "/"
					},
					{
						title: t('menu.listings'),
						path: "listings",
						url: "/listings",
						subOptions: [
							{
								title: t('menu.tus_productos'),
								path: "tus_productos",
								url: "/tus_productos"								
							},
							{
								title: t('menu.tus_publicaciones'),
								path: "tus_publicaciones",
								url: "/tus_publicaciones"								
							}
						]
					},
					{
						title: t('menu.compras'),
						path: "compras",
						url: "/compras"
					},
					{
						title: t('menu.soporte'),
						path: "soporte",
						url: "/soporte"
					},
					{
						title: t('menu.estado'),
						path: "estado",
						url: "/estado"
					}
				]
    		})
    }

	return (
	<>
	  <Layout>
	    <Content>
	      <Layout className="site-layout-background">
	        <Sider style={{ backgroundColor: '#20303c', posicion: 'absolute', height: '100vh' }} width={widthMenu.width}>
	        	<div className="menuLateral" style={{ width: widthMenu.width }}> 	      
				  <Switch style={{ marginTop: '5%'}} onChange={changeMenu} />
		          <Headers widthMenu={widthMenu}/>
		          <MenuOptions changeMenu={changeMenu} widthMenu={widthMenu}/> 
	          	</div>   
	        </Sider>
	        <Content>
	            {isAuthorized() ?
	                <Route {...rest}>
	                    {!isExpired(token) ?
	                        <Component /> : <Redirect to="/session-expired" />
	                    }
	                </Route> : <Redirect to="/login" />}
	        </Content>
	      </Layout>
	    </Content>
	  </Layout>
	  </>
	)
};

export default Index;