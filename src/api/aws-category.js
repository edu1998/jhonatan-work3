import api from "./api";
import partner from "./partner";

const prefix = '/categories';

export default {
    getAll: function () {
        return api.get(`${prefix}`);
    },
    getByMarketplaceAndSearch: function (marketplace, name, listingId) {
        return api.get(`${prefix}/marketplace/${marketplace}/suggestions/${name}`, {params:{listingId:listingId}});
    },
    getProductTypeDefinition: function (partnerId, marketplace, value) {
        return api.get(`${prefix}/partner/${partnerId}/marketplace/${marketplace}/productType/${value}/definition`);
    },
    getAttributesByMarketplace: function (partnerId, marketplace, value) {
        return api.get(`${prefix}/partner/${partnerId}/marketplace/${marketplace}/category/${value}/attributes`);
    },
    updateByMarketplace: function (partnerId, marketplace) {
        return api.put(`${prefix}/partner/${partnerId}/marketplace/${marketplace}`);
    },
};