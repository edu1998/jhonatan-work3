import api from "./api";

const prefix = 'marketplaces';

export default {
    findAll: function () {
        return api.get(`${prefix}`);
    },
};