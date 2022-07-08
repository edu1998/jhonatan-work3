import api from "./api";

const prefix = '/listings';

export default {
    getFeedSandbox: function () {
        return api.get(`${prefix}/feedsandbox`);
    },
    insertFeedSandbox: function () {
        return api.post(`${prefix}`);
    },
};