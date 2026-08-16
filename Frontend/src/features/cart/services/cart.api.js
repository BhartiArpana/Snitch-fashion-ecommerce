import axios from "axios";

const cartApiInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL+'/api/cart',
    withCredentials:true
})

export const addToCart =async ({productId,variantId})=>{
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`)
    return response.data
}

export const getCart = async()=>{
    const response = await cartApiInstance.get('/')
    return response.data
}

export const incrementCartItemApi = async({productId,variantId})=>{
    const response = await cartApiInstance.patch(`/product/increment/${productId}/${variantId}`)
    return response.data
}

export const decrementCartItemApi = async({productId,variantId})=>{
    const response = await cartApiInstance.patch(`/product/decrement/${productId}/${variantId}`)
    return response.data
}

export const removeCartItem = async({productId,variantId})=>{
    const response = await cartApiInstance.delete(`/product/remove/${productId}/${variantId}`)
    return response.data
}

export const createOrder = async({addressId})=>{
   const response = await cartApiInstance.post('/payment/create/order',{addressId})
   return response.data
}

export const verifyPayment = async({razorpay_order_id,razorpay_payment_id,razorpay_signature})=>{
    const response = await cartApiInstance.post('/payment/verify/order',{razorpay_order_id,razorpay_payment_id,razorpay_signature})
    return response.data
}

export const createBuyNowOrder = async({productId,variantId,quantity,addressId})=>{
    const response = await cartApiInstance.post(`/payment/buynow/${productId}/${variantId}`,{
        quantity,
        addressId
    })
    return response.data
}
