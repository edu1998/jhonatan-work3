import api from "./api";

const prefix = 'orderDocuments';

export default {
    findAll: function () {
        return api.get(`${prefix}`);
    },
    create: function (body) {
        return api.post(`${prefix}`, body);
    },
    update: function (documentId, body) {
        return api.put(`${prefix}/${documentId}`, body);
    },
    delete: function (documentId) {
        return api.delete(`${prefix}/${documentId}`);
    },
};