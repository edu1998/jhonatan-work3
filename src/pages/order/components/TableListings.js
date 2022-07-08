import React, { useEffect, useState } from 'react';
import { PrinterFilled, EditOutlined, CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Button, Table, Tooltip, Select, Spin, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import SvgCircleWarning from '../../../utils/icons/SvgCircleWarning';
import { useSelector } from 'react-redux';
import listingApi from '../../../api/listing'
import { openNotification } from '../../../components/Toastr';

const { Option } = Select;

export const TableListings = ({ }) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [amazonListings, setAmazonListings] = useState([]);

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session);

    async function getAllListingsFromAmazon() {
        setLoading(true);
        const { data, error } = await listingApi.getAll();
        
        if(error) 
        openNotification({ status: false, content: 'Error al obtener los listings desde Amazon' });

        if (data) setLoading(false);

        setAmazonListings(data);
    }

    useEffect(() => {
        getAllListingsFromAmazon();
    }, [])

    const columns = [
        {
            title: 'IMAGE',
            dataIndex: 'itemImage',
            key: 'itemImage',
            render: (text, record) => <><img></img>{record.itemAtributes && record.itemAtributes.title}</>
        },
        {
            title: 'FNSKU ASIN',
            dataIndex: 'fnSku',
            key: 'fnSku',
        },
        {
            title: 'SELLER SKU',
            dataIndex: 'sellerSku',
            key: 'sellerSku',
        },
        {
            title: 'CONDITION',
            dataIndex: 'condition',
            key: 'condition',
        },
        {
            title: 'TITLE',
            dataIndex: 'itemTitle',
            key: 'itemTitle',
            render: (text, record) => <>{record.itemAtributes && record.itemAtributes.title}</>
        },
        {
            title: 'ORDER INCLUDES',
            dataIndex: 'order_includes',
            key: 'order_includes',
        },
        {
            title: 'EXPIRATION',
            dataIndex: 'expiration',
            key: 'expiration',
        }
    ];

    return (
        <div id="">
            {loading ?
                <Row justify="center" align="middle" className="generic-spinner-padding">
                    <Col >
                        <Spin size="large" />
                    </Col>
                </Row> :
                <Table dataSource={data} columns={columns} />
            }
        </div>
    )
}