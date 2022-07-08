import api from "./api";

const prefix = 'companies';

export default {
    findById: function (id) {
        return api.get(`${prefix}/${id}`);
    },
    findSellerAccountById: function (id) {
        return api.get(`${prefix}/${id}/sellerAccount`);
    },
    update: function (arrayOfObjects) {
        return api.put(`${prefix}`, arrayOfObjects);
    },
    updateSellerAccount: function (id, sellerAccount) {
        return api.put(`${prefix}/${id}/sellerAccount`, sellerAccount);
    },
};