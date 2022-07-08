import React, { useState, useEffect } from 'react';

import { Row, Col, Form, Radio, Divider, Card, InputNumber, Progress, Input, Table, Tooltip } from 'antd';
import Notes from '../../Notes';
import { Attachments } from '../../Attachments';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { orderGeneralStates } from '../../../../../utils/const';
import { InfoCircleOutlined } from '@ant-design/icons';
import { canEdit } from '../../../../../utils/functions';

const { Item } = Form;

export default ({ form, boxesRetrieved, path, tab, orderId, step, state, selectedPartner }) => {

    const { t } = useTranslation();
    const session = useSelector(store => store.Session.session)

    const [skuPerBoxPercent, setSkuPerBoxPercent] = useState();
    const formData = {};
    const isValidTotalQuantityPerSku = true;
    const handleOnChangeDataByBox = () => {

    }

    useEffect(() => {
        if (session && tab && step?.state) {
            setCanEditItem(canEdit(session, path, step?.state));
        }
    }, [session, tab, step?.state])

    const [canEditItem, setCanEditItem] = useState(canEdit(session, path, step?.state));

    const boxDataColumns = [
        {
            title: t('orders.newOrder.boxes.boxDataColumns.id'),
            dataIndex: 'id',
            key: 'id',
            width: 100,
            render: text => <a>{text}</a>
        },
        {
            title: <Tooltip title={t('orders.newOrder.boxes.medidasTooltip')}>
                {`${t('orders.newOrder.boxes.boxDataColumns.width')} (${form.getFieldValue(["owners", path, "unity"])?.toUpperCase()})`}<InfoCircleOutlined />
            </Tooltip>,
            dataIndex: 'width',
            key: 'width',
            render: (text, record, index) => (
                <Item name={["owners", path, "boxes",index, "width"]} rules={[{ required: true }]}>
                    <InputNumber min={0} max={form.getFieldValue(["owners", path, "unity"])?.toUpperCase() == "CM" ? 25 : 63.5} disabled={!canEditItem} min={0} style={{ width: '100%' }}/>
                </Item>
            )
        },
        {
            title: <Tooltip title={t('orders.newOrder.boxes.medidasTooltip')}>
                {`${t('orders.newOrder.boxes.boxDataColumns.height')} (${form.getFieldValue(["owners", path, "unity"])?.toUpperCase()})`}<InfoCircleOutlined />
            </Tooltip>,
            dataIndex: 'height',
            key: 'height',
            render: (text, record, index) => (
                <Item name={["owners", path, "boxes", index, "height"]} rules={[{ required: true }]}>
                    <InputNumber min={0} max={form.getFieldValue(["owners", path, "unity"])?.toUpperCase() == "CM" ? 25 : 63.5} style={{ width: '100%' }} name="height" disabled={!canEditItem}/>
                </Item>
            )
        },
        {

            title: <Tooltip title={t('orders.newOrder.boxes.medidasTooltip')}>
                {`${t('orders.newOrder.boxes.boxDataColumns.long')} (${form.getFieldValue(["owners", path, "unity"])?.toUpperCase()})`}<InfoCircleOutlined />
            </Tooltip>,
            dataIndex: 'length',
            key: 'length',
            render: (text, record, index) => (
                <Item name={["owners", path, "boxes", index, "length"]} rules={[{ required: true }]}>
                    <InputNumber min={0} max={form.getFieldValue(["owners", path, "unity"])?.toUpperCase() == "CM" ? 25 : 63.5} style={{ width: '100%' }} name="length" disabled={!canEditItem}/>
                </Item>
            )
        },
        {

            title: <Tooltip title={t('orders.newOrder.boxes.pesoTooltip')}>
                {`${t('orders.newOrder.boxes.boxDataColumns.weight')} (${form.getFieldValue(["owners", path, "unity"])?.toUpperCase() == "CM" ? "KG" : "LBS"})`}<InfoCircleOutlined />
            </Tooltip>,
            dataIndex: 'weight',
            key: 'weight',
            render: (text, record, index) => (
                <Item name={["owners", path, "boxes", index, "weight"]} rules={[{ required: true }]}>
                    <InputNumber min={0} max={form.getFieldValue(["owners", path, "unity"])?.toUpperCase() == "CM" ? 50 : 110} style={{ width: '100%' }} name="weight" disabled={!canEditItem}/>
                </Item>
            )
        },
    ];


    return (
        <>
            <Row>
                <Col xs={24} sm={24} md={24}>
                    <Item label={t('orders.newOrder.boxes.radioGroup1')} className="input-form-margin-bottom" name={["owners", path, "isPack"]}
                        rules={[{ required: true }]}
                        tooltip={{
                            title: t('orders.newOrder.boxes.radioGroup1Description'),
                            icon: <InfoCircleOutlined />,
                        }}>
                        <Radio.Group
                            disabled={!canEditItem}
                            className="card-radio-group">
                            <Card className="card-radio-inline">
                                <div className="card-content-div">
                                    <Radio value={false} >
                                        <p className="text-card-radio">Single case</p>
                                    </Radio>
                                </div>
                                <span className="span-card-radio">{t('orders.newOrder.boxes.radioGroup1Checkbox1')}</span>
                            </Card>
                            <Card className="card-radio-inline">
                                <div className="card-content-div">
                                    <Radio value={true} >
                                        <p className="text-card-radio">Pack</p>
                                    </Radio>
                                    <span className="span-card-radio">{t('orders.newOrder.boxes.radioGroup1Checkbox2')}</span>
                                </div>
                            </Card>
                        </Radio.Group>
                    </Item>
                </Col>
            </Row>
            <Divider className="divider-margin" orientation="left" />
            <Row>
                <Col xs={24} sm={24} md={24}>
                    <Item label={t('orders.newOrder.boxes.radioGroup2')} name={["owners", path, "unity"]} rules={[{ required: true }]}>
                        <Radio.Group
                            disabled={!canEditItem}
                            className="card-radio-group">
                            <Card className="card-radio-inline">
                                <div className="card-content-div card-radio-inline">
                                    <Radio value={'cm'} >
                                        <p className="text-card-radio">CM/KG</p>
                                    </Radio>
                                </div>
                            </Card>
                            <Card className="card-radio-inline">
                                <div className="card-content-div card-radio-inline">
                                    <Radio value={'inch'} >
                                        <p className="text-card-radio">INCH/LBS</p>
                                    </Radio>
                                </div>
                            </Card>
                        </Radio.Group>
                    </Item>
                </Col>
            </Row>
            <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => {
                    if(prevValues.owners && currentValues.owners){
                        if(prevValues.owners[path].isPack !== currentValues.owners[path].isPack) {
                            return true;
                        } else if(prevValues.owners[path].isPack){
                            console.log("cambia a: ", prevValues.owners[path].unity !== currentValues.owners[path].unity);
                            return prevValues.owners[path].unity !== currentValues.owners[path].unity;
                        } else {
                            return false;
                        }
                    }else {
                        return false;
                    }

                    
                }}
            >
                {({ getFieldValue }) =>
                    getFieldValue(['owners', path, 'isPack']) === true ? (
                        <>
                            <Divider className="divider-margin" orientation="left" />
                            <Row>
                                <Col xs={24} sm={24} md={24}>
                                    <Item label={t('orders.newOrder.boxes.input1')} name={['owners', path, 'boxQuantity']} rules={[{ required: true }]}>
                                        <InputNumber min={0} defaultValue={1} style={{ width: '10%' }}
                                            disabled={!canEditItem}
                                            parser={value => value.replace(/\$.\s?|(,*)/g, '')}
                                        />
                                    </Item>
                                </Col>
                            </Row>
                            <Divider className="divider-margin" />
                            <h2 className="title-primary ">{t('orders.newOrder.boxes.subtitle1')}</h2>
                            <span className="text-color-gray ">{t('orders.newOrder.boxes.subtitleDescription1')} </span>
                            <Divider className="divider-margin" />
                            <Row>
                                <Col xs={24} sm={24} md={24} >
                                    <Table columns={boxDataColumns} pagination={false} dataSource={[]} scroll={{ x: 1300 }} />
                                </Col>
                            </Row>
                        </>
                    ) : null
                }
            </Form.Item>

            <Divider className="divider-margin" orientation="left" />
            <Row>
                <Col xs={8} sm={8} md={8}>
                    <h2 className="title-primary ">{t('orders.newOrder.boxes.subtitle2')}</h2>
                </Col>
                <Col xs={16} sm={16} md={16}>
                    {boxesRetrieved?.owners[path]?.isPack &&
                        <Row>
                            <Col xs={8} sm={8} md={8}>{t('orders.newOrder.boxes.subtitle2text1')}: {skuPerBoxPercent?.total}</Col>
                            <Col xs={8} sm={8} md={8}>
                                {isValidTotalQuantityPerSku ?
                                    <Progress percent={skuPerBoxPercent?.percent ? skuPerBoxPercent.percent.toFixed(2) : 0} className="progress" />
                                    : <Progress percent={100} status="exception" className="progress" />}
                            </Col>
                            <Col xs={8} sm={8} md={8}>{t('orders.newOrder.boxes.subtitle2text2')}: {skuPerBoxPercent?.totalInBoxes ? skuPerBoxPercent.totalInBoxes : 0}</Col>
                        </Row>
                    }
                </Col>
            </Row>
            <span className="text-color-gray">{t('orders.newOrder.boxes.subtitleDescription2')} </span>
            <Divider className="divider-margin" orientation="left" />
            <Row>
                <Col xs={24} sm={24} md={24}>
                    {
                        /** 
                    <Form
                        form={formPerSku}
                        layout="flex"
                        style={{ width: '100%' }}
                    >
                        {formData?.pack ?
                            <Table columns={columnsSkuPerBox} dataSource={dataSkuPerBox}
                                scroll={{ x: 1300 }}
                                pagination={false}
                                footer={() =>
                                    <Row>
                                        <Col xs={24} sm={24} md={24} className="resume-sku-per-boxes-overflow-x">
                                            <Row className="resume-sku-per-boxes" >
                                                <Col style={{ width: '20%' }}>
                                                    <span className="bold">{t('orders.newOrder.boxes.spanSkuPerBoxTable')} </span>
                                                </Col>
                                                {dataBoxes?.map(item => {
                                                    return (
                                                        <Col style={{ width: `${(80 / dataBoxes.length)}%` }}>
                                                            <span className="bold" >{item?.id}</span>:{' '}
                                                            <span className="bold-color-green">
                                                                {`${item?.products?.reduce((total, item) => total += item?.quantity_per_box, 0) || 0} un.`}
                                                            </span>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </Col>
                                    </Row>
                                }
                            /> :
                            <Table columns={skuPerBoxSingleCaseColumns} dataSource={dataSkuPerBox} />
                        }
                    </Form>
                    */}
                </Col>
                <Divider className="divider-margin" />
            </Row>

            {session?.userInfo?.isAdmin && tab === 'LAP' &&
                <Row>
                    <Col xs={24} sm={24} md={24}>
                        <Item label={t('orders.newOrder.boxes.LAPComment')}
                            name="commentsLAP"
                            tooltip={{
                                title: t(`orders.newOrder.boxes.LAPCommentDescription`),
                                icon: <InfoCircleOutlined />,
                            }}
                        >
                            <Input.TextArea
                                rows={3}
                                showCount
                                maxLength={2000}
                                name="commentsLAP"
                            />
                        </Item>
                    </Col>
                </Row>}
        </>);



}