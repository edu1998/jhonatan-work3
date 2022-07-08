import api from "./api";

const prefix = 'workers';

export default {
    skipTaskForThread: function (i) {
        return api.post(`${prefix}/queues/${i}/skip`);
    },
    skipTasks: function () {
        return api.post(`${prefix}/queues/skip`);
    },
    clearTaskForThread: function (i) {
        return api.delete(`${prefix}/${i}/queue`);
    },
    clearTasks: function () {
        return api.delete(`${prefix}/queues`);
    },

    getServerStatus: function () {
        return api.get(`${prefix}/status`);
    },
    testSync: function () {
        return api.get(`/listings/sync/test`);
    }

};