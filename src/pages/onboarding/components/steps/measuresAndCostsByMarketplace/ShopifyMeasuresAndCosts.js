import { convertToFeets, convertToInches, convertToPounds } from '../../../../../utils/functions';
import { Row, Col, Form, Input, Select, InputNumber, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const measuresTypes = [
    { name: 'width' },
    { name: 'height' },
    { name: 'length' }
]

const measureUnits = [
    { name: 'Inches', value: 'inches' },
    { name: 'Meters', value: 'meters' },
    { name: 'Centimeters', value: 'centimeters' },
    { name: 'Millimeters', value: 'millimeters' },
    { name: 'Feet', value: 'feet' },
    { name: 'Yards', value: 'yards' },
]

const weightUnits = [
    { name: 'Pounds', value: 'lb' },
    { name: 'Grams', value: 'g' },
    { name: 'Kilograms', value: 'kg' },
    { name: 'Ounces', value: 'oz' },
]

const { Option } = Select;
const { Text, Title } = Typography;

export default (props) => {
    const {
        selectedMarketplace, measuresRetrieved,
        form, canEditItem, setRefresh, tab
    } = props;

    const { t } = useTranslation();
    const { Item } = Form;

    const commonForm = (isVariant, index) => {
        let hidden = !isVariant && measuresRetrieved[tab].listingPerMarketplace[selectedMarketplace]?.variants?.length > 0;
        const name = isVariant ?
            [tab, "listingPerMarketplace", selectedMarketplace, "variants", index] :
            [tab, "listingPerMarketplace", selectedMarketplace, "product"];

        return (
            <>
                <Item hidden label={t('onboarding.price.product')} name={[...name, "id"]}>
                    <Input type="hidden" />
                </Item>
                {measuresTypes.map((element) => (
                    <Item hidden={hidden} label={t(`onboarding.measuresAndPrices.${element.name}`)} style={{ marginBottom: 0 }} key={element.name}>
                        {inputTypeNumber(element.name, isVariant ? index : null)}
                        {inputTypeSelection('measureUnity', isVariant ? index : null)}
                        <Text type="secondary">
                            {`${convertToInches(form.getFieldValue([...name, "measureUnity"]), form.getFieldValue([...name, element.name]))} inches` || '0 inches'}
                        </Text>
                    </Item>
                ))}
                <Item hidden={hidden} label={t(`onboarding.measuresAndPrices.weight`)} style={{ marginBottom: 0 }}>
                    {inputTypeNumber('weight', isVariant ? index : null)}
                    {inputTypeSelection('weightUnity', isVariant ? index : null)}
                    <Text type="secondary">
                        {`${convertToPounds(form.getFieldValue([...name, "weightUnity"]), form.getFieldValue([...name, "weight"]))} pounds` || '0 pounds'}
                    </Text>
                </Item>
                <Item hidden={hidden} label={<Text ellipsis={{ tooltip: t(`onboarding.measuresAndPrices.netWeight`) }}>{t(`onboarding.measuresAndPrices.netWeight`)}</Text>} style={{ marginBottom: 0 }}>
                    {inputTypeNumber('netWeight', isVariant ? index : null)}
                    {inputTypeSelection('netWeightUnity', isVariant ? index : null)}
                    <Text type="secondary">
                        {`${convertToPounds(form.getFieldValue([...name, "netWeightUnity"]), form.getFieldValue([...name, "netWeight"]))} pounds` || '0 pounds'}
                    </Text>
                </Item>

                <Item hidden name={[...name, "volume"]} ><Input /></Item>
                {!hidden &&
                    <Row>
                        <Col span={3}>
                            <Text>{t('onboarding.measuresAndPrices.volume')}</Text>
                        </Col>
                        <Col span={21}>
                            <Text>
                                {form.getFieldValue([...name, "volume"]) || 0}{' '}
                                {form.getFieldValue([...name, "measureUnity"])}³
                            </Text>
                            <Text type="secondary">  {`${convertToFeets(form.getFieldValue([...name, "measureUnity"]), form.getFieldValue([...name, "volume"]))} feets³`}
                            </Text>
                        </Col>
                    </Row>
                }
            </>
        )
    }

    const inputTypeSelection = (property, index) => {
        const name = index === 0 || index ?
            [tab, "listingPerMarketplace", selectedMarketplace, "variants", index, property] :
            [tab, "listingPerMarketplace", selectedMarketplace, "product", property];

        const optionsList = property !== "weightUnity" ? measureUnits : weightUnits;
        return (
            <Item
                name={name}
                rules={[{
                    required: index !== null || index > 0,
                    message: `${t(`onboarding.measuresAndPrices.${property}`)} ${t('isRequired')}`
                }]}
                style={{ display: 'inline-block', width: 'calc(35% - 8px)', margin: '0 8px' }}
            >
                <Select allowClear disabled={!canEditItem} onChange={() => setRefresh(Date.now())}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } showSearch={true}>
                    {optionsList.map((option, index) => (
                        <Option value={option.value} key={index}>{option.name}</Option>
                    ))}
                </Select>
            </Item>
        )
    }

    const inputTypeNumber = (property, index) => {
        const name = index === 0 || index ?
            [tab, "listingPerMarketplace", selectedMarketplace, "variants", index] :
            [tab, "listingPerMarketplace", selectedMarketplace, "product"];

        return (
            <Item
                name={[...name, property]}
                rules={[{
                    required: index !== null || index > 0,
                    message: `${t(`onboarding.measuresAndPrices.${property}`)} ${t('isRequired')}`
                }]}
                style={{ display: 'inline-block', width: 'calc(35% - 8px)' }}
            >
                <InputNumber style={{ width: '100%' }} min={0} onChange={() => onChangeInputNumber(name, index)}
                    parser={value => parseFloat(value.replace('-', ''))} disabled={!canEditItem} />
            </Item>
        )
    }

    const onChangeInputNumber = (name, index) => {
        const width = form.getFieldValue([...name, 'width']) || 0;
        const height = form.getFieldValue([...name, 'height']) || 0;
        const length = form.getFieldValue([...name, 'length']) || 0;
        const volume = (width * height * length).toFixed(2);
        let formData = form.getFieldValue();
        if (index === 0 || index) {
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['variants'][index]['volume'] = volume;
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['variants'][index]['height'] = height;
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['variants'][index]['width'] = width;
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['variants'][index]['length'] = length;
        } else {
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['product']['volume'] = volume;
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['product']['height'] = height;
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['product']['width'] = width;
            formData[`${tab}`]['listingPerMarketplace'][`${selectedMarketplace}`]['product']['length'] = length;
        }
        form.setFieldsValue(formData);
        setRefresh(Date.now());
    }

    return (
        <>
            <Row>
                {measuresRetrieved[tab]?.listingPerMarketplace[selectedMarketplace]?.variants?.length == 0 &&
                    <Col span={24} style={{ marginBottom: 10 }}>
                        <Title level={5} ellipsis={{ tooltip: measuresRetrieved[tab].listingPerMarketplace[selectedMarketplace]?.product?.title }} style={{ width: '75%' }}>
                            {measuresRetrieved[tab].listingPerMarketplace[selectedMarketplace]?.product?.title}
                        </Title>
                        <Text type="secondary" style={{ width: '75%' }}>
                            SKU: {measuresRetrieved[tab].listingPerMarketplace[selectedMarketplace]?.product?.defaultCode}
                        </Text>
                    </Col>
                }
                <Col span={12}>
                    {commonForm(false, null)}
                </Col>
            </Row>
            {measuresRetrieved[tab].listingPerMarketplace[selectedMarketplace]?.variants?.length > 0 &&
                <>
                    <Row >
                        {measuresRetrieved[tab].listingPerMarketplace[selectedMarketplace]?.variants?.map((item, index) => (
                            <Col span={12} key={index}>
                                <Row>
                                    <Col span={24} style={{ marginBottom: 10 }}>
                                        <Title level={5} ellipsis={{ tooltip: item?.title }} style={{ width: '75%' }}>{item?.title} </Title>
                                        <Text type="secondary" style={{ width: '75%' }}>SKU: {item?.defaultCode} </Text>
                                    </Col>
                                    <Col span={24}>
                                        {commonForm(true, index)}
                                    </Col>
                                </Row>
                            </Col>
                        ))}
                    </Row>
                </>}
        </>
    )
}