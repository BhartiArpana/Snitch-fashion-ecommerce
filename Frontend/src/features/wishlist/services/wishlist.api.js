import axios from "axios";

const wishlistApiInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL+'/api/wishlist',
    withCredentials:true
})

export const addToWishlist = async({productId,variantId})=>{
     const response = await wishlistApiInstance.post(`/${productId}/${variantId}`)
     return response.data
}

export const getWishlist = async()=>{
    const response = await wishlistApiInstance.get('/')
    return response.data
}

export const removeWishlist = async({productId,variantId})=>{
    const response = await wishlistApiInstance.delete(`/remove/${productId}/${variantId}`)
    return response.data
}