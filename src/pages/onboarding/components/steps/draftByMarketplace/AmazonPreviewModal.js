import React, { useState, useEffect } from 'react';
import { Divider, Rate, Typography, Row, Col, List, Image } from 'antd';
import { marketplaceCurrency } from '../../../../../utils/const';

const { Text, Title } = Typography;

const AmazonPreviewModal = ({ draft, marketplace }) => {
  const [selectedItem, setItem] = useState(draft?.variants?.length > 0 ? draft?.variants[0] : draft?.product);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [attributes, setAttributes] = useState([]);
  const [bulletPoint, setBulletPoint] = useState([]);

  const setSelectedItem = (itm) => {
    setItem(itm);
    setSelectedImageIndex(0);
  }

  useEffect(() => {
    if (selectedItem.attributes) {
      let data = selectedItem.attributes?.length > 0 ? selectedItem.attributes[0] : selectedItem.attributes;
      let attbs = [];
      for (const key in data) {
        if (!["product_description", "brand", "bullet_point"].includes(key)) {
          continue;
        }
        let element = data[key];
        if (element?.value) {
          attbs.push({ name: key, value: element.value });
        }
        if (key === 'bullet_point') {
          element = Array.isArray(element) ? element : [element];
          setBulletPoint(element || []);
        }
      }
      setAttributes(attbs);
    }
  }, [selectedItem])

  return (
    <Row className="draft-preview-container" style={{ height: '600px' }}>
      <Col style={{ width: "90px", maxHeight: "400px", overflowY: "auto", direction: "rtl", overflowX: "hidden" }}>
        {[...selectedItem.mainImages, ...selectedItem.productImages].map((image, index) => (
          <Image preview={false} style={{ width: "85%", height: "85%", border: "1px solid", padding: "3px" }} onClick={() => { setSelectedImageIndex(index) }} key={index} src={image.url} />
        ))}
      </Col>

      {/* Main image */}
      <div className="draft-preview-main-image-container">
        <div className="draft-image draft-preview-main-image" style={{
          backgroundImage: `url(${[...selectedItem.mainImages, ...selectedItem.productImages][selectedImageIndex]?.url})`
        }} />
        <span className="draft-preview-main-image-footer">Roll over image to zoom in</span>
      </div>

      {/* Text */}
      <div className="draft-preview-text-container">
        <Title level={2} ellipsis={{ tooltip: attributes?.find(attb => attb.name === 'item_name')?.value }}>
          {attributes?.find(attb => attb.name === 'item_name')?.value}
        </Title>
        <a href="#">{`Brand ${attributes?.find(attb => attb.name === 'brand')?.value}`}</a>
        <div>
          <Rate disabled defaultValue={4.5} className="draft-preview-text-rate" allowHalf />
          <a href="#">(11 ratings)</a>
        </div>
        <Divider className="draft-preview-text-divider" orientation="left" />
        <div className="draft-preview-text-title-price-container">
          <span className="draft-preview-text-title-price">Price:</span>
          <span className="draft-preview-text-separator draft-preview-text-title-price-number">{`${marketplaceCurrency[marketplace]} ${selectedItem.price}`}</span>
          <span className="draft-preview-text-separator draft-preview-text-title-price-shipping">& FREE Shipping</span>
          <span className="draft-preview-text-separator draft-preview-text-title-price-shipping-discount">on orders over $25.00 shipped by Amazon.</span>
          <a className="draft-preview-text-separator draft-preview-text-title-price-shipping-details" href="#">Details</a>
        </div>
        <a href="#" className="draft-preview-text-title-price-discount">Get $20 off instantly. Pay $0.00 upon approval for the Amazon.com Store Card.</a>
        <div className="draft-preview-text-category-id-container">
          <Text type="secondary" ellipsis={{ tooltip: selectedItem?.title }}>{selectedItem?.title}</Text>
        </div>
        <div className="draft-preview-text-variants-container">
          {draft.variants?.length > 0 ?
            draft.variants?.map((variant, index) => (
              <div key={index} className={selectedItem?.id === variant?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(variant)} >
                <Text style={{ width: 100 }} ellipsis={{ tooltip: variant?.title }}>{variant?.title}</Text>
                <Text className="draft-preview-text-variant-card-price">{`${marketplaceCurrency[marketplace]} ${variant.price}`}</Text>
              </div>)) :
            <div className={selectedItem?.id === draft?.product?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(draft.product)} >
              <Text style={{ width: 100 }} ellipsis={{ tooltip: draft?.product?.title }}>{draft?.product?.title}</Text>
              <Text className="draft-preview-text-variant-card-price">{`${marketplaceCurrency[marketplace]} ${draft.product.price}`}</Text>
            </div>
          }
        </div>
        <Divider className="draft-preview-text-divider" orientation="left" />
        {selectedItem?.attributes[0]?.variation_theme?.name ? <Row>
          <Col span={6}><Text strong={true} className="text-capitalize">Varía en</Text></Col>
          <Col span={18}><Text>{selectedItem?.attributes[0]?.variation_theme?.name}</Text></Col>
        </Row> : ''}
        {attributes?.map((attb, index) => (
          <Row key={index}>
            <Col span={6}><Text strong={true} className="text-capitalize">{attb.name?.replace(/_/g, " ")}</Text></Col>
            <Col span={18}><Text>{attb?.value}</Text></Col>
          </Row>
        ))}
        {bulletPoint?.length > 0 &&
          <>
            <Divider className="draft-preview-text-divider" orientation="left" />
            <List
              header={<Text strong={true}>About this item</Text>}
              bordered={false}
              dataSource={bulletPoint?.filter(bp => bp?.value)}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <Typography.Text >* </Typography.Text> {item?.value}
                </List.Item>
              )
              }
            />
          </>}
      </div>
    </Row>
  );
}

export default React.memo(AmazonPreviewModal);