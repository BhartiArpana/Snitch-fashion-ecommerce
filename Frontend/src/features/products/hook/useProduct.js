import { useDispatch } from 'react-redux'
import {createProduct,getSellerProducts,getAllProducts,getProductDetails,addProductVariants} from '../services/product.api'
import {setError,setLoading,setSellerProducts,setProducts,setProductDetails} from '../state/product.slice'

export const useProduct = ()=>{
    const dispatch = useDispatch()

    const handleCreateProduct = async(formData)=>{
       try{
        dispatch(setLoading(true))
        const data = await createProduct(formData)
        console.log('data ',data.products)
        return data.products
       }catch(err){
        dispatch(setError(err.response.data.message))
       }finally{
        dispatch(setLoading(false))
       }
    }

    const handleGetSellerProducts = async()=>{
        try{
           dispatch(setLoading(true))
           const data = await getSellerProducts()
           dispatch(setSellerProducts(data.products))
           return data.products
        }catch(err){
            dispatch(setError(err.response.data.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleAllProducts = async()=>{
       try{
        dispatch(setLoading(true))
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
        // console.log('data',data.products);
        
       }catch(err){
        dispatch(setError(err.response.data.message))
       }finally{
        dispatch(setLoading(false))
       }
    }

    const handleGetProductDetails = async(id)=>{
        try{
            dispatch(setLoading(true))
            const data = await getProductDetails(id)
            dispatch(setProductDetails(data.product))

        }catch(err){
            dispatch(setError(err))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleAddProductVariants = async({id,variantPayload})=>{
        try{
            dispatch(setLoading(true))
            const data = await addProductVariants({id,variantPayload})
            return data
        }catch(err){
            dispatch(setError(err))
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {handleCreateProduct,handleGetSellerProducts,handleAllProducts,
        handleGetProductDetails,handleAddProductVariants
    }
}