import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Pie, measureTextWidth } from '@ant-design/plots';
import selectors from '../../../../redux/analytic/dashboard/selectors';
import { Typography } from 'antd';
import {PieChart} from "../../../../components/PieChart/PieChart";
import {adapterDataPieChart, getAllProductsBySales} from "../../../../helpers/analytic-helper";

const { Text } = Typography;

const TopSalesPieChartBySku = () => {
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
                                            value: product.sumTotalSoldUSD,
                                            valueMkp: product.sumTotalSold,
                                            currency: product.marketplaceCurrency,
                                            type: `${product.defaultCode} - ${product.marketplace}`,
                                        });
                                    }
                                } else {
                                    values.push({
                                        value: listing.sumTotalSoldUSD,
                                        valueMkp: listing.sumTotalSold,
                                        currency: marketplace.currency,
                                        type: `${listing.defaultCode} - ${listing.marketplace}`,
                                    });
                                }
                            }
                            setData(values?.sort((a, b) => { return b.value - a.value })?.slice(0, 9));
                        }
                    }
                }
            }
        }
    }, [rows])

    function renderStatistic(containerWidth, text, style) {
        const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
        const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

        let scale = 1;

        if (containerWidth < textWidth) {
            scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
        }

        const textStyleStr = `width:${containerWidth}px;`;
        return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`;
    }

    const config = {
        appendPadding: 10,
        data,
        height: 332,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.70,
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
        meta: {
            value: {
                formatter: (v) => `USD ${v}`,
            },
        },
        statistic: {
            title: {
                offsetY: 0,
                style: {
                    fontSize: '9px',
                },
                customHtml: (container, view, datum) => {
                    const { width, height } = container.getBoundingClientRect();
                    const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
                    const text = datum ? datum?.type : data[0]?.type
                    return renderStatistic(d, text, {
                        fontSize: 10,
                    });
                },
            },
            content: {
                offsetY: 0,
                style: {
                    fontSize: '15px',
                    padding: 20
                },
                customHtml: (container, view, datum, data) => {
                    const { width } = container.getBoundingClientRect();
                    const valueUSD = data[0]?.value;
                    const valueMkp = data[0]?.valueMkp;
                    const currency = data[0]?.currency || 'USD';

                    const text = datum ?
                        `<span>${datum?.value} USD</span> ${datum?.currency != 'USD' ? `<br/><span> ${datum?.valueMkp} ${datum?.currency}` : ''}</span>` :
                        `<span>${valueUSD} USD</span> ${currency != 'USD' ? `<br/><span> ${valueMkp} ${currency}` : ''}</span>`;

                    return renderStatistic(width, text, {
                        fontSize: 15,
                    });
                },
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
            {
                type: 'pie-statistic-active',
            },
            {
                type: 'tooltip',
                cfg: { start: [{ trigger: 'element:click', action: 'tooltip:show' }] }
            }
        ],
    };
    const getTopPieChartBySales = (chartData) => adapterDataPieChart(getAllProductsBySales(chartData));

    // return <Pie {...config} />;
    return <PieChart data={getTopPieChartBySales(analyticData)} unitBasePrefix={'$'}/>
};
export default React.memo(TopSalesPieChartBySku);
