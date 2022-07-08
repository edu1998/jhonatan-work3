import React from 'react';
import { Button, Table, Row, Col, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
const { Text } = Typography;
export const TableProductVariants = ({ productVariants, toggleModalEditVariant, toggleModalViewComparison, canEditItem, tab, currentTab }) => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sortOrder: 'ascend',
            defaultSortOrder: 'ascend',
            width: '15%'
        },
        {
            title: 'SKU',
            dataIndex: 'defaultCode',
            key: 'defaultCode',
        },
        {
            title: 'Acciones',
            dataIndex: 'acc',
            key: 'acc',
            width: '20%',
            render: (text, record, index) => (
                <>
                    <Button type="primary" onClick={() => toggleModalEditVariant(tab, currentTab, index)}>{canEditItem ? 'Establecer atributos' : 'Ver atributos'}</Button>{' '}
                    {record?.externalAttributes && <Button icon={<WarningOutlined />} type="primary" onClick={() => toggleModalViewComparison(tab, currentTab, index, true)}>{'Ver comparativa'}</Button>}
                </>
            )
        },
    ];

    return (
        <div id="">
            <Table dataSource={productVariants?.map((value, index) => ({ ...value, key: index }))} columns={columns} scroll={{ x: 900, y: 400 }} pagination={false} />
        </div>
    )
}