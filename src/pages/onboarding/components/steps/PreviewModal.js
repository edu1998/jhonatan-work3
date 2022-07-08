import React, { useState, useEffect } from 'react';
import { Divider, Rate, Typography, Row, Col, List } from 'antd';
import { currencyFormatter } from '../../../../utils/currencies';

const currency = 'USD';
const { Text } = Typography;
const PreviewModal = ({ draft }) => {
    const [selectedItem, setItem] = useState(draft?.product);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [attributes, setAttributes] = useState([]);

    const setSelectedItem = (itm) => {
        setItem(itm);
        setSelectedImageIndex(0);
    }

    useEffect(() => {
        if (selectedItem.attributes?.length > 0) {
            let attbs = [];
            for (const key in selectedItem.attributes[0]) {
                if (Object.hasOwnProperty.call(selectedItem.attributes[0], key)) {
                    const element = selectedItem.attributes[0][key];
                    if (element?.value) {
                        attbs.push({ name: key, value: element.value });
                    }
                }
            }
            setAttributes(attbs);
        }
    }, [selectedItem])
    return (
        <div className="draft-preview-container">
            <div className="draft-preview-images-container">
                {[...selectedItem.mainImages, ...selectedItem.productImages].map((image, index) => (
                    <div onClick={() => { setSelectedImageIndex(index) }} key={index} className="draft-image draft-preview-image" style={{ backgroundImage: `url(${image.url})` }} />
                ))}
            </div>

            {/* Main image */}
            <div className="draft-preview-main-image-container">
                <div className="draft-image draft-preview-main-image" style={{
                    backgroundImage: `url(${[...selectedItem.mainImages,
                    ...selectedItem.categoryImages, ...selectedItem.productImages][selectedImageIndex]?.url})`
                }} />
                <span className="draft-preview-main-image-footer">Roll over image to zoom in</span>
            </div>

            {/* Text */}
            <div className="draft-preview-text-container">
                <span className="draft-preview-text-title">{selectedItem.title}</span>
                <a href="#">{`Brand ${selectedItem.attributes[0]?.brand?.value}`}</a>
                <div>
                    <Rate disabled defaultValue={4.5} className="draft-preview-text-rate" allowHalf />
                    <a href="#">(11 ratings)</a>
                </div>
                <Divider className="draft-preview-text-divider" orientation="left" />
                <div className="draft-preview-text-title-price-container">
                    <span className="draft-preview-text-title-price">Price:</span>
                    <span className="draft-preview-text-separator draft-preview-text-title-price-number">{currencyFormatter(currency, selectedItem?.price)}</span>
                    <span className="draft-preview-text-separator draft-preview-text-title-price-shipping">& FREE Shipping</span>
                    <span className="draft-preview-text-separator draft-preview-text-title-price-shipping-discount">on orders over $25.00 shipped by Amazon.</span>
                    <a className="draft-preview-text-separator draft-preview-text-title-price-shipping-details" href="#">Details</a>
                </div>
                <a href="#" className="draft-preview-text-title-price-discount">Get $20 off instantly. Pay $0.00 upon approval for the Amazon.com Store Card.</a>
                <div className="draft-preview-text-category-id-container">
                    <Text type="secondary">{selectedItem?.title}</Text>
                </div>
                <div className="draft-preview-text-variants-container">
                    {draft.variants?.length > 0 ?
                        draft.variants?.map((variant, index) => (
                            <div key={index} className={selectedItem?.id === variant?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(variant)} >
                                <Text style={{ width: 100 }} ellipsis={{ tooltip: variant.title }}>{variant.title}</Text>
                                <Text className="draft-preview-text-variant-card-price">{currencyFormatter(currency, variant.price)}</Text>
                            </div>)) :
                        <div className={selectedItem?.id === draft?.product?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(draft.product)} >
                            <Text style={{ width: 100 }} ellipsis={{ tooltip: draft.product.title }}>{draft.product.title}</Text>
                            <Text className="draft-preview-text-variant-card-price">{currencyFormatter(currency, draft.product.price)}</Text>
                        </div>
                    }
                </div>
                <Divider className="draft-preview-text-divider" orientation="left" />
                {attributes?.map(attb => (
                    <Row>
                        <Col span={6}><Text strong={true} className="text-capitalize">{attb.name?.replace(/_/g, " ")}</Text></Col>
                        <Col span={18}><Text>{attb?.value}</Text></Col>
                    </Row>
                ))}
                <Row>
                    <Col span={6}><Text strong={true} className="text-capitalize">Dimensions</Text></Col>
                    <Col span={18}>
                        <Row>
                            <Col span={24}><Text>Height: {selectedItem?.height} {selectedItem?.measureUnity}</Text></Col>
                            <Col span={24}><Text>Width: {selectedItem?.width} {selectedItem?.measureUnity}</Text></Col>
                            <Col span={24}><Text>Length: {selectedItem?.length} {selectedItem?.measureUnity}</Text></Col>
                            <Col span={24}><Text>Weight: {selectedItem?.weight} {selectedItem?.weightUnity}</Text></Col>
                        </Row>
                    </Col>
                </Row>
                {selectedItem?.attributes[0]?.bullet_point &&
                    <>
                        <Divider className="draft-preview-text-divider" orientation="left" />
                        <List
                            header={<Text strong={true}>About this item</Text>}
                            bordered={false}
                            dataSource={selectedItem?.attributes[0].bullet_point}
                            renderItem={(item, index) => (
                                <List.Item >
                                    <Typography.Text >* </Typography.Text> {item?.value}
                                </List.Item>
                            )}
                        />
                    </>}
            </div>
        </div>
    );
}

export default React.memo(PreviewModal);