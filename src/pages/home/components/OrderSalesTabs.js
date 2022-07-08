import React, { useState, useEffect } from "react";
import { Tabs, Skeleton, Typography } from "antd";
import TableOrderSales from "./TableOrderSales";
import { orderSaleStates } from '../../../utils/const';

const { TabPane } = Tabs;
const { Text } = Typography;

const OrderSalesTabs = ({ orderSales, setModalVisible }) => {

  const [data, setData] = useState({ pending: [], unshipped: [], unshippedErrors: [], shipped: [], canceled: [], completed: [], refunded: [], });

  useEffect(() => {
    let currentData = { pending: [], unshipped: [], unshippedErrors: [], shipped: [], canceled: [], completed: [], refunded: [] };
    if (orderSales?.length > 0) {
      for (const order of orderSales) {
        if (order?.orderStatus) {
          if (order?.refunds) {
            currentData.refunded.push(order);
            continue;
          }

          switch (order?.orderStatus) {
            case orderSaleStates.PENDING:
              currentData.pending.push(order);
              break;
            case orderSaleStates.UNSHIPPED:
              order?.shipment?.canAutoFulfillmentOutbound ? currentData.unshipped.push(order) : currentData.unshippedErrors.push(order);
              break;
            case orderSaleStates.SHIPPED:
            case orderSaleStates.PARTIALLY_SHIPPED:
              order?.orderFulfillmentStatus === 'Completed' ? currentData.completed.push(order) : currentData.shipped.push(order);
              break;
            case orderSaleStates.CANCELED:
            case orderSaleStates.UNFULFILLABLE:
            case orderSaleStates.INVOICE_UNCONFIRMED:
            case orderSaleStates.PENDING_AVAILABILITY:
              currentData.canceled.push(order);
              break;
          }
        }
      }
    }
    setData(currentData);
  }, [orderSales])

  return <>
    <Tabs defaultActiveKey={orderSaleStates.COMPLETED} >
      <TabPane tab={`Pendientes de pago (${data?.pending?.length | 0})`} key={orderSaleStates.PENDING}>
        <TableOrderSales orderSales={data?.pending} setModalVisible={setModalVisible} />
      </TabPane>
      <TabPane tab={`Listo para envío automático (${data?.unshipped?.length | 0})`} key={orderSaleStates.UNSHIPPED}>
        <TableOrderSales orderSales={data?.unshipped} setModalVisible={setModalVisible} />
      </TabPane>
      <TabPane tab={`Listo para envío manual (${data?.unshippedErrors?.length | 0})`} key={'UnshippedErrors'}>
        <TableOrderSales orderSales={data?.unshippedErrors} setModalVisible={setModalVisible} />
      </TabPane>
      <TabPane tab={`En camino / enviado (${data?.shipped?.length | 0})`} key={orderSaleStates.SHIPPED}>
        <TableOrderSales orderSales={data?.shipped} setModalVisible={setModalVisible} />
      </TabPane>
      <TabPane tab={`Cancelado/ incompletable (${data?.canceled?.length | 0})`} key={orderSaleStates.CANCELED}>
        <TableOrderSales orderSales={data?.canceled} setModalVisible={setModalVisible} />
      </TabPane>
      <TabPane tab={`Completado (${data?.completed?.length | 0})`} key={orderSaleStates.COMPLETED}>
        <TableOrderSales orderSales={data?.completed} setModalVisible={setModalVisible} />
      </TabPane>
      <TabPane tab={`Reembolsado (${data?.refunded?.length | 0})`} key={orderSaleStates.REFUND}>
        <TableOrderSales orderSales={data?.refunded} setModalVisible={setModalVisible} hasRefunds={true} />
      </TabPane>
    </Tabs>
  </>
};

export default React.memo(OrderSalesTabs);
