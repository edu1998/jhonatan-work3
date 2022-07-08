import { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, TreeSelect, Tooltip, Button, Spin } from 'antd';
import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { canEdit } from '../../../../../utils/functions';
import categoryApi from '../../../../../api/aws-category';
import { openNotification } from '../../../../../components/Toastr';

const antIcon = <RedoOutlined spin />;
const { Item } = Form;
const { Option } = Select;
export default (props) => {

    const {
        selectedMarketplace,
        form, session,
        step, loadingUpdateCategory,
        listingId, currentTab, tab, updateCategoriesByMarketplace
    } = props;

    const { t } = useTranslation();

    const [loadingGetCategories, setLoadingGetCategories] = useState(false);
    const [categoriesByMarketplace, setCategoriesByMarketplace] = useState();
    const [collections, setCollections] = useState();

    useEffect(() => {
        getCategories(selectedMarketplace, 'all');
    }, []);

    const getCategories = (marketplace, name) => {
        setLoadingGetCategories(true);
        if (marketplace) {
            categoryApi.getByMarketplaceAndSearch(marketplace, name, listingId)
                .then(res => {
                    const data = res.data;
                    setCategoriesByMarketplace(data.categories);
                    setCollections(data.collections);
                    setLoadingGetCategories(false);
                })
                .catch(error => {
                    setLoadingGetCategories(false);
                    openNotification({ status: false, content: error?.response?.data?.message || `Error al obtener el listado de categorías para ${currentTab}` });
                })
        }
    }

    return (
        <>
            <Row>
                <Col xs={24} sm={24} md={24}>
                    <Item label={t('onboarding.price.groupTitle')} className="input-form-margin-bottom" name={[tab, "listingPerMarketplace", selectedMarketplace, "name"]}
                        rules={[{ max: 500, required: true }]}
                        tooltip={{
                            title: t('onboarding.price.groupTitleDescription'),
                            icon: <InfoCircleOutlined />,
                        }}>
                        <Input.TextArea rows={2} maxLength={500} disabled={!canEdit(session, tab, step?.state)} />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <p></p>
                    <Item hidden name={[tab, "listingPerMarketplace", selectedMarketplace, "productType"]}>
                        <Input type="hidden"></Input>
                    </Item>
                    {loadingGetCategories &&
                        <Item label={t('onboarding.order.step1Input1')}>
                            <Spin />
                        </Item>}
                    {!loadingGetCategories && categoriesByMarketplace &&
                        <>
                            <Item label={t('onboarding.order.step1Input1')}
                                name={[tab, "listingPerMarketplace", selectedMarketplace, "category"]}
                                initialValue={form.getFieldValue([tab, "listingPerMarketplace", selectedMarketplace, "category"])}
                                tooltip={{
                                    title: t('onboarding.order.step1Input4Description'),
                                    icon: <InfoCircleOutlined />,
                                }}
                                rules={[{ required: true }]}>
                                {tab == 'LAP' ?
                                    <TreeSelect
                                        defaultValue={form.getFieldValue([tab, "listingPerMarketplace", selectedMarketplace, "category"])}
                                        treeData={categoriesByMarketplace}
                                        showSearch size={'medium'}
                                        allowClear treeDataSimpleMode
                                        loading={loadingGetCategories}
                                        placeholder="Tipea el nombre o seleccione"
                                        disabled={!canEdit(session, tab, step?.state)}
                                        onChange={(op, value) => {
                                            if (value) {
                                                let newVals = {
                                                    [`${tab}`]: {
                                                        listingPerMarketplace: {
                                                            [`${selectedMarketplace}`]: {
                                                                category: value[0],
                                                                productType: value[0]
                                                            }
                                                        }
                                                    }
                                                }
                                                form.setFieldsValue(newVals);
                                            }
                                        }}
                                        filterOption={(input, option) =>
                                            option?.value?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    >
                                    </TreeSelect> :
                                    <Input style={{ width: '94%' }}
                                        disabled={!canEdit(session, tab, step?.state)}
                                        placeholder={"Ingrese el nombre"}
                                    />
                                }

                                <Item style={{ display: 'inline-block', width: '6%' }}>
                                    {session.userInfo.isAdmin && tab === 'LAP' &&
                                        <Tooltip title={`Actualizar categorías para ${selectedMarketplace} `} >
                                            <Button
                                                disabled={!canEdit(session, tab, step?.state)}
                                                icon={loadingUpdateCategory ? <Spin indicator={antIcon} /> : <RedoOutlined />}
                                                onClick={updateCategoriesByMarketplace}
                                            />
                                        </Tooltip>
                                    }
                                </Item>
                            </Item>
                            <Item label={'Colecciones'}
                                name={[tab, "listingPerMarketplace", selectedMarketplace, "attributes", "collections"]}
                                initialValue={form.getFieldValue([tab, "listingPerMarketplace", selectedMarketplace, "attributes", "collections"])}
                                tooltip={{
                                    title: t('onboarding.order.step1Input4Description'),
                                    icon: <InfoCircleOutlined />,
                                }}
                                rules={[{ required: false }]}>

                                <Select
                                    mode="multiple"
                                    allowClear
                                    disabled={!canEdit(session, tab, step?.state)}
                                    style={{ width: '100%' }}
                                    placeholder="Asignar a colecciones"

                                >
                                    {collections.map((col) => {
                                        return (<Option value={col.id} label={col.title}>
                                            {col.title}
                                        </Option>);
                                    })}
                                </Select>

                            </Item>
                        </>
                    }
                </Col>
            </Row>
        </>
    )
}