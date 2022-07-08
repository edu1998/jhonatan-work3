import React, { useState } from 'react';
import { Divider, Typography, Row, Col, Image, Button, Rate, Card, InputNumber } from 'antd';
import { ShoppingCartOutlined, CarOutlined } from "@ant-design/icons";
import { currencyFormatter } from '../../../../../utils/currencies';
const { Text } = Typography;

const currency = 'USD';
const WalmartPreviewModal = ({ draft }) => {

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedItem, setItem] = useState(draft?.variants?.length > 0 ? draft?.variants[0] : draft?.product);
  const [quantity, setQuantity] = useState(1);

  const setSelectedItem = (itm) => {
    setItem(itm);
    setSelectedImageIndex(0);
  }

  return (
    <>
      <div className="draft-preview-text-variants-container">
        {draft.variants?.length > 0 ?
          draft.variants?.map((variant, index) => (
            <div key={index} className={selectedItem?.id === variant?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(variant)} >
              <Text style={{ width: 60 }} ellipsis={{ tooltip: variant.title }}>{variant.title}</Text>
              <Text className="draft-preview-text-variant-card-price">{currencyFormatter(currency, variant.price)}</Text>
            </div>)) :
          <div className={selectedItem?.id === selectedItem?.id ? "draft-preview-text-variant-card draft-preview-text-variant-card-selected" : "draft-preview-text-variant-card"} onClick={() => setSelectedItem(selectedItem)} >
            <Text style={{ width: 60 }} ellipsis={{ tooltip: selectedItem.title }}>{selectedItem.title}</Text>
            <Text className="draft-preview-text-variant-card-price">{currencyFormatter(currency, selectedItem.price)}</Text>
          </div>
        }
      </div>
      <Row style={{ overflow: 'auto', width: '900px' }}>
        <Col span={11} >
          <Row>
            <Col>
              <Text style={{ fontWeight: "bold", fontSize: "23px", marginTop: "10px" }}>{selectedItem.title ? selectedItem.title : selectedItem.attributes.title}</Text>
            </Col>
          </Row>
          <Row>
            <Col >
              <Rate disabled defaultValue={4} />
            </Col>
            <Col style={{ marginTop: "5px", marginLeft: "15px" }}>
              <Text href="#">(54 ratings)</Text>
            </Col>
          </Row>
          <Row style={{ width: '100%', marginTop: "20px" }}>
            <Col style={{ width: "90px", maxHeight: "445px", overflowY: "auto", direction: "rtl", overflowX: "hidden" }}>
              {[...selectedItem.mainImages, ...selectedItem.productImages].map((image, index) => (
                <Image preview={false} style={{ width: "95%", border: "1px solid #007DC6", }} onClick={() => { setSelectedImageIndex(index) }} key={index} src={image.url} />
              ))}
            </Col>
            <Col style={{ width: "300px", alignSelf: "center", marginLeft: "15px" }}>
              <Image preview={false} style={{ height: "100%" }} key={"ImagenSeleccionada"} src={[...selectedItem.mainImages, ...selectedItem.productImages][selectedImageIndex]?.url} />
            </Col>
          </Row>
          <Row>
            <Text style={{ fontSize: "12px", marginTop: "10px" }}>Listed in category: </Text>
            <Text style={{ fontSize: "12px", marginTop: "10px", marginLeft: "5px", color: "blue" }}>{draft.category}</Text>
          </Row>
        </Col>
        <Col span={12} style={{ marginLeft: "20px" }}>
          <Row style={{ marginTop: "88px" }}>
            <Card>
              <Row>
                <Text style={{ fontSize: "18px", color: "#007DC6", margin: "10px 2px 0px 0px", fontWeight: "bold" }}>$</Text>
                <Text style={{ fontSize: "35px", color: "#007DC6", fontWeight: 'bold' }}>{selectedItem.price}</Text>
                <Text style={{ fontSize: "12px", color: "white", fontWeight: 'bold', margin: "12px 0px 0px 10px" }} ><span style={{ backgroundColor: "#dd1e31", borderRadius: "10%", padding: "3px 8px 3px 8px" }}>- %11 </span></Text>
              </Row>
              <Row style={{ alignItems: "center", backgroundColor: "#F5F8FD", height: "100px", justifyContent: "center" }}>
                <Col style={{ alignItems: "center" }}>
                  <Row>
                    <Text style={{ color: "#999" }}>Cantidad (Und.)</Text>
                  </Row>
                  <Row>
                    <Col>
                      <Row>
                        <Button style={{ color: "#007DC6" }} onClick={() => { quantity > 0 && setQuantity(quantity - 1) }}> - </Button>
                        <InputNumber style={{ width: '35px' }} min={0} value={quantity} />
                        <Button style={{ color: "#007DC6" }} onClick={() => { setQuantity(quantity + 1) }}> + </Button>
                      </Row>
                    </Col>
                    <Col style={{ marginLeft: "35px" }}>
                      <Row>
                        <Button icon={<ShoppingCartOutlined />} style={{ backgroundColor: "#D98633", borderRadius: "2%", color: "white", fontWeight: "bold", fontSize: "13px" }}>Agregar al carrito</Button>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Col style={{ width: '25%', alignSelf: 'center' }}>
                  <CarOutlined style={{ marginLeft: '45px', fontSize: '30px', color: '#007DC6' }} />
                </Col>
                <Col style={{ width: '25%' }}>
                  <Text style={{ fontSize: '12px', color: "#007DC6", }}>Los productos mas frescos directo a tu hogar</Text>
                </Col>
                <Col>
                  <Button style={{ color: "#007DC6", marginTop: "15px", marginLeft: "15px" }}> Elegi tu sucursal</Button>
                </Col>
              </Row>
            </Card>
          </Row>
          <Card style={{ marginTop: "10px" }}>
            <Row style={{ alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
              <div style={{ color: "#007DC6", fontSize: "14px", padding: "2px", borderBottom: "1px solid #E0E0E0", }}>
                Información del Producto
              </div>
            </Row>
            <Row>
              <Col style={{ width: "120px" }}>
                <Text strong={true}>Brand</Text>
              </Col>
              <Col>
                <Text style={{ color: "#999" }}>{selectedItem.attributes.Brand}</Text>
              </Col>
            </Row>
            <Divider style={{ margin: "5px 0 5px 0" }} />
            <Row style={{ display: 'inline' }}>
              {selectedItem.attributes.Color &&
                <>
                  <Row>
                    <Col style={{ width: "120px" }}>
                      <Text strong={true} >Color</Text>
                    </Col>
                    <Col>
                      <Text style={{ color: "#999" }}>{selectedItem.attributes.Color}</Text>
                    </Col>
                  </Row>
                  <Divider style={{ margin: "5px 0 5px 0" }} />
                </>
              }
              <Row>
                <Col style={{ width: "120px" }}>
                  <Text strong={true}>Dimensions</Text>
                </Col>
                <Col>
                  <Row>
                    <Text style={{ width: "60px", color: "#999" }}>Height: </Text>
                    <Text style={{ color: "#999" }}>{selectedItem?.height} {selectedItem?.measureUnity}</Text>
                  </Row>
                  <Row>
                    <Text style={{ width: "60px", color: "#999" }}>Width: </Text>
                    <Text style={{ color: "#999" }}>{selectedItem?.width} {selectedItem?.measureUnity}</Text>
                  </Row>
                  <Row>
                    <Text style={{ width: "60px", color: "#999" }}>Length: </Text>
                    <Text style={{ color: "#999" }}>{selectedItem?.length} {selectedItem?.measureUnity}</Text>
                  </Row>
                  <Row>
                    <Text style={{ width: "60px", color: "#999" }}>Weight: </Text>
                    <Text style={{ color: "#999" }}>{selectedItem?.weight} {selectedItem?.weightUnity}</Text>
                  </Row>
                </Col>
              </Row>
              <Divider style={{ margin: "5px 0 5px 0" }} />
              <Row>
                <Col style={{ width: "120px" }}><Text strong={true} >Description</Text></Col>
                <Col><Text>{selectedItem.attributes.description}</Text></Col>
              </Row>
            </Row>
          </Card>
        </Col >
      </Row >
    </>
  );
}

export default React.memo(WalmartPreviewModal);