import React, { useEffect, useState } from "react";
import {
    PrinterFilled,
    EditOutlined,
    CheckCircleFilled,
    CheckCircleOutlined,
    RightOutlined,
    DownOutlined,
    DeleteOutlined,
    MinusOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import {
    Button,
    Table,
    Tooltip,
    Select,
    Skeleton,
    Space,
    Row,
    Col,
    Spin,
    Modal
} from "antd";
import { useHistory } from "react-router-dom";
import "antd/dist/antd.css";
import { useSelector } from "react-redux";
import SvgTruck from "../../../utils/icons/SvgTruck";
import SvgCircleWarning from "../../../utils/icons/SvgCircleWarning";
import SvgAirplane from "../../../utils/icons/SvgAirplane";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import orderApi from '../../../api/order';
import fulfillmentApi from '../../../api/fulfillmentInbound';
import { openNotification } from '../../../components/Toastr';
import { getErrorMessage } from '../../../api/api';
import { orderGeneralStates } from "../../../utils/const";
import StateChangeModal from './StateChangeModal';
import PrintLabelButton from "./PrintLabelButton";

const antIcon = <LoadingOutlined spin />;

const { Option } = Select;

export const TableOrder = ({ filter, options, setOptions, filterOptionSelected, setSelectedOrders, loadingOrders, orders, getOrders }) => {

    const { t } = useTranslation();

    const session = useSelector((store) => store.Session.session);

    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [modalStateChangeVisible, setModalStateChangeVisible] = useState(false);
    const [successfullyChanged, setSuccessfullyChanged] = useState(false);
    const [orderId, setOrderId] = useState();
    const [state, setState] = useState();
    const [nextState, setNextState] = useState();
    const [loadingURL, setLoadingURL] = useState(false);
    const [orderToPrint, setOrderToPrint] = useState(null);

    const history = useHistory();

    useEffect(() => {
        if (successfullyChanged) {
            setSuccessfullyChanged(false);
            setOrderId(null);
            setState(null);
            setNextState(null);
            getOrders();
        }
    }, [successfullyChanged]);

    useEffect(() => {
        setData(orders)
    }, [orders]);

    const handleStateChange = (text, value, record) => {
        setOrderId(record.key);
        setState(record.state);
        setNextState(text);
        setModalStateChangeVisible(true);
    }

    const getDataLevel = (record) => {
        let level;
        if (record.products) {
            level = 1;
        } else {
            level = 2;
        }
        return level;
    };

    const handlePrintLabels = (record) => {
        setOrderToPrint(record.key);
        setLoadingURL(true)
        getLabelURL(record);
    }

    const getLabelURL = async (record) => {
        if (record.pallets < 1) {
            openNotification({ status: false, content: `ERROR. La orden con id: ${record.id} tiene menos de 1 pallets, y no es posible imprimir su etiqueta si tiene 0 pallets.` });
            return;
        }
        if (!record.amazonId) {
            openNotification({ status: false, content: `ERROR. La orden con id: ${record.id} no tiene un SHIPING ID definido por lo que no es posbile imrimir su etiqueta.` });
            return;
        }
        const values = {
            shipingId: record.amazonId,
            clientId: record.clientId,
            pallets: record.palletCount,
            marketplace: "amazon"
        }
        session.userInfo.role == 'Admin' ?
            await fulfillmentApi.findShipmentLabelsAdmin(values)
                .then((response) => {
                    if (response.data != null && response.data != undefined) window.location.href = response.data;
                })
                .catch((error) => {
                    console.log("El error de getLabelsURL: ", error.message);
                    openNotification({ status: false, content: getErrorMessage(error) });
                })
            : await fulfillmentApi.findShipmentLabelsClient(values)
                .then((response) => {
                    if (response.data != null && response.data != undefined) window.location.href = response.data;
                })
                .catch((error) => {
                    console.log("El error de getLabelsURL: ", error.message);
                    openNotification({ status: false, content: getErrorMessage(error) });
                });
        setLoadingURL(false);
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedOrders(selectedRows);
        },
        onSelect: (record, selected, selectedRows) => { },
        onSelectAll: (selected, selectedRows, changeRows) => { },
        getCheckboxProps: (record) => {
            if (getDataLevel(record) !== 1) {
                return { style: { display: "none" }, disabled: true };
            }
        },
    };

    const expandable = {
        expandIcon: ({ expanded, onExpand, record }) => {
            if (getDataLevel(record) !== 3) {
                return record.children?.length > 0 ? expanded ? (
                    <DownOutlined
                        style={{ marginRight: 10 }}
                        onClick={(e) => onExpand(record, e)}
                    />
                ) : (
                    <RightOutlined
                        style={{ marginRight: 10 }}
                        onClick={(e) => onExpand(record, e)}
                    />
                ) : <MinusOutlined
                    style={{ marginRight: 10 }}
                />
            }
        },
    };

    const allColumns = [
        {
            ellipsis: true,
            title: "LAP ID",
            dataIndex: "lapId",
        },
        {
            ellipsis: true,
            title: "CREACIÓN",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => {
                return moment(text).format('D/M/Y')
            }
        },
        {
            ellipsis: true,
            title: "CLIENTE",
            dataIndex: "clientId",
            key: "clientId",
            render: (text, record) => {
                if (record.client) {
                    return record.client.name;
                } else return '';
            }
        },
        {
            ellipsis: true,
            title: "DOC TRANSPORTE",
            dataIndex: "shippingDocId",
            key: "shippingDocId",
            render: (text, record) => {
                if (record.document) {
                    return record.document.x_name;
                } else return '';
            }
        },
        {
            ellipsis: true,
            title: "AMAZON ID",
            dataIndex: "amazonId",
            key: "amazonId"
        },
        {
            ellipsis: true,
            title: "COSTO",
            dataIndex: "shippingAmount",
            key: "shippingAmount",
            render: (text) => {
                if (text) {
                    return "$ " + text;
                } else {
                    return '';
                }
            }
        },
        {
            ellipsis: true,
            title: "UNIDADES",
            dataIndex: "units",
            key: "units",
        },
        {
            width: 200,
            title: "ESTADO",
            dataIndex: "stage",
            key: "stage",
            render: (value, record) => {
                return (<Select value={record.state} bordered={false} onChange={(text, value) => { handleStateChange(text, value, record) }}
                    disabled={!session.userInfo.isAdmin || ![orderGeneralStates.CONFIRMED, orderGeneralStates.SHIPPED].includes(record.state)}>
                    <Option value="draft" disabled={true}>
                        <EditOutlined /> {orderGeneralStates.DRAFT}
                    </Option>
                    <Option value={orderGeneralStates.CONFIRMED} disabled={record.state !== orderGeneralStates.DRAFT}>
                        <CheckCircleFilled className=" primary" /> {orderGeneralStates.CONFIRMED}
                    </Option>
                    <Option value={orderGeneralStates.SHIPPED} disabled={record.state !== orderGeneralStates.CONFIRMED}>
                        <SvgAirplane height={17} width={17} /> {orderGeneralStates.SHIPPED}
                    </Option>
                    <Option value={orderGeneralStates.ARRIVED_OK} disabled={record.state !== orderGeneralStates.SHIPPED}>
                        <CheckCircleFilled className=" green" /> {orderGeneralStates.ARRIVED_OK}
                    </Option>
                    <Option value={orderGeneralStates.ARRIVED_ERROR} disabled={record.state !== orderGeneralStates.SHIPPED}>
                        <SvgCircleWarning
                            height={17}
                            width={17}
                            fill={"#D4485E"}
                            strokeWarning={"#FFFF"}
                        />
                        {orderGeneralStates.ARRIVED_ERROR}
                    </Option>
                </Select>);
            },
        },
        {
            title: "ACCIONES",
            width: 100,
            render: (value, record) => {
                return (<Space>
                    <Tooltip placement="topLeft" title={t("home.listing.edit")}>
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ fontSize: "16px" }} />}
                            onClick={(e) => { history.push(`restock/${record.key}`); }}
                        //disabled={[orderGeneralStates.CONFIRMED, orderGeneralStates.SHIPPED, orderGeneralStates.ARRIVED_ERROR, orderGeneralStates.ARRIVED_OK].includes(record.state)}
                        />
                    </Tooltip>
                    {record.amazonId ? 
                    <Tooltip
                        placement="topLeft"
                        title={t("home.listing.generateOrder")}
                    >
                        <PrintLabelButton boxes={record.boxes} shippingId={record.amazonId} clientId={record.clientId} pallets={record.palletCount}></PrintLabelButton>
                    </Tooltip>
                    :null}
                </Space>);
            },
        },
    ];

    const productColumns = [
        {
            ellipsis: true,
            title: "SKU",
            dataIndex: "id",
            key: "id",
            render: (text, record) => {
                return record.product.defaultCode
            }
        },
        {
            ellipsis: true,
            title: "UNIDADES",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            ellipsis: true,
            title: "FECHA DE VENCIMIENTO",
            dataIndex: "expirationDate",
            key: "expirationDate",
            render: (text, record) => {
                if (record.expirationDate) {
                    return moment(record.expirationDate).format('D/M/Y');
                }
                return ''
            }
        },
        {
            ellipsis: true,
            title: "TÍTULO",
            dataIndex: "title",
            key: "title",
            render: (text, record) => {
                return record.product.title;
            }
        }

    ]

    return !loadingOrders ? (
        <>
            <Table
                expandable={expandable}
                rowSelection={rowSelection}
                dataSource={data}
                columns={allColumns}
                expandable={{
                    expandedRowRender: record =>
                        <Table columns={productColumns} dataSource={record.products}></Table>
                    ,
                    rowExpandable: record => record.products?.length > 0,
                }}
                pagination={false}
            />
            <StateChangeModal orderId={orderId} state={state} modalStateChangeVisible={modalStateChangeVisible} setModalStateChangeVisible={setModalStateChangeVisible} setSuccessfullyChanged={setSuccessfullyChanged} nextState={nextState} />
        </>
    ) : (
        <div className="generic-spinner">
            <Skeleton active />
        </div>
    );
};