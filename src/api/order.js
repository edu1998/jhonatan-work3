import api from "./api";

const prefix = "/orders";

export default {
  create: function () {
    return api.post(`${prefix}`);
  },
  getContent: function (orderId) {
    return api.get(`${prefix}/${orderId}/content`);
  },
  updateContent: function (orderId, data) {
    return api.put(`${prefix}/${orderId}/updateContent`, data);
  },
  sendContent: function (orderId, data) {
    return api.put(`${prefix}/${orderId}/sendContent`, data);
  },
  getBoxes: function (orderId) {
    return api.get(`${prefix}/${orderId}/boxes`);
  },
  updateBoxes: function (orderId, data) {
    return api.put(`${prefix}/${orderId}/updateOrderBoxes`, data);
  },
  sendBoxes: function (orderId, data) {
    return api.put(`${prefix}/${orderId}/sendOrderBoxes`, data);
  },
  acceptProposal: function (orderId) {
    return api.put(`${prefix}/${orderId}/acceptProposal`);
  },
  rejectProposal: function (orderId, data) {
    return api.put(`${prefix}/${orderId}/rejectProposal`, data);
  },
  getNotes: function (orderId) {
    return api.get(`${prefix}/${orderId}/notes`);
  },
  saveNote: function (orderIds, body) {
    return api.post(`${prefix}/${orderIds}/notes`, body);
  },
  getStatus: function (orderId) {
    return api.get(`${prefix}/${orderId}/status`);
  },
  changeState: function (orderIds, body) {
    return api.put(`${prefix}/${orderIds}/updateState`, body);
  },
  findAll: function (clientId) {
    return api.get(`${prefix}${clientId ? '?partnerId=' + clientId : ''}`);
  },
  getOrdersPerPage: function (values) {
    return api.get(`${prefix}/${values.partnerId}/ordersPerPage`, {params:values});
  },
  updateShippingData: function (orderIds, body) {
    return api.put(`${prefix}/${orderIds}/updateShippingData`, body);
  },
  updateShippingData: function (orderIds, body) {
    return api.put(`${prefix}/${orderIds}/updateShippingData`, body);
  },
  goBack: function (orderId, body) {
    return api.put(`${prefix}/${orderId}/goBack`, body);
  },
  getDocument: function (partnerId) {
    return api.get(`${prefix}/doc/${partnerId}`);
  },
  getExcelReport: function (values) {
    const config = { headers: { accept: '*/*' }, responseType: 'arraybuffer' };
    return api.post(`${prefix}/exportExcel`, values, config);
  },
  getExcelReportBoxes: function (values) {
    const config = { headers: { accept: '*/*' }, responseType: 'arraybuffer' };
    return api.post(`${prefix}/exportExcel/boxes`, values, config);
  },
  getDocuments: function (orderId) {
    return api.get(`${prefix}/${orderId}/documents`);
  },
  addDocument: function (orderId, document) {
    return api.post(`${prefix}/${orderId}/documents`, document);
  },
  deleteDocument: function (orderId, documentId) {
    return api.delete(`${prefix}/${orderId}/documents/${documentId}`);
  },
  createPlan: function (orderId) {
    return api.post(`${prefix}/${orderId}/shipmentPlan`);
  },
  createShipment: function (orderId) {
    return api.post(`${prefix}/${orderId}/shipment`);
  },
  getTransportDetails : function (orderId, shipmentId) {
    return api.get(`${prefix}/${orderId}/shipment/${shipmentId}/transportDetails`);
  },
  sendByFedEX: function (orderId) {
    return api.post(`/fedex/restock/order/${orderId}`);
  },
};
