import api from "./api";

const prefix = 'fulfillmentInbound';

export default {
  findShipmentLabels: function (value) {
    return api.post(`${prefix}/labels/${value.marketplace}/${value.clientId}/${value.shippingId}`, value);
  },
};