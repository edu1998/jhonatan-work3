import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Image, Button, Space } from 'antd';

const { Text, Title } = Typography;

const ShopifyPreviewModal = ({ draft }) => {

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedItem, setItem] = useState(draft?.variants?.length > 0 ? draft?.variants[0] : draft?.product);
  const [attributes, setAttributes] = useState([]);

  const setSelectedItem = (itm) => {
    setItem(itm);
    setSelectedImageIndex(0);
  }

  useEffect(() => {
    if (selectedItem?.attributes) {
      setAttributes(selectedItem?.attributes);
    }
  }, [selectedItem])


  return (
    <Row style={{ overflow: 'auto', height: 600 }}>
      <Col span={12} >
        <Row>
          <Col span={24}>
            {[...selectedItem?.mainImages, ...selectedItem?.productImages].map((image, index) => (
              <Image preview={false} style={{ width: "100%", border: "1px solid grey", padding: "3px" }} src={image.url} />
            ))}
          </Col>
        </Row>
      </Col>
      <Col span={12} style={{padding: 12}}>
        <Row>
          <Space direction="vertical">

            <Text type="secondary" style={{ fontSize: "12px" }}>{selectedItem.attributes?.vendor}</Text>
            <Title level={2}>{selectedItem?.title}</Title>
            <Title level={5}>$ {selectedItem?.price}</Title>
          </Space>
        </Row>
        <Row>
          <Space direction="vertical" style={{width: '100%'}}>
              <Button ghost block style={{color:'#333', borderColor:'#333'}}>Add to cart</Button>
              <Button type="primary" block style={{backgroundColor:'#333', borderColor:'#333'}}>Buy it now</Button>
          </Space>
        </Row>
        <Row>
          <Text style={{ fontSize: "12px" }}>{selectedItem?.attributes?.body_html}</Text>
        </Row>
      </Col>
    </Row>
  );
}

export default React.memo(ShopifyPreviewModal);