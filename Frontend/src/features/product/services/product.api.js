import axios from 'axios'

const productInstanceApi = axios.create({
    baseURL:'/api/products',
    withCredentials:true
})

export const createProduct = async(formData)=>{
    const response = await productInstanceApi.post('/',formData)
    return response.data
}
export const getSellerProduct = async()=>{
    const response = await productInstanceApi.get('/seller')
    return response.data
}