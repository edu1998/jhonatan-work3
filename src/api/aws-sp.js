import api from "./api";

const prefix = '/sp';

export default {
    login: function (credentials) {
        return api.post(`${prefix}/init`, credentials);
    },
};