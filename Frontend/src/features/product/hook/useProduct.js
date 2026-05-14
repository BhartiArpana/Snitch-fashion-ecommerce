import {createProduct,getAllProducts,getProductDetails,getSellerProduct,addProductVariant} from '../services/product.api'
import {useDispatch} from 'react-redux'
import { setAllproducts, setSellerProducts } from '../state/product.slice'

export function useProduct(){
    const dispatch = useDispatch()

    const handleCreateProduct = async(formData)=>{
        const data = await createProduct(formData)
        return data.product
    }
    const handleGetSellerProduct = async()=>{
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.product))
        return data.product
    }
    const handleAllProducts = async()=>{
        const data = await getAllProducts()
        dispatch(setAllproducts(data.products))
    }
    const handleGetProductById= async(productId)=>{
       const data = await getProductDetails(productId)
       return data.product 
    }

    const handleAddProductVariant = async(productId,newProductVariant)=>{
        const data = await addProductVariant(productId,newProductVariant)
        return data
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleAllProducts,
        handleGetProductById,
        handleAddProductVariant
    }
}

