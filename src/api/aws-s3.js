import api from "./api";

const prefix = '/aws-s3';

export default {
    deleteImageByKey: function (key) {
        return api.delete(`${prefix}/${key}`);
    },
    upload: function (imageData) {
        return api.post(`${prefix}`, imageData);
    },
    uploadOrderDocument: function (orderId, file) {
        var formData = new FormData();
        formData.append("file", file);
        return api.post(`${prefix}/orders/${orderId}/document`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
    },
    getOrderDocumentDownloadUrl: function (orderId, documentId, document) {
        return api.post(`${prefix}/orders/${orderId}/document/${documentId}`, document);
    },

};