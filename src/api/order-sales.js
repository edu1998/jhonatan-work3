import api from "./api";

const prefix = "/orders-sales";

export default {
  getByFilter: function (values) {
    return api.put(`${prefix}/filters`, values);
  },
  
  getHistorical: function (partnerId) {
    return api.get(`${prefix}/partner/${partnerId}/historical`);
  },

  getHistoricalByAllPartners: function () {
    return api.get(`${prefix}/partners/historical`);
  },

  cancelSyncOrders: function (partnerId) {
    return api.delete(`${prefix}/partner/${partnerId}/historical`);
  },

  getHistoricalSyncStatus: function (partnerId) {
    return api.get(`${prefix}/partner/${partnerId}/historical/status`);
  },

  saveSaleOrder: function (values) {
    return api.post(`${prefix}`, values);
  },

  saveFulfillmentOutbound: function (values) {
    return api.post(`${prefix}/fulfillmentOutbound`, values);
  },

  updateFBAFulfillmentOutbound: function (values) {
    return api.put(`${prefix}/fulfillmentOutbound/FBA/${values?.shipment?.sellerFulfillmentOrderId}`, values);
  },

  cancelFBAFulfillmentOutbound: function (values) {
    return api.put(`${prefix}/fulfillmentOutbound/FBA/${values?.shipment?.sellerFulfillmentOrderId}/cancel`, values);
  },
  
  getCancellationReason: function (mkt) {
    return api.get(`${prefix}/marketplace/${mkt}/cancellationReason`);
  },

  updateSaleOrder: function (id, values) {
    return api.put(`${prefix}/${id}`, values);
  },

  getSaleOrder: function (id) {
    return api.get(`${prefix}/${id}`);
  },

  getShipmentServices: function (values) {
    return api.put(`${prefix}/shipmentServices`, values);
  },

  getByOrderId: function (values) {
    return api.get(`${prefix}/${values?.orderId}/partner/${values?.partnerId}/marketplace/${values?.marketplace}`);
  },

  getSenderAddressByMarketplace: function (values) {
    return api.get(`${prefix}/${values?.orderId}/addresses/partner/${values?.partnerId}/marketplace/${values?.marketplace}`);
  },

  getStateOrProvinceCode: function (countryCode) {
    return api.get(`${prefix}/stateOrProvinceCode/country/${countryCode}`);
  },

  createSenderAddress: function (address) {
    return api.post(`${prefix}/senderAddress`, address);
  },

  updateSenderAddress: function (address) {
    return api.put(`${prefix}/senderAddress/${address?.id}`, address);
  },

  deleteSenderAddress: function (address) {
    return api.delete(`${prefix}/senderAddress/${address?.id}`);
  },

  getShipment: function (product) {
    return {
      id: "1668 - 1",
      date: product?.date,
      status: product?.status,
      carrier: "FedEx",
      trackingNumber: null,
      fulfillment: product?.fulfillment,
      channel: product?.channel,
    }
    //return api.get(`${prefix}/shipment/${id}`);
  },
  saveContent: function (values) {
    return api.post(`${prefix}/saveContent`, values);
  },
  sendOrder: function (values) {
    return api.post(`${prefix}/sendOrderSale`, values);
  },
  saveShipmentOptions: function (values) {
    return api.post(`${prefix}/saveShipmentOptions`, values);
  },
  changeShipmentState: function (state) {
    return api.post(`${prefix}/changeShippmentState`, state)
  },
  printPackagingSlip: function (values) {
    return api.post(`${prefix}/printPackagingSlip`, values);
  },
  getExcelReport: function (values) {
    const config = { headers: { accept: '*/*' }, responseType: 'arraybuffer' };
    return api.post(`${prefix}/exportExcel`, values, config);
  },
};
