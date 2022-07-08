import api from "./api";

const prefix = 'dashboard';

export default {
    search: function (filter) {
        return api.put(`${prefix}`, filter);
    },
    exportAnalytics: function (payload) {
        const config = { headers: { accept: '*/*' }, responseType: 'arraybuffer' };
        return api.post(`${prefix}/exportAnalytics`, payload, config);
    },
};