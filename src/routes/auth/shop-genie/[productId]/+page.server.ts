import apiService from "$lib/apiService.js";
// import mockReviews from '$lib/data/mockReviews.json';

export const load = async ({ locals: { supabase }, params, fetch }) => {
    async function getProduct() {
        let productId = params.productId;
        const ret = await apiService.getPython(`product_retrieve/${productId}`)
        return ret;
    }

    async function isFavorite() {
        let productId = params.productId;
        let userId = (await supabase.auth.getUser()).data.user!.id
        let payload = { productId: productId, userId: userId };

        const ret = await apiService.postPython(`cart/check`, payload);
        return ret;
    }

    async function getReviews() {
        let productId = params.productId;
        const ret = await apiService.getPython(`reviews/get-reviews/${productId}`)
        return ret;
    }

    return {
        productData: getProduct(),
        isFavorite: isFavorite(),
        reviewList: getReviews()
    }
};
