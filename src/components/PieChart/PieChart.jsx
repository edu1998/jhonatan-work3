import './PieChart.css'

import {Pie} from "@ant-design/plots";
import Card from "../card/Card";
import CardBody from "../card/cardBody/Card/cardBody";
import CardHeader from "../card/cardHeader/Card/cardHeader";

export const PieChart = (
    {
        data,
        unitBaseSuffix = '',
        unitBasePrefix = '',
        title,
        legendPosition = 'bottom', // right
        onDataClick
    }
) => {
    const total = data.map(item => item.value).reduce((a, b) => a + b, 0);

    const  handlePlotClick = (e) => {
        if (onDataClick && e.type === "plot:click") onDataClick(e)
    }

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        color: ['#3be5a6', '#020c33', '#e8e8e8'],
        radius: 1,
        innerRadius: 0.75,
        label: {
            type: 'inner',
            offset: '-50%',
            content: function content(_ref) {
                return `${Math.trunc(_ref.percent * 100)}%`;
            },
            autoRotate: false,
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    // fontSize: 20,
                },
                content: `${unitBasePrefix}${new Intl.NumberFormat().format(Math.round(total * 100) / 100)} ${unitBaseSuffix}`,
            },
        },
        legend: {
            layout: legendPosition === 'bottom' ? 'horizontal' : 'vertical',
            position: legendPosition,
            itemValue: {
                formatter: (text, item) => {
                    const items = data.filter((d) => d.type === item.value)[0];
                    return `- ${unitBasePrefix}${ new Intl.NumberFormat().format(items.value)}`
                },
                // style: {
                //     opacity: 0.65,
                // },
            },
        }
    };
    return (
        <Card>
            {title && <CardHeader>
                <h3 className="pie-chart-title">{title}</h3>
            </CardHeader>}
            <CardBody>
                <Pie {...config} onEvent={(chart , event) => handlePlotClick(event)} />
            </CardBody>
        </Card>)
}
