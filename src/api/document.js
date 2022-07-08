import api from "./api";

const prefix = 'documents';

export default {
    findById: function (id) {
        return api.get(`${prefix}/${id}`);
    },
    insert: function (object) {
        return api.post(`${prefix}`, object);
    },
    update: function (object) {
        return api.put(`${prefix}`, object);
    },
    pin: function (idToPin) {
        return api.put(`${prefix}/${idToPin}/pin`);
    },
    delete: function (id) {
        return api.delete(`${prefix}/${id}`);
    },
};