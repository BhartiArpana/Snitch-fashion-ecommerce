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

export const getAllProducts= async()=>{
    const response = await productInstanceApi.get('/allProducts')
    return response.data
}

export const getProductDetails = async(productId)=>{
    const response = await productInstanceApi.get(`/product/${productId}`)
    return response.data
}

export const addProductVariant = async(productId,newProductVariant)=>{
    const formData = new FormData()
    formData.append('stock', newProductVariant.stock)
    formData.append('priceAmount', newProductVariant.price.amount)
    formData.append('currency', newProductVariant.price.currency)
    formData.append('attributes', JSON.stringify(newProductVariant.attributes))

    // Append every selected image file under the key 'images'
    // (multer.array('images', 7) on the backend will parse these)
    if (Array.isArray(newProductVariant.images)) {
        newProductVariant.images.forEach((file) => {
            formData.append('images', file)
        })
    }

    const response = await productInstanceApi.post(`/${productId}/variants`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
}