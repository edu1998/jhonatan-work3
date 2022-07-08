import api from "./api";

const prefix = 'industries';

export default {
    getAll: function () {
        return api.get(`${prefix}`);
    },
    findById: function (id) {
        return api.get(`${prefix}/${id}`);
    },
    insert: function (industry) {
        return api.post(`${prefix}`, industry);
    },
    update: function (industry) {
        return api.put(`${prefix}`, industry);
    },
    delete: function (industryId) {
        return api.delete(`${prefix}`, industryId);
    },
};