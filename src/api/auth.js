import api from "./api";

const prefix = 'auth';

export default {
    login: function (credentials) {
        return api.post(`${prefix}/token`, credentials);
    },
    resetPassword: function (userId, passwords) {
        return api.put(`${prefix}/${userId}/resetPassword`, passwords);
    },
    sendRecoveryEmail: function (email) {
        return api.post(`${prefix}/sendRecoverEmail`, email);
    },
    logout: function () {
        return api.get(`${prefix}/logout`);
    }
};