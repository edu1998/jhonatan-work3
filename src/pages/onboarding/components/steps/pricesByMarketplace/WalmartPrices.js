import { useState } from 'react';
import { Row, Col, Form, Input, AutoComplete, Collapse, Button, Typography, Alert } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { canEdit, keyPressSpaceBar } from '../../../../../utils/functions';
import categoryApi from '../../../../../api/aws-category';
import { openNotification } from '../../../../../components/Toastr';
const { Panel } = Collapse;
const { Text } = Typography;
export default (props) => {

    const {
        selectedMarketplace,
        form,
        step,
        category, currentTab, tab, pricesRetrieved
    } = props;

    const session = useSelector(store => store.Session.session);

    const { t } = useTranslation();

    const { Item } = Form;

    const [loadingGetCategories, setLoadingGetCategories] = useState(false);
    const [categoriesByMarketplace, setCategoriesByMarketplace] = useState();

    const getCategoriesByMarketplace = (marketplace, name) => {
        setLoadingGetCategories(true);
        if (marketplace) {
            categoryApi.getByMarketplaceAndSearch(marketplace, name)
                .then(res => {
                    const data = res.data;
                    setCategoriesByMarketplace(data?.map((item) => {
                        return {
                            value: item,
                            label: item,
                            name: item,
                            complete_name: item,
                            product_type: item,
                        };
                    }
                    ));
                    setLoadingGetCategories(false);
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
            <div>
                <span style={{ fontWeight: 600, fontSize: 16, marginRight: 10 }}>{category?.name}</span>
                <span style={{ color: 'grey', fontSize: 13 }}> {category?.complete_name?.replace(/,/g, "/")}</span>
            </div>
        ),
    });

    return (
        <>
            <Collapse style={{ marginBottom: 24 }} bordered={false} defaultActiveKey={['1']}>
                <Panel styles={{ textAlign: 'left' }} header={'Consideraciones'} key={1}>
                    {pricesRetrieved?.LAP?.listingPerMarketplace?.Walmart?.product?.attributes?.notFound ?
                        <Row>
                            <Col span={24}>
                                <Alert
                                    message="Error de sincronización desde Walmart"
                                    showIcon
                                    description="El proceso de sincronización no pudo obtener más información del producto correspondiente al SKU. 
      Por favor, verifique que el SKU/UPC/GTIN es correcto en los sistemas de Walmart, sincronice nuevamente. Si el mensaje persiste, por favor contacte al equipo de soporte de Walmart en https://sellerhelp.walmart.com/s indicando que el producto no puede ser obtenido."
                                    type="error"
                                    action={
                                        <Button size="small" target="_blank" href="https://sellerhelp.walmart.com/s" danger>
                                            Contactar a soporte
                                        </Button>
                                    }
                                />
                            </Col>
                        </Row>
                        : null}
                </Panel>
            </Collapse>
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

                    <Item label={t('onboarding.order.step1Input1')}
                        name={[tab, "listingPerMarketplace", selectedMarketplace, "category"]}
                        tooltip={{
                            title: t('onboarding.order.step1Input4Description'),
                            icon: <InfoCircleOutlined />,
                        }}
                        rules={[{ required: true }]}>
                        {tab == 'LAP' ?
                            <AutoComplete allowClear
                                loading={loadingGetCategories}
                                disabled={!canEdit(session, tab, step?.state)}
                                style={{ width: '94%' }}
                                placeholder={category || "Tipea el nombre"}
                                options={categoriesByMarketplace}
                                onKeyPress={(e) => keyPressSpaceBar(e)}
                                onSearch={(value) => {
                                    if (value.length > 2)
                                        getCategoriesByMarketplace(selectedMarketplace, value);
                                }}
                                onSelect={(op, value) => {
                                    if (value?.product_type) {
                                        let newVals = {
                                            [`${tab}`]: {
                                                listingPerMarketplace: {
                                                    [`${selectedMarketplace}`]: {
                                                        category: value?.name,
                                                        productType: value?.name
                                                    }
                                                }
                                            }
                                        }
                                        console.log(value, newVals)
                                        form.setFieldsValue(newVals);
                                    }
                                }}
                            /> :
                            <Input style={{ width: '94%' }}
                                disabled={!canEdit(session, tab, step?.state)}
                                placeholder={"Ingrese el nombre"}
                            />
                        }
                    </Item>
                </Col>
            </Row>
        </>
    )
}