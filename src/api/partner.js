import api from "./api";

const prefix = 'partners';

export default {
    getAll: function () {
        return api.get(`${prefix}`);
    },
    findAllForAdmin: function () {
        return api.get(`${prefix}/findAllForAdmin`);
    },
    findById: function (id) {
        return api.get(`${prefix}/${id}`);
    },
    findByIdPartner: function (id) {
        return api.get(`${prefix}/${id}/partner`);
    },
    findLogoById: function (id) {
        return api.get(`${prefix}/${id}/image_1920`);
    },
    insert: function (partner) {
        return api.post(`${prefix}`, partner);
    },
    update: function (partner) {
        return api.put(`${prefix}`, partner);
    },
    updateWebsite: function (partner) {
        return api.put(`${prefix}/partner/website`, partner);
    },
    delete: function (partnerId) {
        return api.delete(`${prefix}`, partnerId);
    },
    getAllListings: function (partnerId) {
        return api.get(`${prefix}/${partnerId}/tableListings`);
    },
    getListingsPerPage: function (values) {
        return api.get(`${prefix}/${values.partnerId}/listingsPerPage`, { params: values });
    },
    getAllProductsByPartner: function (partnerId) {
        return api.get(`${prefix}/${partnerId}/onlyProducts`);
    },
    updateCanPublish: function (values) {
        return api.put(`${prefix}/${values.partnerId}/canPublish/${values.canPublish}`);
    },
    updateHasAutofulfillmentOutboundFBA: function (values) {
        return api.put(`${prefix}/${values.partnerId}/marketplace/${values.marketplace}/hasAutofulfillmentOutboundFBA/${values.canAutofulfillmentFBA}`);
    },
    insertListing: function (partnerId, listing) {
        return api.post(`${prefix}/${partnerId}/listings`, listing);
    },
    insertListingOrderProposal: function (partner, partnerId, listingId) {
        return api.post(`${prefix}/${partnerId}/listings/${listingId}/orderProposal`, partner);
    },
    insertListingOrderDraft: function (partner, partnerId, listingId) {
        return api.post(`${prefix}/${partnerId}/listings/${listingId}/orderDraft`, partner);
    },
    getListingImagesProposal: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/imagesProposal`);
    },
    createListingImagesProposal: function (partnerId, listingId, listImages) {
        return api.post(`${prefix}/${partnerId}/listings/${listingId}/imagesProposal`, listImages);
    },
    getAllDocuments: function (partnerId) {
        return api.get(`${prefix}/${partnerId}/documents`);
    },
    getSteps: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/steps`);
    },
    getPrices: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/prices`);
    },
    getCompetitorDocument: function (partnerId, listingId, clientId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/competitorDocument/${clientId}`);
    },
    updatePrices: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/prices`, data);
    },
    getOrder: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/order`);
    },
    sendPrices: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/sendPrice`, data);
    },
    acceptProposal: function (partnerId, listingId, step) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/acceptProposal`, step);
    },
    rejectProposal: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/rejectProposal`, data);
    },
    deleteListing: function (partnerId, listingId) {
        return api.delete(`${prefix}/${partnerId}/listings/${listingId}`);
    },
    revertListing: function (partnerId, listingId, data) {
        return api.post(`${prefix}/${partnerId}/listings/${listingId}/revert`, data);
    },
    updateOrder: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/order`, data);
    },
    sendOrder: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/sendOrder`, data);
    },
    updateProperty: function (partnerId, listingId, marketplace, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/${marketplace}/updateProperty`, data);
    },
    getFulfillment: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/fulfillment`);
    },
    updateFulfillment: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/fulfillment`, data);
    },
    sendFulfillment: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/sendFulfillment`, data);
    },
    getMeasures: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/measures`);
    },
    updateMeasures: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/measures`, data);
    },
    sendMeasures: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/sendMeasures`, data);
    },
    getImages: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/images`);
    },
    updateImages: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/images`, data);
    },
    addImage: function (partnerId, listingId, data) {
        return api.post(`${prefix}/${partnerId}/listings/${listingId}/images`, data);
    },
    removeImage: function (partnerId, listingId, data) {
        return api.delete(`${prefix}/${partnerId}/listings/${listingId}/images`, { data: data });
    },
    sendImages: function (partnerId, listingId, data) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/sendImages`, data);
    },
    getDraft: function (partnerId, listingId) {
        return api.get(`${prefix}/${partnerId}/listings/${listingId}/getDraft`);
    },
    approveListing: function (partnerId, listingId) {
        return api.put(`${prefix}/${partnerId}/listings/${listingId}/approveListing`);
    },
    exportListing: function (partnerId, listingId, marketplace) {
        const config = { headers: { accept: '*/*' }, responseType: 'arraybuffer' };
        return api.post(`${prefix}/${partnerId}/listings/${listingId}/marketplace/${marketplace}/exportListing`, {}, config);
    },
    listingsAndProducts: function (partnerId, onlyAmazon) {
        return api.get(`${prefix}/${partnerId}/listingsAndProducts/${onlyAmazon}`);
    },
    productsWithInventoryAtOriginFba: function (partnerId, marketplace) {
        return api.get(`${prefix}/${partnerId}/products/marketplace/${marketplace}/inventoryAtOriginFba`);
    },
    updateFbaSkuByProduct: function (partnerId, productId, fbaSku) {
        return api.put(`${prefix}/${partnerId}/products/${productId}/fbaSku/${fbaSku}`);
    },
    deleteFbaSkuByProduct: function (partnerId, productId) {
        return api.delete(`${prefix}/${partnerId}/products/${productId}/fbaSku`);
    },
    migrateListings: function (partnerId, marketplace, data) {
        return api.put(`${prefix}/${partnerId}/listings/${marketplace}/migrateListings`, data);
    },
    policiesByPartnerAndMarketplace: function (partnerId, marketplace) {
        return api.get(`${prefix}/${partnerId}/marketplace/${marketplace}/policiesSatate`);
    },
};