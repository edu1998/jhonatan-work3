import React, { useEffect, useState } from "react";
import {
  DownOutlined,
  DeleteOutlined,
  PictureOutlined,
  UpOutlined,
  MinusOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
  Button,
  Table,
  Row,
  Col,
  Space,
  Avatar,
  Image,
  Skeleton
} from "antd";
import "antd/dist/antd.css";
import { CustomTableEmptyText } from './CustomTableEmptyText';

export const TableMarketing = ({ datas, profileCompleted, session, show }) => {
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const [loadingAPI, setLoadingAPI] = useState(false);

  useEffect(async () => {
    if (true) {
      setLoadingAPI(true);
      setData(handleData);
      setLoadingAPI(false);
    } else {
      setLoadingAPI(true);
      //setSales(datas);
      setLoadingAPI(false);
    }
  }, []);


  const handleData = () => {

    return session.userInfo.role !== 'Admin' ?
      [
        {
          name: 'AMAZON',
          image: false,
          ventas: 100,
          monto: 1230000.12,
          montoPercentaje: 1000,
          pedidosPorOrden: 20000,
          pedidosPorOrdenPercentaje: 90,
          promedioPorOrden: 2.5,
          promedioPorOrdenPercentaje: 50,
          orders: 100,
          ordersPercentaje: 30,
          inversionCampaign: 831.12,
          ventaPerCampaign: 620.20,
          acos: 81,
          subData: [
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
          ],
        },
        {
          name: 'EBAY',
          image: false,
          ventas: 100,
          monto: 1230000.12,
          montoPercentaje: 1000,
          pedidosPorOrden: 20000,
          pedidosPorOrdenPercentaje: 90,
          promedioPorOrden: 2.5,
          promedioPorOrdenPercentaje: 50,
          orders: 100,
          ordersPercentaje: 30,
          inversionCampaign: 831.12,
          ventaPerCampaign: 620.20,
          acos: 81,
          subData: [
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
          ],
        },
        {
          name: 'WALMART',
          image: false,
          ventas: 100,
          monto: 1230000.12,
          montoPercentaje: 1000,
          pedidosPorOrden: 20000,
          pedidosPorOrdenPercentaje: 90,
          promedioPorOrden: 2.5,
          promedioPorOrdenPercentaje: 50,
          orders: 100,
          ordersPercentaje: 30,
          inversionCampaign: 831.12,
          ventaPerCampaign: 620.20,
          acos: 81,
          subData: [
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
            {
              name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
              sku: '2344BFSD231',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
            },
          ],
        },
        {
          name: 'Other Market Place',
          image: false,
          ventas: 100,
          monto: 1230000.12,
          montoPercentaje: 1000,
          pedidosPorOrden: 20000,
          pedidosPorOrdenPercentaje: 90,
          promedioPorOrden: 2.5,
          promedioPorOrdenPercentaje: 50,
          orders: 100,
          ordersPercentaje: 30,
          inversionCampaign: 831.12,
          ventaPerCampaign: 620.20,
          acos: 81,
          subData: [],
        }
      ] : [
        {
          name: 'Cliente 1',
          image: false,
          ventas: 100,
          monto: 1230000.12,
          montoPercentaje: 1000,
          pedidosPorOrden: 20000,
          pedidosPorOrdenPercentaje: 90,
          promedioPorOrden: 2.5,
          promedioPorOrdenPercentaje: 50,
          orders: 100,
          ordersPercentaje: 30,
          inversionCampaign: 831.12,
          ventaPerCampaign: 620.20,
          acos: 81,
          subData: [],
        },
        {
          name: 'Cliente 2',
          image: false,
          ventas: 100,
          monto: 1230000.12,
          montoPercentaje: 1000,
          pedidosPorOrden: 20000,
          pedidosPorOrdenPercentaje: 90,
          promedioPorOrden: 2.5,
          promedioPorOrdenPercentaje: 50,
          orders: 100,
          ordersPercentaje: 30,
          inversionCampaign: 831.12,
          ventaPerCampaign: 620.20,
          acos: 81,
          subData: [
            {
              name: 'AMAZON',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
              ],
            },
            {
              name: 'EBAY',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
              ],
            },
            {
              name: 'WALMART',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
              ],
            },
            {
              name: 'Other Market Place',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [],
            }
          ],
        },
        {
          name: 'Cliente 3',
          image: false,
          ventas: 100,
          monto: 1230000.12,
          montoPercentaje: 1000,
          pedidosPorOrden: 20000,
          pedidosPorOrdenPercentaje: 90,
          promedioPorOrden: 2.5,
          promedioPorOrdenPercentaje: 50,
          orders: 100,
          ordersPercentaje: 30,
          inversionCampaign: 831.12,
          ventaPerCampaign: 620.20,
          acos: 81,
          subData: [
            {
              name: 'AMAZON',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [],
            },
            {
              name: 'EBAY',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [],
            },
            {
              name: 'WALMART',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
                {
                  name: 'Praeterea, exculpa non invenies unum aut non accusatis unum. Et nihil inuitam',
                  sku: '2344BFSD231',
                  image: false,
                  ventas: 100,
                  monto: 1230000.12,
                  montoPercentaje: 1000,
                  pedidosPorOrden: 20000,
                  pedidosPorOrdenPercentaje: 90,
                  promedioPorOrden: 2.5,
                  promedioPorOrdenPercentaje: 50,
                  orders: 100,
                  ordersPercentaje: 30,
                  inversionCampaign: 831.12,
                  ventaPerCampaign: 620.20,
                  acos: 81,
                },
              ],
            },
            {
              name: 'Other Market Place',
              image: false,
              ventas: 100,
              monto: 1230000.12,
              montoPercentaje: 1000,
              pedidosPorOrden: 20000,
              pedidosPorOrdenPercentaje: 90,
              promedioPorOrden: 2.5,
              promedioPorOrdenPercentaje: 50,
              orders: 100,
              ordersPercentaje: 30,
              inversionCampaign: 831.12,
              ventaPerCampaign: 620.20,
              acos: 81,
              subData: [],
            }
          ],
        },
      ]
  }

  /*
    ventas: 100,
    orders: 100,
    ordersPercentaje: 30,
    monto: 1230000.12,
    montoPercentaje: 1000,
    promedioPorOrden: 2.5,
    promedioPorOrdenPercentaje: 50,
    pedidosPorOrden: 20000,
    pedidosPorOrdenPercentaje: 90,
    inversionCampaign: 831.12,
    ventaPerCampaign: 620.20,
    acos: 81,
  */

  const columns = [
    {
      ellipsis: true,
      title: 'NAME',
      dataIndex: 'name',
      render: (value, record) => {
        const obj = {
          children: record.name,
          props: {}
        }
        obj.children = record.name;
        if (session.userInfo.role != 'Admin') {
          if (record.name == 'AMAZON' || 'EBAY' || 'WALMART') {
            return <span style={{
              color: '#08c',
              textDecoration: 'underline',
            }}>{record.name}</span>
          }
        }
        return obj;
      }
    },
    {
      ellipsis: false,
      title: 'UNIDADES DE VENTA',
      dataIndex: 'unidadesDeVenta',
      width: '110px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component = <span>{record.ventas}</span>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'ORDENES',
      dataIndex: 'orders',
      width: '110px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '50px' }}>
              <span>{record.orders}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.ordersPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'TOTAL VENTAS',
      dataIndex: 'monto',
      width: '180px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '110px' }}>
              <span>$ {record.monto}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.montoPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'PROMEDIO POR ORDEN',
      dataIndex: 'promedioPorOrden',
      width: '120px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '50px' }}>
              <span>$ {record.promedioPorOrden}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.promedioPorOrdenPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'PEDIDOS POR ORDEN',
      dataIndex: 'pedidosPorOrden',
      width: '120px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '60px' }}>
              <span>{record.pedidosPorOrden}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.pedidosPorOrdenPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'INVERSION EN CAMPANIA',
      dataIndex: 'inversionCampaign',
      width: '120px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'center' }}>
            <span>$ {record.inversionCampaign}</span>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'VENTA POR CAMPANIA',
      dataIndex: 'ventaPerCampaign',
      width: '100px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'center' }}>
            <span>$ {record.ventaPerCampaign}</span>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'ACOS',
      dataIndex: 'acos',
      width: '60px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'center', color: 'rgb(247 8 6 / 1)', fontWeight: 'bold' }}>
            <span>{record.acos} %</span>
          </Row>
        obj.children = component;
        return obj;
      },
    },
  ];

  const columnsAdmin = [
    {
      ellipsis: false,
      title: 'IMAGE',
      width: '85px',
      dataIndex: 'image',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        if (session.userInfo.role == 'Admin') {
          component = <>
            {record.image ? (
              <Avatar src={<Image src={record.image} />} />
            ) : (
              <Avatar icon={<PictureOutlined />} />
            )}
          </>
        } 
        obj.children = component;
        return obj;
      }
    },
    ...columns
  ];

  const columnsNoHeader = [
    {
      ellipsis: false,
      width: '1px',
      dataIndex: 'image',
    },
    {
      ellipsis: true,
      dataIndex: 'name',
      render: (value, record) => {
        let component;
        const obj = {
          children: record.name,
          props: {}
        }
        if (session.userInfo.role == 'Admin') {

          if (record.name == 'AMAZON' || 'EBAY' || 'WALMART') {
            component = <span style={{
              color: '#08c',
              textDecoration: 'underline',
            }}>{record.name}</span>
            obj.children = component;
          }
        }
        if (record.sku) {
          component =
            <Col>
              <Row>
                {record.name}
              </Row>
              <Row style={{ color: 'lightGray' }}>
                SKU: {record.sku}
              </Row>
            </Col>
          obj.children = component;
        }
        return obj;
      }
    },
    {
      ellipsis: false,
      dataIndex: 'unidadesDeVenta',
      width: '110px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component = <span>{record.ventas}</span>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      dataIndex: 'orders',
      width: '110px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '50px' }}>
              <span>{record.orders}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.ordersPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      dataIndex: 'monto',
      width: '180px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '110px' }}>
              <span>$ {record.monto}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.montoPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      dataIndex: 'promedioPorOrden',
      width: '120px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '50px' }}>
              <span>$ {record.promedioPorOrden}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.promedioPorOrdenPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      dataIndex: 'pedidosPorOrden',
      width: '120px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '60px' }}>
              <span>{record.pedidosPorOrden}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.pedidosPorOrdenPercentaje} %</span>
            </Col>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      dataIndex: 'inversionCampaign',
      width: '120px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'center' }}>
            <span>$ {record.inversionCampaign}</span>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      dataIndex: 'ventaPerCampaign',
      width: '100px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'center' }}>
            <span>$ {record.ventaPerCampaign}</span>
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      dataIndex: 'acos',
      width: '60px',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'center', color: 'rgb(247 8 6 / 1)', fontWeight: 'bold' }}>
            <span>{record.acos} %</span>
          </Row>
        obj.children = component;
        return obj;
      },
    },
  ];

  const columnsSecondLevel = [
    {
      ellipsis: false,
      width: '10px',
      dataIndex: 'image',
    },
    ...columnsNoHeader
  ];

  const columnsThirdLevel = [
    {
      ellipsis: false,
      title: 'IMAGE',
      width: '53px',
      dataIndex: 'image',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component = <>
          {record.image ? (
            <Avatar src={<Image src={record.image} />} />
          ) : (
            <Avatar icon={<PictureOutlined />} />
          )}
        </>
        obj.children = component;
        return obj;
      }
    },
    ...columnsNoHeader
  ];

  const expandedRoww = (record) => {
    if (record[0].name == 'AMAZON') {
      return <Table
        rowSelection={false}
        expandable={{
          expandIcon: ({ expanded, onExpand, record }) =>
            record.subData.length > 0 ? expanded ? (
              <UpOutlined onClick={e => onExpand(record, e)} />
            ) : (
              <DownOutlined onClick={e => onExpand(record, e)} />
            )
              : <MinusOutlined />,
          columnWidth: 30
        }}
        dataSource={record.map((item, index) => ({ ...item, key: index }))}
        columns={columnsSecondLevel}
        expandedRowRender={(record) => expandedRoww(record.subData)}
        rowClassName={"stock-row-marketplaces"}
        size='small'
        pagination={false}
        showHeader={false}
      />

    } else {
      return <Table
        rowSelection={false}
        dataSource={record.map((item, index) => ({ ...item, key: index }))}
        columns={columnsThirdLevel}
        pagination={false}
        showHeader={false}
      />
    }
  }

  return (
    <>
      {
        show ? !loadingAPI ?
          <Table
            className="order-table"
            rowSelection={false}
            locale={{ emptyText: <CustomTableEmptyText profileCompleted={profileCompleted} /> }}
            scroll={{ x: 1200, y: 400 }}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) =>
                record.subData.length > 0 ? expanded ? (
                  <UpOutlined onClick={e => onExpand(record, e)} />
                ) : (
                  <DownOutlined onClick={e => onExpand(record, e)} />
                )
                  : <MinusOutlined />,
              columnWidth: 50
            }}
            dataSource={data.map((item, index) => ({ ...item, key: index }))}
            columns={session.userInfo.role != 'Admin' ? columns : columnsAdmin}
            expandedRowRender={(record) => expandedRoww(record.subData)}
            rowClassName={session.userInfo.role != 'Admin' ? "stock-row-marketplaces" : ""}
            size='small'
            pagination={false}
          /> :
          <div className="generic-spinner">
            <Skeleton active />
          </div>
          : null
      }
    </>
  );
};
