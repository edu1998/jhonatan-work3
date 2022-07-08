import api from "./api";

const prefix = "/listings";

export default {
  getAll: function () {
    return api.get(`${prefix}`);
  },

  getDocument: function (partnerId) {
    return api.get(`${prefix}/doc/${partnerId}`);
  },

  test: function (partnerId) {
    return api.get(`${prefix}/partner/${partnerId}/mkt/amazon`);
  },

  getAllFromMkts: function (partnerId) {
    return api.get(`${prefix}/partner/${partnerId}/sync`);
  },

  getSyncStatus: function (partnerId) {
    return api.get(`${prefix}/partner/${partnerId}/sync/status`);
  },

  cancelSyncListings: function (partnerId) {
    return api.delete(`${prefix}/partner/${partnerId}/sync`);
  },

  getFromMkt: function (partnerId, marketplace) {
    return api.get(`${prefix}/partner/${partnerId}/marketplace/${marketplace}/sync`);
  },

  checkCreateListings: function (partnerId, marketplace, listing, productType) {
    return api.put(`${prefix}/partner/${partnerId}/marketplace/${marketplace}/productType/${productType}/check`, listing);
  },

  createListing: function (partnerId, marketplace, listing) {
    return api.post(`${prefix}/partner/${partnerId}/marketplace/${marketplace}`, listing);
  },
  
  syncFbaStock: function (payload) {
    return api.put(`${prefix}/fba/syncStock`, payload);
  },
  
  syncFbmStock: function (payload) {
    return api.put(`${prefix}/fbm/syncStock`, payload);
  },
  
  unlinkMatchesFBA: function (payload) {
    return api.put(`${prefix}/fba/unlinkMatches`, payload);
  },
};
