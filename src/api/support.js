import api from "./api";

const prefix = 'supports';

export default {
    insert: function (arrayOfObjects) {
        return api.post(`${prefix}`, arrayOfObjects);
    },
    reply: function (arrayOfObjects) {
        return api.post(`${prefix}/reply`, arrayOfObjects);
    },
};