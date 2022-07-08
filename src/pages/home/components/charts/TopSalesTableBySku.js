import React, { useState, useEffect } from 'react';
import selectors from '../../../../redux/analytic/dashboard/selectors';
import { useSelector } from 'react-redux';
import { Table, Typography } from 'antd';
import {TableTop} from "../../../../components/TableTop/TableTop";
import {adapterDataTable, getAllProducts} from "../../../../helpers/analytic-helper";

const { Text } = Typography;

const TopSalesTableBySku = () => {
    const [data, setData] = useState([]);
    const rows = useSelector(selectors.selectRows);
    const session = useSelector(store => store.Session.session);

    const analyticData = useSelector(store => store?.Analytic?.dashboard?.rows)

    useEffect(() => {
        let values = [];
        if (!session?.userInfo?.isAdmin) {
            if (rows?.length > 0 && Array.isArray(rows[0].children)) {
                if (rows[0]?.children?.length > 0) {
                    for (const marketplace of rows[0].children) {
                        if (marketplace?.children?.length > 0) {
                            for (const listing of marketplace?.children) {
                                if (listing?.children?.length > 0) {
                                    for (const product of listing?.children) {
                                        values.push({
                                            title: product.title,
                                            defaultCode: product.defaultCode,
                                            marketplace: product.marketplace,
                                            sumQuantitySold: product.sumQuantitySold
                                        });
                                    }
                                } else {
                                    values.push({
                                        title: listing.title,
                                        defaultCode: listing.defaultCode,
                                        marketplace: listing.marketplace,
                                        sumQuantitySold: listing.sumQuantitySold
                                    });
                                }
                            }
                            setData(values?.sort((a, b) => { return b.sumQuantitySold - a.sumQuantitySold })?.slice(0, 10));
                        }
                    }
                }
            }
        }
    }, [rows])

    const columns = [
        {
            title: 'Top',
            dataIndex: 'top',
            key: 'top',
            render: (value, record, index) => <Text ellipsis={{ tooltip: record?.title }}>{index+1}</Text>
        },
        {
            title: 'SKU',
            dataIndex: 'defaultCode',
            key: 'defaultCode',
        },
        {
            title: 'Cantidad Vendida',
            dataIndex: 'sumQuantitySold',
            key: 'sumQuantitySold',
        },
    ];

    const getTopDataTable = (chartData) => adapterDataTable(getAllProducts(chartData));


    // return <Table dataSource={data.filter((element, index) => index <= 4)} pagination={false} columns={columns} />;
    return <TableTop topData={getTopDataTable(analyticData)} range={[0, 5]} />

};
export default React.memo(TopSalesTableBySku);
