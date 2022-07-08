import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Button, Tooltip, Spin, TreeSelect, Input } from 'antd'
import { InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next'
import { openNotification } from '../../../../../components/Toastr';
import categoryApi from '../../../../../api/aws-category';
import { canEdit } from '../../../../../utils/functions';

const { Item } = Form;
const antIcon = <RedoOutlined spin />;

export default (props) => {
    const {
        step, loadingUpdateCategory, selectedMarketplace,
        form, updateCategoriesByMarketplace,
        currentTab, tab, session } = props;

    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loadingGetCategories, setLoadingGetCategories] = useState(false);

    useEffect(() => {
        if (!loadingUpdateCategory) {
            getCategories();
        }
    }, [loadingUpdateCategory])

    const getCategories = () => {
        setLoadingGetCategories(true);
        categoryApi.getByMarketplaceAndSearch(selectedMarketplace, 'all')
            .then(res => {
                const data = res.data;
                setCategories(data);
                setLoadingGetCategories(false);
            })
            .catch(error => {
                setLoadingGetCategories(false);
                openNotification({ status: false, content: error?.response?.data?.message || `Error al obtener el listado de categorías para ${currentTab}` });
            })
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
                    <Item label={t('onboarding.order.step1Input1')}>
                        <Item
                            name={[tab, "listingPerMarketplace", selectedMarketplace, "category"]}
                            tooltip={{
                                title: t('onboarding.order.step1Input4Description'),
                                icon: <InfoCircleOutlined />,
                            }}
                            style={{ display: 'inline-block', width: '94%' }}
                            rules={[{ required: true }]}>
                            {tab == 'LAP' ?
                                <TreeSelect
                                    treeData={categories}
                                    showSearch size={'medium'}
                                    allowClear treeDataSimpleMode
                                    loading={loadingGetCategories}
                                    placeholder="Tipea el nombre o seleccione"
                                    disabled={!canEdit(session, tab, step?.state)}
                                    onChange={(op, value) => {
                                        if (op?.categoryId) {
                                            let newVals = {
                                                [`${tab}`]: {
                                                    listingPerMarketplace: {
                                                        [`${selectedMarketplace}`]: {
                                                            category: op.categoryName,
                                                            productType: op.categoryId
                                                        }
                                                    }
                                                }
                                            }
                                            form.setFieldsValue(newVals);
                                        }
                                    }}
                                    filterOption={(input, option) =>
                                        option?.value?.categoryName?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                >
                                </TreeSelect> :
                                <Input style={{ width: '94%' }}
                                    disabled={!canEdit(session, tab, step?.state)}
                                    placeholder={"Ingrese el nombre"}
                                />
                            }
                        </Item>
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
                </Col>
            </Row>
        </>
    )
}
