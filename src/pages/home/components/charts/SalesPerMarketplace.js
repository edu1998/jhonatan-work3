import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { useSelector } from 'react-redux';
import { Collapse, Row, Col, Typography, Space } from 'antd';
import selectors from '../../../../redux/analytic/dashboard/selectors';
import {groupingSalesByPurchaseDate} from "../../../../helpers/analytic-helper";
import BarChart from "../../../../components/BarChart/BarChart";

const { Panel } = Collapse;
const { Text } = Typography;

const SalesByMarketplaceAndPurchaseDate = () => {
    const [data, setData] = useState([]);
    const rows = useSelector(selectors.selectRows);
    const session = useSelector(store => store.Session.session);

    const [defaultFormatData, setDefaultFormatData] = useState('MMM')
    const analyticData = useSelector(store => store?.Analytic?.dashboard?.rows)

    useEffect(() => {
        if (!session?.userInfo?.isAdmin) {
            if (rows?.length > 0 && Array.isArray(rows[0].children)) {
                if (rows[0]?.children?.length > 0) {
                    let values = [];
                    for (const marketplace of rows[0].children) {
                        for (const purchaseDate of Object.keys(marketplace?.salesByPurchaseDateUSD)) {
                            values.push({
                                purchaseDate: purchaseDate,
                                marketplace: marketplace.name,
                                currency: marketplace.currency,
                                totalSale: marketplace.salesByPurchaseDateUSD[purchaseDate],
                                totalSaleMkp: marketplace.salesByPurchaseDate[purchaseDate],
                            });
                        }
                    }
                    setData(values);
                }
            }
        }
    }, [rows])

    const config = {
        data: data,
        height: 200,
        theme: {
            colors10: [
                '#010C33',
                '#00E5A6',
                '#FFC100',
                '#9FB40F',
                '#76523B',
                '#DAD5B5',
                '#0E8E89',
                '#E19348',
                '#F383A2',
                '#247FEA',
            ]
        },
        xField: 'purchaseDate',
        yField: 'totalSale',
        seriesField: 'marketplace',
        yAxis: {
            label: {
                formatter: (v) => `${v} USD`,
            },
        },
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
    };

    const getSalesForDates = (chartdata) => groupingSalesByPurchaseDate(chartdata);

    return <Row>
        <Col span={24}>
            <Collapse ghost>
                <Panel header={<Text>Ver valores de conversión</Text>} key="1" ghost>
                    <Row>
                        <Space size={'small'}>
                            {rows && rows[0]?.currencyValues
                                && Object.keys(rows[0]?.currencyValues)?.map(currencyByDate => (
                                    <Col key={currencyByDate}>
                                        <Row>
                                            <Col span={24}>
                                                Fecha: {currencyByDate}
                                            </Col>
                                            <Col span={24} >
                                                {Object.values(rows[0]?.currencyValues[currencyByDate]?.data)?.map(currency => (
                                                    <><Text>1 USD = {currency?.value} {currency?.code}</Text><br/></>
                                                ))}
                                            </Col>
                                        </Row>
                                    </Col>
                                ))}
                        </Space>
                    </Row>
                </Panel>
            </Collapse>
        </Col>
        <Col span={24}>
            <BarChart
                data={getSalesForDates(analyticData)}
                xLabel="type"
                yLabel="sales"
                prefixLabel="$"
                defaultFormat={defaultFormatData}
                onChangeFormat={e => setDefaultFormatData(e)}
            />
            {/*<Column {...config} />*/}
        </Col>
    </Row>
};
export default React.memo(SalesByMarketplaceAndPurchaseDate);
