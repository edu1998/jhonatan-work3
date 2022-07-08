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

export const TableVisits = ({ datas, profileCompleted, session, show }) => {
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
          sesiones: 400,
          sesionesPercentaje: 45,
          visitas: 5000,
          visitasPercentaje: 80,
          subData: [
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              image: false,
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
            },
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              image: false
            },
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              image: false,
            },
          ],
        },
        {
          name: 'EBAY',
          sesiones: 400,
          sesionesPercentaje: 45,
          visitas: 5000,
          visitasPercentaje: 80,
          subData: [
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              image: false
            },
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              image: false
            },
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              inventoryPercentaje: 54,
              image: false,
              sesiones: 400,
            },
          ],
        },
        {
          name: 'WALMART',
          sesiones: 400,
          sesionesPercentaje: 45,
          visitas: 5000,
          visitasPercentaje: 80,
          subData: [
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              inventoryPercentaje: 54,
              image: false,
              sesionesPercentaje: 45,
            },
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              inventoryPercentaje: 54,
              image: false,
              visitas: 5000,
            },
            {
              name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
              sku: '1234abcdf5678',
              inventoryPercentaje: 54,
              image: false,
              visitasPercentaje: 80,
            },
          ],
        },
      ] :
      [
        {
          name: "Cliente demo test",
          sesiones: 400,
          visitas: 5000,
          subData: [
            {
              name: 'AMAZON',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  image: false,
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false,
                },
              ],
            },
            {
              name: 'EBAY',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  sesiones: 400,
                },
              ],
            },
            {
              name: 'WALMART',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  sesionesPercentaje: 45,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  visitas: 5000,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  visitasPercentaje: 80,
                },
              ],
            },
          ]
        },
        {
          name: "Cliente demo test",
          sesiones: 400,
          visitas: 5000,
          subData: [
            {
              name: 'AMAZON',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  image: false,
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false,
                },
              ],
            },
            {
              name: 'EBAY',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  sesiones: 400,
                },
              ],
            },
            {
              name: 'WALMART',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  sesionesPercentaje: 45,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  visitas: 5000,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  visitasPercentaje: 80,
                },
              ],
            },
          ]
        },
        {
          name: "Cliente demo test",
          sesiones: 400,
          visitas: 5000,
          subData: [
            {
              name: 'AMAZON',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  image: false,
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false,
                },
              ],
            },
            {
              name: 'EBAY',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  sesiones: 400,
                  sesionesPercentaje: 45,
                  visitas: 5000,
                  visitasPercentaje: 80,
                  image: false
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  sesiones: 400,
                },
              ],
            },
            {
              name: 'WALMART',
              sesiones: 400,
              sesionesPercentaje: 45,
              visitas: 5000,
              visitasPercentaje: 80,
              subData: [
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  sesionesPercentaje: 45,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  visitas: 5000,
                },
                {
                  name: "Lorem Ipsum is simply dummy, Lorem Ipsum is simply null and Lorem Ipsum is simply",
                  sku: '1234abcdf5678',
                  inventoryPercentaje: 54,
                  image: false,
                  visitasPercentaje: 80,
                },
              ],
            },
          ]
        },
      ]
  };

  const columns = [
    {
      ellipsis: true,
      title: 'NAME',
      dataIndex: 'name',
      render: (value, record) => {
        const obj = {
          children: value,
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
      title: 'SESIONES',
      width: '330px',
      dataIndex: 'sesiones',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '80px' }}>
              <span>{record.sesiones}</span>
            </Col>
            {(session.userInfo.role != 'Admin') &&
              <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
                <span>{record.sesionesPercentaje} %</span>
              </Col>
            }
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'VISITAS',
      width: '400px',
      dataIndex: 'visitas',
      render: (value, record) => {
        const obj = {
          children: value,
          props: {}
        }
        obj.children =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '80px' }}>
              <span>{record.visitas}</span>
            </Col>
            {(session.userInfo.role != 'Admin') &&
              <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
                <span>{record.visitasPercentaje} %</span>
              </Col>
            }
          </Row>
        return obj;
      }
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
              <Avatar src={<Image src={`data:image/png;base64, ${record.image_1920}`} />} />
            ) : (
              <Avatar icon={<PictureOutlined />} />
            )}
          </>
        }
        obj.children = component;
        return obj;
      }
    },
    {
      ellipsis: true,
      title: 'NAME',
      dataIndex: 'name',
      render: (value, record) => {
        const obj = {
          children: value,
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
      title: 'SESIONES',
      width: '330px',
      dataIndex: 'sesiones',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '80px' }}>
              <span>{record.sesiones}</span>
            </Col>
            {(session.userInfo.role != 'Admin') &&
              <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
                <span>{record.sesionesPercentaje} %</span>
              </Col>
            }
          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      title: 'VISITAS',
      width: '400px',
      dataIndex: 'visitas',
      render: (value, record) => {
        const obj = {
          children: value,
          props: {}
        }
        obj.children =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '80px' }}>
              <span>{record.visitas}</span>
            </Col>
            {(session.userInfo.role != 'Admin') &&
              <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
                <span>{record.visitasPercentaje} %</span>
              </Col>
            }
          </Row>
        return obj;
      }
    },
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
      width: '330px',
      dataIndex: 'sesiones',
      render: (value, record) => {
        let component;
        const obj = {
          children: value,
          props: {}
        }
        component =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '80px' }}>
              <span>{record.sesiones}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.sesionesPercentaje} %</span>
            </Col>

          </Row>
        obj.children = component;
        return obj;
      },
    },
    {
      ellipsis: false,
      width: '400px',
      dataIndex: 'visitas',
      render: (value, record) => {
        const obj = {
          children: value,
          props: {}
        }
        obj.children =
          <Row style={{ justifyContent: 'flex-start' }}>
            <Col style={{ width: '80px' }}>
              <span>{record.visitas}</span>
            </Col>
            <Col style={{ color: '#5BD692', fontWeight: 'bold' }}>
              <span>{record.visitasPercentaje} %</span>
            </Col>
          </Row>
        return obj;
      }
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
            <Avatar src={<Image src={`data:image/png;base64, ${record.image_1920}`} />} />
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
