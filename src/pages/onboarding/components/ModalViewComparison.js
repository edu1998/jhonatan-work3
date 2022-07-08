import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Result, Typography } from 'antd';
// import { useTranslation } from 'react-i18next';
import 'antd/dist/antd.css';
import { sellerMarketplaces } from '../../../utils/const';

const { Title, Text } = Typography;
export const ModalViewComparison = ({ currentItem, toggleModalViewComparison, tab, currentTab }) => {

    // const { t } = useTranslation();
    const [differences, setDifferences] = useState([]);

    const getDifferencesAmazon = (externalAttribute, currentAttribute) => {
        if (Array.isArray(externalAttribute)) {
            let externalData = externalAttribute?.length > 0 ? [...externalAttribute] : [];
            let currentData = currentAttribute?.length > 0 ? [...currentAttribute] : [];
            return {
                external: externalData?.length > 0 && externalData?.map(attb => attb?.value || attb?.media_location)?.join(),
                current: currentData?.length > 0 && currentData?.map(attb => attb?.value || attb?.media_location)?.join() || null,
            }
        } else {
            return {
                external: externalAttribute || null,
                current: currentAttribute || null,
            }
        }
    }

    const getDifferencesByMarketplace = (marketplace, externalAttribute, currentAttribute) => {
        switch (marketplace) {
            case sellerMarketplaces.AMAZON:
            case sellerMarketplaces.AMAZON_MX:
            case sellerMarketplaces.AMAZON_CA:
            case sellerMarketplaces.AMAZON_BR:
                return getDifferencesAmazon(externalAttribute, currentAttribute);
            case sellerMarketplaces.EBAY:
            case sellerMarketplaces.EBAY_CA:
            case sellerMarketplaces.EBAY_ES:
            case sellerMarketplaces.EBAY_DE:
                return {
                    external: Array.isArray(externalAttribute) ? externalAttribute?.join() : externalAttribute,
                    current: Array.isArray(currentAttribute) ? currentAttribute?.join() : currentAttribute || 'null',
                }
            default: return null;
        }
    }

    useEffect(() => {
        if (currentItem) {
            let currentAttributes = currentItem?.attributes?.length > 0 ? currentItem.attributes[0] : currentItem.attributes;
            let externalAttributes = currentItem?.externalAttributes;
            let differentAttributes = [];
            for (const key in externalAttributes) {
                if (Object.hasOwnProperty.call(externalAttributes, key)) {
                    const external = externalAttributes[key]?.value || externalAttributes[key]?.name || externalAttributes[key]?.material || externalAttributes[key];
                    const current = currentAttributes[key]?.value || currentAttributes[key]?.name || currentAttributes[key]?.material || currentAttributes[key];
                    if ((external && current) && JSON.stringify(external) !== JSON.stringify(current)) {
                        const value = getDifferencesByMarketplace(currentTab, external, current);
                        if (value) {
                            differentAttributes.push({ name: key, ...value });
                        }
                    }
                }
            }
            setDifferences(differentAttributes);
        }
    }, [currentItem])

    const closeModal = () => {
        toggleModalViewComparison();
    };

    return (
        <Result status={differences.length > 0 ? "warning" : "success"}>
            <Row>
                <Col span={24}>
                    <Title level={4}>
                        {differences.length > 0 ? `Existen diferencias con los atributos establecidos en ${currentTab}` : `No hay diferencias con los atributos establecidos en ${currentTab}`}
                    </Title>
                    {differences?.map((element, index) => (
                        <div key={index}>
                            <Title level={5}>{element?.name?.toUpperCase()}</Title>
                            <Text style={{ fontSize: 16 }} strong >Valor actual</Text><br />
                            <Text> {JSON.stringify(element?.current)}</Text><br />
                            <Text style={{ fontSize: 16 }} strong>Valor en el marketplace</Text><br />
                            <Text> {JSON.stringify(element?.external)}</Text>
                        </div>
                    ))}
                </Col>
            </Row>
        </Result>
    )
}