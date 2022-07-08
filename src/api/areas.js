import api from "./api";

const prefix = 'areas';

export default {
    getAll: function () {
        return api.get(`${prefix}`);
    }
};