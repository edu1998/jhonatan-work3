import api from "./api";

const prefix = '/accessKeys';

export default {
    findByIdAndMarketplace: function (id, marketplace) {
        return api.get(`${prefix}/user/${id}/sellerMarketplace/${marketplace.toLowerCase()}`);
    },
    getMarketplaces: function (id, marketplace) {
        return api.get(`${prefix}/user/${id}/sellerMarketplaces`);
    },

    create: function (sellerAccount) {
        return api.post(`${prefix}`, sellerAccount);
    },
    update: function (id, sellerAccount) {
        return api.put(`${prefix}/user/${id}`, sellerAccount);
    },
    getConsentUrl: function (id, marketplace) {
        return api.get(`${prefix}/user/${id}/sellerMarketplace/${marketplace.toLowerCase()}/consentUrl`);
    },
    forgetCredentials: function (id, marketplace) {
        return api.delete(`${prefix}/user/${id}/sellerMarketplace/${marketplace.toLowerCase()}`);
    },
    saveCredentials: function (id, marketplace, payload) {
        return api.post(`${prefix}/user/${id}/sellerMarketplace/${marketplace.toLowerCase()}`, payload);
    },
    verifyCredentials: function (id, marketplace,payload) {
        return api.get(`${prefix}/user/${id}/sellerMarketplace/${marketplace.toLowerCase()}/verifycrendentials`, payload);
    },
};