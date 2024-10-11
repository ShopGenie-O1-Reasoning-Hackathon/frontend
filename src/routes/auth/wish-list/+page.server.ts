import apiService from "$lib/apiService.js";
// @ts-nocheck

export const load = async ({ locals: { supabase }, params, fetch }) => {
    async function getProducts() {
        let userId = (await supabase.auth.getUser()).data.user!.id
        const ret = await apiService.getPython(`cart/${userId}`);

        if (ret) {
            // console.log(ret)
            const products = ret.products
            const recommendations = ret.similars

            // console.log(ret["productIds"])
            // console.log(recommendations)

            console.log(products)
            console.log(recommendations)

            if(products && recommendations){
                
                return {
                    products: products,
                    recommendations: recommendations
                }
            }
            return {
                products: [],
                recommendations: []
            }
        }

        return {
            products: [],
            recommendations: []
        }
    }

    return {
        productList: getProducts()
    }
}