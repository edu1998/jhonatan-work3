import api from "./api";

const prefix = 'countries';

export default {
    getAll: function () {
        return api.get(`${prefix}`);
    },
    findById: function (id) {
        return api.get(`${prefix}/${id}`);
    },
    insert: function (country) {
        return api.post(`${prefix}`, country);
    },
    update: function (country) {
        return api.put(`${prefix}`, country);
    },
    delete: function (countryId) {
        return api.delete(`${prefix}`, countryId);
    },
};