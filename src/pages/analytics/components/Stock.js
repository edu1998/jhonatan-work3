import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Card, Spin, Input, DatePicker } from "antd";
import {
    UnorderedListOutlined,
    UpOutlined,
    DownOutlined,
    ProfileTwoTone
} from "@ant-design/icons";
import { openNotification } from "../../../components/Toastr";
import { SearchOutlined } from '@ant-design/icons';
import { TableStock } from "./TableStock";
import { useTranslation } from 'react-i18next';

const Sales = ({ profileCompleted }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState();
    const [showTable, setShowTable] = useState(true);
    const session = useSelector((store) => store.Session.session);

    useEffect(async () => {
        if (true) {
            setLoading(true);
            //setSales(datas);
            setLoading(false);
        } else {
            setLoading(true);
            //setSales(datas);
            setLoading(false);
        }
    }, []);

    const onPresEnterSearch = async (event) => {
        console.log("Enter pressed!!! should now search with term: ", event.target.value, " ...");
    }

    const onChangeDatePicker = async (event) => {
        console.log("El valor del date picker: ", event);
    }

    const toggleShowTable = () => {
        setShowTable(!showTable);
    }

    return !loading ? (
        <Row>
            <Col span={24} xs={24} sm={24} md={24} lg={24} xl={24}>
                <Card className="home-listing-card">
                    <Row>
                        <Col span={10} xs={10} sm={10} md={10}>
                            <div className="home-listing-card-content">
                                <Col>
                                    <Row>
                                        <span style={{ fontSize: '30px'}} >
                                            <ProfileTwoTone style={{ fontSize: '30px', color: '#08c' }} className="btn-primary home-listing-title-icon" />
                                            {t('analytics.stock.title')}
                                        </span>
                                    </Row>
                                    <Row>
                                        <span  className="home-listing-title-description">
                                            {t('analytics.stock.subtitle')}
                                        </span>
                                    </Row>
                                </Col>
                            </div>
                        </Col>
                        <Col span={6} xs={4} sm={8} md={12} >
                            <Row className='sales-search-row'>
                                {showTable ?
                                    <>
                                        <Col style={{ marginRight: '15px' }}>
                                            <Input style={{ marginTop: '22px' }} size='large' placeholder="Buscar" prefix={<SearchOutlined />} onPressEnter={onPresEnterSearch} />
                                        </Col>
                                        <Col style={{ marginLeft: '15px' }}>
                                            <Row >
                                                <Col style={{ width: '50%', textAlign: 'left' }}>
                                                    <span>Desde</span>
                                                </Col>
                                                <Col style={{ width: '50%', textAlign: 'left' }}>
                                                    <span>Hasta</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Input.Group compact>
                                                    <DatePicker.RangePicker size='large' onChange={onChangeDatePicker} style={{ width: '100%' }} />
                                                </Input.Group>
                                            </Row>
                                        </Col>
                                    </>
                                    :
                                    <Col style={{ marginTop: '23px', fontSize: '18px', color: 'grey' }}>
                                        <span >Press the arrow to open the table...</span>
                                    </Col>
                                }
                            </Row>
                        </Col>
                        <Col span={2} xs={2} sm={2} md={2}>
                            <Row style={{ width: '150px', justifyContent: 'center', marginTop: '12px' }}>
                                {showTable ?
                                    <UpOutlined style={{ fontSize: '50px', color: '#08c' }} onClick={toggleShowTable} />
                                    :
                                    <DownOutlined style={{ fontSize: '50px', color: '#08c' }} onClick={toggleShowTable} />
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row className="home-listing-table-parent">
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <TableStock
                                datas={null}
                                profileCompleted={profileCompleted}
                                session={session}
                                show={showTable}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    ) : (
        <Row justify="center" align="middle">
            <Col>
                <Spin size="large" />
            </Col>
        </Row>
    );
};

export default React.memo(Sales);
