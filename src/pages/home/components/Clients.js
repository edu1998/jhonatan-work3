import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Spin, Card, Input } from 'antd';
import {  UnorderedListOutlined , SearchOutlined } from '@ant-design/icons';
import { TableClients } from './TableClients';
import partnerApi from '../../../api/partner';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';

const { Search } = Input;

const suffix = (
    <SearchOutlined 
        style={{
            fontSize: 16,
            color: '#1890ff',
        }}
    />
);

const Clients = ({ }) => {

    const [loading, setLoading] = useState(false);
    const [partners, setPartners] = useState([]);
    const [filteredPartners, setFilteredPartners] = useState([]);

    const session = useSelector(store => store.Session.session);

    useEffect(() => {
        if (session && session.userInfo.role === 'Admin') {
            getAllPartners();
        }
    }, []);

    const getAllPartners = async () => {
        setLoading(true);
        await partnerApi.findAllForAdmin()
            .then((response) => {
                setLoading(false);
                setPartners(response.data);
                setFilteredPartners(response.data);
            })
            .catch((error) => {
                setLoading(false);
                openNotification({ status: false, content: getErrorMessage(error) });
            })
    }

    const onSearch = (value) => {
        value ? setFilteredPartners(partners.filter((partner) => partner.name.toLowerCase().includes(value.toLowerCase()))) : setFilteredPartners(partners);
    };

    return (
        <Row className="home-listing-main-row">
            <Col span={24} xs={24} sm={24} md={24}>
                <Card className="home-listing-card">
                    {loading ? (
                        <div className="generic-spinner">
                            <Spin />
                        </div>
                    ) : (
                        <>
                            <Row>
                                <Col span={12} xs={24} sm={12} md={10}>
                                    <div className="home-listing-card-content">
                                        <span className="home-listing-title"><UnorderedListOutlined className="btn-primary home-listing-title-icon" />Clientes</span>
                                        <span className="home-listing-title-description">{partners.length} Clientes registrados</span>
                                    </div>
                                </Col>
                                <Col span={12} xs={24} sm={12} md={8} className="home-listing-buttons">
                                    <Search
                                        placeholder="Buscar"
                                        enterButton="Filtrar"
                                        size="large"
                                        suffix={suffix}
                                        onSearch={onSearch}
                                    />
                                </Col>
                            </Row>
                            <Row className="home-listing-table-parent">
                                <Col xs={24} sm={24} md={24}>
                                    <TableClients data={filteredPartners} getAllPartners={partners} />
                                </Col>
                            </Row>
                        </>
                    )}
                </Card>
            </Col>
        </Row>
    );
}

export default React.memo(Clients);