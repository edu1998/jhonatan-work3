import React, { useEffect, useState } from 'react';
import { Divider, Typography, Row, Col, Image, Button, Rate, Card } from 'antd';
import { CheckCircleOutlined } from "@ant-design/icons";
import { marketplaceCurrency } from '../../../../../utils/const';

const { Text } = Typography;

const EbayPreviewModal = ({ draft, marketplace }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedItem, setItem] = useState(draft?.variants?.length > 0 ? draft?.variants[0] : draft?.product);
  const [attributes, setAttributes] = useState([]);

  const setSelectedItem = (itm) => {
    setItem(itm);
    setSelectedImageIndex(0);
  }

  useEffect(() => {
    if (selectedItem?.attributes) {
      let attbs = [];
      for (const key in selectedItem.attributes) {
        if (Object.hasOwnProperty.call(selectedItem.attributes, key)) {
          const element = selectedItem.attributes[key];
          attbs.push({ name: key, value: typeof element === 'string' ? element : element?.join() });
        }
      }
      setAttributes(attbs);
    }
  }, [selectedItem])


  return (
    <Row style={{ overflow: 'auto', height: 600 }}>
      <Col span={11} >
        <Row>
          <Text style={{ fontWeight: "bold", fontSize: "18px", marginTop: "10px" }}>{selectedItem.attributes.title}</Text>
        </Row>
        {draft.variants.length > 0 &&
          <Row>
            <Text bold style={{ fontSize: "18px", marginTop: "10px" }}>Variants: </Text>
          </Row>
        }
        <div className="draft-preview-text-variants-container">
          {draft.variants?.length > 0 ?
            draft.variants?.map((variant, index) => (
              <div style={{ width: 170 }} key={index} className={selectedItem?.id === variant?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(variant)} >
                <Text style={{ width: 100 }} ellipsis={{ tooltip: variant.title }}>{variant.title}</Text>
                <Text className="draft-preview-text-variant-card-price">{`${marketplaceCurrency[marketplace]} ${variant.price}`}</Text>
              </div>)) :
            <div style={{ width: 170 }} className={selectedItem?.id === selectedItem?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(selectedItem)} >
              <Text style={{ width: 100 }} ellipsis={{ tooltip: selectedItem.title }}>{selectedItem.title}</Text>
              <Text className="draft-preview-text-variant-card-price">{`${marketplaceCurrency[marketplace]} ${selectedItem.price}`}</Text>
            </div>
          }
        </div>
        <Row style={{ width: '100%' }}>
          <Col style={{ width: "20%", maxHeight: "445px", overflowY: "auto", direction: "rtl", overflowX: "hidden" }}>
            {[...selectedItem.mainImages, ...selectedItem.productImages].map((image, index) => (
              <Image preview={false} style={{ width: "100%", border: "1px solid grey", padding: "3px" }} onClick={() => { setSelectedImageIndex(index) }} key={index} src={image.url} />
            ))}
          </Col>
          <Col style={{ alignSelf: "center", marginLeft: "15px", width: '70%' }}>
            <Image preview={false} style={{ height: "100%", border: "1px solid lightgrey", padding: "3px" }} key={"ImagenSeleccionada"} src={[...selectedItem.mainImages, ...selectedItem.productImages][selectedImageIndex]?.url} />
          </Col>
        </Row>
      </Col>
      <Col span={12} style={{ marginLeft: "15px" }}>
        <Card>
          <Row>
            <Col>
              <CheckCircleOutlined style={{ color: "blue" }} />
            </Col>
            <Text style={{ marginLeft: "10px" }}>Authenticity Guarantee</Text>
          </Row>

          <Row>
            <Text style={{ fontSize: "12px", marginTop: "10px" }}>Listed in category: </Text>
            <Text style={{ fontSize: "12px", marginTop: "10px", marginLeft: "5px", color: "blue" }}>{draft.category}</Text>
          </Row>
          <Row>
            <Col>
              <Rate disabled defaultValue={4.5} allowHalf />
            </Col>
            <Col style={{ marginTop: "5px", marginLeft: "15px" }}>
              <Text href="#">(23 ratings)</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "0px 0 15px 0", backgroundColor: "lightgrey" }} />
          <Row>
            <Col style={{ width: "80px" }}>
              <Text>Condition: </Text>
            </Col>
            <Col>
              <Text style={{ color: "gray" }}>{selectedItem.attributes.condition}</Text>
            </Col>
          </Row>
          <Row>
            <Col style={{ marginLeft: "80px" }}>
              <Text style={{ fontStyle: "italic" }}>" {selectedItem.attributes.conditionDescription} "</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "0px 0 15px 0", backgroundColor: "lightgrey" }} />
          <Row style={{ justifyContent: "space-between" }}>
            <Col>
              <Row>
                <Col style={{ width: "80px" }}>
                  <Text>Price: </Text>
                </Col>
                <Col>
                  <Text style={{ fontSize: "18px", fontWeight: "bold" }}>{`${marketplaceCurrency[marketplace]} ${selectedItem.price ? selectedItem.price : 0.00}`}</Text>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Button style={{ width: '190px', backgroundColor: "#0053a0", color: '#FFFFFF', fontWeight: "bold" }} shape="round" >Buy it now</Button>
              </Row>
              <Row>
                <Button style={{ width: '190px', margin: "5px 0 5px 0", backgroundColor: "#3498ca", color: '#FFFFFF', fontWeight: "bold" }} shape="round" >Add to cart</Button>
              </Row>
              <Row>
                <Button style={{ width: '190px', marginBottom: "5px" }} shape="round" >Add to Watchlist</Button>
              </Row>
            </Col>
          </Row>
          <Divider style={{ margin: "0px 0 15px 0", backgroundColor: "lightgrey" }} />
          <Row>
            <Col style={{ width: "250px" }}>
              <Text style={{ color: "#dd1e31", fontWeight: "bold" }}>30-day returns</Text>
            </Col>
            <Col>
              <Divider type="vertical" style={{ backgroundColor: "lightgrey" }} />
            </Col>
            <Col>
              <Text> 12 watchers</Text>
            </Col>
          </Row>
          <Divider style={{ margin: "15px 0 10px 0", backgroundColor: "lightgrey" }} />
          {attributes?.map(attb => (
            <Row>
              <Col style={{ width: "240px" }}><Text strong={true} className="text-capitalize">{attb.name?.replace(/_/g, " ")}</Text></Col>
              <Col style={{ maxWidth: '58%' }}><Text>{attb?.value}</Text></Col>
              <Divider style={{ margin: "5px 0 5px 0" }} />
            </Row>
          ))}
          <Row style={{ display: 'inline' }}>
            <Row>
              <Col style={{ width: "240px" }}>
                <Text strong={true}>Dimensions</Text>
              </Col>
              <Col>
                <Row>
                  <Text style={{ width: "60px" }}>Height: </Text>
                  <Text>{selectedItem?.height} {selectedItem?.measureUnity}</Text>
                </Row>
                <Row>
                  <Text style={{ width: "60px" }}>Width: </Text>
                  <Text>{selectedItem?.width} {selectedItem?.measureUnity}</Text>
                </Row>
                <Row>
                  <Text style={{ width: "60px" }}>Length: </Text>
                  <Text>{selectedItem?.length} {selectedItem?.measureUnity}</Text>
                </Row>
                <Row>
                  <Text style={{ width: "60px" }}>Weight: </Text>
                  <Text>{selectedItem?.weight} {selectedItem?.weightUnity}</Text>
                </Row>
              </Col>
            </Row>
          </Row>
        </Card>
      </Col >
    </Row >
  );
}

export default React.memo(EbayPreviewModal);