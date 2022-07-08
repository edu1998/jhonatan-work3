import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Actions from '../redux/session/action'
// AntD
import { Menu, Dropdown, Avatar, Spin } from 'antd';
import { UserOutlined, DownOutlined, LogoutOutlined, LoadingOutlined } from '@ant-design/icons';
// Redux
import { useDispatch, useSelector } from "react-redux";
import partnerApi from "../api/partner";
import authApi from "../api/auth";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const DropDownheader = () => {

    const dispatch = useDispatch();
    const [user, setUser] = useState();
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    const session = useSelector(store => store.Session.session);

    async function handleLogout() {
        authApi.logout();
        await dispatch(Actions.logout());
        window.location = "/login";
    }

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

    const menu = (
        <Menu theme="dark">
            <Menu.Item key="1">
                <Link to="/" >
                    {user && `${user.userName.split('@')[0].toUpperCase()} - ${user.userInfo.commercial_partner_id[1]}`}
                </Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<LogoutOutlined />}
                onClick={handleLogout}
            >
                Logout
          </Menu.Item>
        </Menu >
    );

    return (
        <>
            <div id="components-dropdown-demo-dropdown-button">
                {loading ? (
                    <Spin indicator={antIcon}><Avatar icon={<UserOutlined />} /> </Spin>
                ) : (
                    logo ?
                        <Avatar src={'data:image/png;base64,' + logo
                        } /> :
                        <Avatar icon={<UserOutlined />} />
                )}

                {!loading && (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{}}>
                            <DownOutlined style={{ fontSize: '18px', color: '#4D5E6D', padding: '10px' }} />
                        </a>
                    </Dropdown>
                )}
            </div>
        </>
    )
}

export default DropDownheader
