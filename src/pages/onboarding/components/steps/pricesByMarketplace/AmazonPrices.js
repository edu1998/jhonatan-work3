import { useState } from 'react';
import { Row, Col, Form, Input, AutoComplete, Tooltip, Button, Spin, Typography, Alert } from 'antd';
import { InfoCircleOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { canEdit, keyPressSpaceBar } from '../../../../../utils/functions';
import categoryApi from '../../../../../api/aws-category';
import { openNotification } from '../../../../../components/Toastr';

const { Text } = Typography;
const antIcon = <RedoOutlined spin />;
export default (props) => {

    const {
        selectedMarketplace,
        form, session,
        step, loadingUpdateCategory,
        category, currentTab, tab, updateCategoriesByMarketplace
    } = props;

    const { t } = useTranslation();
    const { Item } = Form;

    const [loadingGetCategories, setLoadingGetCategories] = useState(false);
    const [categoriesByMarketplace, setCategoriesByMarketplace] = useState();
    const [realProductType, setRealProductType] = useState(null);
    const [loadingGetProductType, setLoadingGetProductType] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const handleSwitchProductType = (productType) => {
        setRealProductType(null);
        setLoadingGetProductType(true);
        const partnerId = session?.userInfo?.commercial_partner_id ? session?.userInfo?.commercial_partner_id[0] : 1;
        categoryApi.getProductTypeDefinition(partnerId, selectedMarketplace, productType)
            .then(res => {
                setRealProductType(res.data);
                setLoadingGetProductType(false);
            })
            .catch(error => {
                setRealProductType(null);
                setLoadingGetProductType(false);
            })
    }

    const getCategoriesByMarketplace = () => {
        setLoadingGetCategories(true);
        const inputCategory = form.getFieldValue([tab, "listingPerMarketplace", selectedMarketplace, "category"]);
        if (selectedMarketplace) {
            categoryApi.getByMarketplaceAndSearch(selectedMarketplace, inputCategory)
                .then(res => {
                    const data = res.data;
                    setCategoriesByMarketplace(data?.map((item, index) => ({
                        ...item,
                        value: `${item.name}-${item.product_type}`,
                        label: renderItem(item)?.label,
                        key: index
                    })
                    ));
                    setLoadingGetCategories(false);
                    setOpenDropdown(true);
                })
                .catch(error => {
                    setLoadingGetCategories(false);
                    openNotification({ status: false, content: error?.response?.data?.message || `Error al obtener el listado de categorías para ${currentTab}` });
                })
            let newVals = { [`${selectedMarketplace}`]: { listingPerMarketplace: { [`${selectedMarketplace}`]: { productType: null } } } }
            form.setFieldsValue(newVals);
        }
    }

    const renderItem = (category) => ({
        value: category,
        label: (
            <Row>
                <Tooltip placement="top" title={`${category?.complete_name?.replace(/,/g, "/")}`}>
                    <Col span={24}>
                        <Text style={{ fontWeight: 600, fontSize: 16, marginRight: 10 }}>{category?.name}</Text>
                    </Col>
                    <Col span={24}>
                        <Text style={{ color: 'grey', fontSize: 12 }}>{category?.complete_name?.replace(/,/g, "/")}</Text>
                    </Col>
                </Tooltip>
            </Row>
        ),
    });

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
                        <Input.TextArea rows={2} maxLength={500} placeholder="Muffin de legumbres" disabled={!canEdit(session, tab, step?.state)} />
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={tab == 'LAP' ? 22 : 24}>
                    <p></p>
                    <Item hidden name={[tab, "listingPerMarketplace", selectedMarketplace, "productType"]}>
                        <Input type="hidden"></Input>
                    </Item>

                    <Item label={t('onboarding.order.step1Input1')}
                        name={[tab, "listingPerMarketplace", selectedMarketplace, "category"]}
                        tooltip={{
                            title: tab == 'LAP' ? t('onboarding.price.inputCategoryForLAP') : t('onboarding.price.inputCategoryForPartner'),
                            icon: <InfoCircleOutlined />,
                        }}
                        rules={[{ required: true }]}>
                        {tab == 'LAP' ?
                            <AutoComplete allowClear
                                disabled={!canEdit(session, tab, step?.state)}
                                placeholder={category || "Muffin mix"}
                                options={categoriesByMarketplace}
                                open={openDropdown}
                                onChange={() => setOpenDropdown(true)}
                                onKeyPress={(e) => { keyPressSpaceBar(e) }}
                                onSelect={(op, value) => {
                                    if (value?.product_type) {
                                        handleSwitchProductType(value?.product_type?.split(',')[0]);
                                        let newVals = {
                                            [`${tab}`]: {
                                                listingPerMarketplace: {
                                                    [`${selectedMarketplace}`]: {
                                                        category: value?.name,
                                                        productType: value?.product_type?.split(',')[0]
                                                    }
                                                }
                                            }
                                        }
                                        setOpenDropdown(false);
                                        form.setFieldsValue(newVals);
                                    }
                                }}
                            >
                                {session.userInfo.isAdmin && tab === 'LAP' &&
                                    <Input suffix={session.userInfo.isAdmin &&
                                        <Tooltip placement="topLeft" title={`Actualizar categorías para ${selectedMarketplace} `}>
                                            <Button
                                                type="link"
                                                disabled={!canEdit(session, tab, step?.state)}
                                                icon={loadingUpdateCategory ? <Spin indicator={antIcon} /> : <RedoOutlined />}
                                                onClick={updateCategoriesByMarketplace}
                                            />
                                        </Tooltip>
                                    }></Input>
                                }
                            </AutoComplete> :
                            <Input style={{ width: '94%' }}
                                disabled={!canEdit(session, tab, step?.state)}
                                placeholder={category || "Ingrese el nombre"}
                            />
                        }
                    </Item>
                </Col>
                {session.userInfo.isAdmin && tab === 'LAP' &&
                    <Col style={{ marginLeft: 5, marginTop: 15 }}>
                        <Tooltip title={t('onboarding.price.btnSearchCategoriesForLAP')}>
                            <Button type="primary" size="large"
                                icon={<SearchOutlined />} loading={loadingGetCategories}
                                onClick={() => getCategoriesByMarketplace()} />
                        </Tooltip>
                    </Col>
                }
            </Row>
            {loadingGetProductType && session.userInfo.isAdmin ?
                <Spin tip={`${t('onboarding.price.loadingProductType')} ${form.getFieldValue([tab, 'listingPerMarketplace', selectedMarketplace, 'productType'])} ...`} />
                : (realProductType &&
                    <Alert style={{ margin: 10 }}
                        description={realProductType == 'PRODUCT' ? t('onboarding.price.productTypeWarningMessage') : t('onboarding.price.productTypeSuccessMessage')}
                        message={`PRODUCT TYPE: ${form.getFieldValue([tab, 'listingPerMarketplace', selectedMarketplace, 'productType'])}`}
                        type={realProductType == 'PRODUCT' ? 'warning' : 'success'}
                        showIcon
                        closable
                    />)
            }
        </>
    )
}