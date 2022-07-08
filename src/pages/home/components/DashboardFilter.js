import {
    SearchOutlined,
    UndoOutlined,
    SaveOutlined,
    SyncOutlined,
    DeleteOutlined,
    UpOutlined,
    DownOutlined
} from '@ant-design/icons';
import { 
    Button,
    Result,
    Col,
    Collapse,
    DatePicker,
    Form,
    Input,
    Row,
    Dropdown,
    Menu,
    Select,
    Spin,
    Space,
    Switch,
    ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from '../../../api/api';
import marketplacesApi from '../../../api/marketplace';
import partnerApi from '../../../api/partner';
import { openNotification } from '../../../components/Toastr';
import actions from '../../../redux/analytic/dashboard/actions';
import selectors from '../../../redux/analytic/dashboard/selectors';
import filterRenders from '../../../utils/filter/filterRenders';
import FilterPreview from '../../shared/filter/FilterPreview';
import FilterWrapper from "../../shared/styles/FilterWrapper";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage"
import moment from 'moment';
import { sellerMarketplaces } from '../../../utils/const';

const categories = ['sales', 'stock'];

const emptyValues = {
    partner: [],
    sku: [],
    marketplace: [],
    category: [],
    compare: false,
    dateRangeOne: [],
    dateRangeTwo: []
};

const responseBody = (res) => res.data;

const AnalyticsFilter = ({ isAdmin, partnerId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const rawFilter = useSelector(selectors.selectRawFilter);
    const [expanded, setExpanded] = useState(true);
    const [isEnabledCompare, setEnabledCompare] = useState(false);
    const [loadingPartners, setLoadingPartners] = useState(false);
    const [expand, setExpand] = useState(false);
    const [allFilter, setAllFilter] = useState(0);
    const [partners, setPartners] = useState([]);
    const [loadingMarketplaces, setLoadingMarketplaces] = useState(false);
    const [listingsAndProducts, setListingsAndProducts] = useState();
    const [loadingListingsAndProducts, setLoadingListingsAndProducts] = useState(false);
    const [query, setQuery] = useLocalStorage(`query_${partnerId}`, emptyValues);
    const [partnersSelected, setPartnersSelected] = useState(() => {
        if (!isAdmin) {
            return [partnerId];
        } else {
            return query.partner?.length > 0 ? query.partner : [];
        }
    });

    const MENU = () => {
        return (
            <Menu>
                <Menu.Item>
                    <Button
                        icon={<SyncOutlined />}
                        onClick={onReLoadQuery}
                    >
                        {t('common.load')} {t('common.filters')}
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button
                        icon={<SaveOutlined />}
                        onClick={onSaveQuery}
                    >
                        {t('common.save')} {t('common.filters')}
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={onDeleteQuery}
                    >
                        {t('common.remove')} {t('common.filters')}
                    </Button>   
                </Menu.Item>
            </Menu>        
        )
    }
 
    const [initialValues] = useState(() => {
        return {
            ...emptyValues,
            ...query,
            dateRangeOne: query.dateRangeOne ? query.dateRangeOne.map(date => moment(date, 'YYYY-MM-DD')) : [],
            dateRangeTwo: query.dateRangeTwo ? query.dateRangeTwo.map(date => moment(date, 'YYYY-MM-DD')) : [],
            partner: partnersSelected
        };
    });

    const [form] = Form.useForm();

    useEffect(() => {
        onLoadDefaultQuery()
        if (isAdmin) {
            getAllPartners();
        }
        getListingsByPartner(partnersSelected);
    }, []);

    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form]);

    const onSubmit = (values) => {
        if(values.marketplace.length === 7) {
            setAllFilter(1)
        } else {
            setAllFilter(0)
        }
        dispatch(actions.doFetch(values));
        setExpanded(false);
    };

    const onRemove = (key) => {
        setExpanded(true);
        form.setFieldsValue({ [key]: emptyValues[key] });
        form.submit();
    };
    const onReset = () => {
        form.setFieldsValue(emptyValues);
        dispatch(actions.doReset());
        setPartnersSelected([]);
        setExpanded(true);
    };
    const onReLoadQuery = () => {
        const loadQuery = {
            ...query,
            dateRangeOne: query.dateRangeOne ? query.dateRangeOne.map(date => moment(date, 'YYYY-MM-DD')) : [],
            dateRangeTwo: query.dateRangeTwo ? query.dateRangeTwo.map(date => moment(date, 'YYYY-MM-DD')) : [],
            partner: partnersSelected
        }
        form.setFieldsValue(loadQuery);
    }
    const onLoadDefaultQuery = () => {
        let ptrs = [];
        if (!isAdmin) {
            ptrs = [partnerId];
        } else {
            ptrs = partners.map(p => { return p.id });
            setPartnersSelected(ptrs);
            getListingsByPartner(ptrs);
        }

        const defaultFilters = {
            partner: ptrs,
            sku: [],
            marketplace: Object.values(sellerMarketplaces),
            category: ['sales', 'stock'],
            compare: false,
            dateRangeOne: [moment().add(-1, 'M'), moment()],
            dateRangeTwo: []
        };
        form.setFieldsValue(defaultFilters);
    };
    const onSaveQuery = () => {
        try {
            setQuery(form.getFieldsValue());
            openNotification({ status: true, content: t('dashboard.saveToLocalStorageOk') });
        } catch (error) {
            openNotification({ status: false, content: getErrorMessage(error) });
        }
    };


    useEffect(() => {
        onLoadDefaultQuery()
        form.submit()
    }, []);

    const onDeleteQuery = () => {
        try {
            setQuery([]);
            openNotification({ status: true, content: t('dashboard.deleteQuery') });
        } catch (error) {
            openNotification({ status: false, content: getErrorMessage(error) });
        }
    };

    const getAllPartners = async () => {
        try {
            setLoadingPartners(true);
            const partners = await partnerApi.findAllForAdmin().then(responseBody);
            setPartners(partners);
            setLoadingPartners(false);
        } catch (error) {
            setLoadingPartners(false);
            openNotification({ status: false, content: getErrorMessage(error) });
        }
    }

    const getListingsByPartner = async (ptrs) => {
        try {
            setLoadingListingsAndProducts(true);
            let products = [];
            if (ptrs.length < 6) {
                await Promise.all(ptrs.map(async (partner) => await partnerApi.listingsAndProducts(partner, false).then(responseBody)
                )).then((response) => {
                    if (response?.length > 0) {
                        for (const listing of response) {
                            for (const item of listing) {
                                item?.products?.map(prod => {
                                    if (prod?.sku && !products?.find(p => p.sku === prod.sku)) {
                                        products.push({ ...prod, index: prod.sku })
                                    }
                                })
                            }
                        }
                    }
                    setListingsAndProducts(products);
                });
            }
            setLoadingListingsAndProducts(false);
        } catch (error) {
            setLoadingListingsAndProducts(false);
            openNotification({ status: false, content: getErrorMessage(error) });
        }
    }
    const onPartnerValuesChange = () => {
        const ptrs = form.getFieldValue('partner');
        setPartnersSelected(ptrs);
        getListingsByPartner(ptrs);
        form.setFieldsValue({ sku: [] });
    }

    const resetDasboard = () => {
        dispatch(actions.doReset());
    };

    useEffect(() => {
        resetDasboard();
    }, []);

    const disabledDate = (current) => {
        const dateRangeOne = form.getFieldValue('dateRangeOne');
        if (!dateRangeOne) return false;

        let isDateBeforePeriodOne = false;
        const dateStart = dateRangeOne[0];
        if (dateStart) {
            isDateBeforePeriodOne = dateStart.diff(current, 'days') < 0;
        }
        return isDateBeforePeriodOne;
    };

    const onDateRangeChange = (date, dateString) => {
        if (!date) form.setFieldsValue({ dateRangeTwo: [] });
    }

    const onChangeSwitch = (isEnabled) => {
        setEnabledCompare(isEnabled);
        if (!isEnabled) form.setFieldsValue({ dateRangeTwo: [] });
    }

    const previewRenders = {
        sku: {
            label: t('dashboard.fields.sku'),
            render: filterRenders.stringArray()
        },
        marketplace: {
            label: t('dashboard.fields.marketplace'),
            render: filterRenders.enumeratorMultiple('dashboard.marketplaces')
        },
        category: {
            label: t('dashboard.fields.category'),
            render: filterRenders.enumeratorMultiple('dashboard.categories')
        },
        dateRangeOne: {
            label: t('dashboard.fields.dateRangeOne'),
            render: filterRenders.dateRange(),
        },
        dateRangeTwo: {
            label: t('dashboard.fields.dateRangeTwo'),
            render: filterRenders.dateRange()
        },
    };

    const loading = loadingMarketplaces || loadingPartners;

    return (
        <>
            {loading && <Spin />}
            {!loading && (
				<Form name="formulario" form={form} onFinish={onSubmit} layout="vertical" className="text-align-left">
                    <Row gutter={24}>
                        {isAdmin && (
                            <>
                                <Col xs={24} lg={6} md={12} >

                                    <Form.Item name="partner"
                                        label={t('dashboard.fields.partner')}
                                        rules={[{ required: true }]}
                                    >
                                        <Select mode="multiple" allowClear
                                            maxTagCount={'responsive'}
                                            onChange={onPartnerValuesChange}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            } showSearch={true}
                                        >
                                            {partners?.length > 0 && partners?.map((partner) => {
                                                return (
                                                    <Select.Option key={partner.id} value={partner.id}>{partner.display_name}</Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                        {!isAdmin && (
                            <Form.Item hidden name="partner">
                                <Input hidden={true} />
                            </Form.Item>
                        )}
                        <Col xs={24} lg={8} md={8} >
                            <Form.Item name="marketplace"
                                label={t('dashboard.fields.marketplace')}
                                rules={[{ required: true }]}
                            >
                                <Select mode="multiple" maxTagCount="responsive">
                                    {Object.keys(sellerMarketplaces)?.map((mkp, index) => (
                                        <Select.Option key={index} value={sellerMarketplaces[mkp]}>{t(`dashboard.marketplaces.${sellerMarketplaces[mkp].replace(' ', '')}`)}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={8} md={8} >
                            <Form.Item name="category"
                                label={t('dashboard.fields.category')}
                                rules={[{ required: true }]}
                            >
                                <Select mode="multiple" allowClear>
                                    {categories.map((item) => {
                                        return (
                                            <Select.Option key={item} value={item}>{t(`dashboard.categories.${item}`)}</Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={8} md={8} >
                            <Form.Item name="dateRangeOne" label="Periodo"
                                rules={[{
                                    required: true,
                                    message: t('dashboard.required.rangeOne')
                                }]}>
                                <DatePicker.RangePicker onChange={onDateRangeChange} style={{ width: '100%' }}
                                    disabledDate={d => !d || d.isAfter(moment())}
                                />
                            </Form.Item>
                        </Col>                        
                        <Col xs={24} lg={8} md={12} >

                        </Col>
                    </Row>
                    <div style={{ textAlign: 'right'}}>
                    <a onClick={() => setExpand(!expand)}>
                    {expand ? <UpOutlined /> : <DownOutlined />} Opciones avanzadas
                    </a>
                    </div>
                    {
                        expand ? 
                        <Row gutter={24} style={{ marginTop: 10 }}>
                            <Col xs={24} lg={10} md={10} >
                                <Form.Item name="sku" label={t('dashboard.fields.sku')}>
                                    <ConfigProvider renderEmpty={() => { return (<span style={{ padding: 10 }}>El seller seleccionado no tiene listings sincronizados</span>) }}>
                                        <Select disabled={partnersSelected && partnersSelected.length > 5} loading={loadingListingsAndProducts} mode="multiple" allowClear>
                                            {listingsAndProducts?.map((item) => {
                                                return <Select.Option key={item.sku} value={item.sku}>{item?.sku}</Select.Option>
                                            })}
                                        </Select>
                                    </ConfigProvider>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={4} md={4} >
                                <Form.Item name="compare"
                                    valuePropName="checked"
                                    label={t('dashboard.fields.compare')}>
                                    <Switch checked={isEnabledCompare} onChange={onChangeSwitch} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={10} md={10} >
                                <Form.Item name="dateRangeTwo"
                                    label="Comparar con"
                                    dependencies={['dateRangeOne']}
                                    rules={[
                                        {
                                            required: isEnabledCompare,
                                            message: t('dashboard.required.rangeTwo')
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const rangeOne = getFieldValue('dateRangeOne');
                                                const rangeTwo = value;
                                                const existPeriods = rangeOne && rangeTwo;
                                                if (!existPeriods) return Promise.resolve();

                                                const [rangeStartOne, rangeEndOne] = rangeOne;
                                                const [rangeStartTwo, rangeEndTwo] = rangeTwo;
                                                if (rangeStartOne && rangeEndOne & rangeStartTwo & rangeEndTwo) {
                                                    const amountdaysOne = rangeEndOne.diff(rangeStartOne, 'days');
                                                    const amountdaysTwo = rangeEndTwo.diff(rangeStartTwo, 'days');
                                                    if (amountdaysOne !== amountdaysTwo)
                                                        return Promise.reject('Los periodos deben ser iguales en cantidad de dias');
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}>
                                    <DatePicker.RangePicker style={{ width: '100%' }}
                                        disabledDate={disabledDate}
                                        disabled={!isEnabledCompare}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        :
                        <>
                                <Form.Item hidden name="sku">
                                </Form.Item>
                                <Form.Item hidden name="compare"
                                    valuePropName="checked"
                                    >
                                </Form.Item>
                                <Form.Item hidden name="dateRangeTwo"
                                    dependencies={['dateRangeOne']}
                                    rules={[
                                        {
                                            required: isEnabledCompare,
                                            message: t('dashboard.required.rangeTwo')
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const rangeOne = getFieldValue('dateRangeOne');
                                                const rangeTwo = value;
                                                const existPeriods = rangeOne && rangeTwo;
                                                if (!existPeriods) return Promise.resolve();

                                                const [rangeStartOne, rangeEndOne] = rangeOne;
                                                const [rangeStartTwo, rangeEndTwo] = rangeTwo;
                                                if (rangeStartOne && rangeEndOne & rangeStartTwo & rangeEndTwo) {
                                                    const amountdaysOne = rangeEndOne.diff(rangeStartOne, 'days');
                                                    const amountdaysTwo = rangeEndTwo.diff(rangeStartTwo, 'days');
                                                    if (amountdaysOne !== amountdaysTwo)
                                                        return Promise.reject('Los periodos deben ser iguales en cantidad de dias');
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}>
                                </Form.Item>
                        </>

                    }
                    <Row style={{ marginTop: 10 }}>
                        <Col className="filter-buttons" style={{textAlign: 'right'}} span={24}>                      
                            <Button
                                icon={<SyncOutlined />}
                                onClick={onLoadDefaultQuery}
                            >
                                {t('common.viewAll')}
                            </Button>
                            <Button
                                loading={loading}
                                onClick={onReset}
                                icon={<UndoOutlined />}
                            >
                                {t('common.clean')}
                            </Button>
                          <Space direction="vertical">
                            <Space wrap>
                              <Dropdown overlay={MENU} placement="bottomLeft">
                                <Button>Mas opciones...</Button>
                              </Dropdown>
                            </Space>
                          </Space>                              
                            <Button
                                loading={loading}
                                icon={<SearchOutlined />}
                                className="btn-basic-green"
                                htmlType="submit"
                            >
                                {t('common.search')}
                            </Button>
                        </Col>
                    </Row>
	            </Form>
			)}
        </>
    );
};

export default React.memo(AnalyticsFilter);