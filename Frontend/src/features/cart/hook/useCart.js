import {addToCart,getCart,incrementCartItemApi} from '../services/cart.api'
import {setItems,addItem,setError,setLoading,incrementCartItem} from '../state/cart.state'
import { useDispatch } from 'react-redux'

export const useCart = ()=>{
    const dispatch = useDispatch()

    const handleAddToCartHook = async({productId,variantId})=>{
        dispatch(setLoading(true))
        try{
            
            const data = await addToCart({productId,variantId})
            dispatch(setItems(data.cart))
            // console.log('data ',data.cart);
            
            return data.cart

        }catch(err){
            dispatch(setError(err.response.data.message)) 
        }finally{
        dispatch(setLoading(false))
        }
    }

    const handleGetCart = async()=>{
        dispatch(setLoading(true))
        try{
            const data = await getCart()
            dispatch(setItems(data.cart))
            // console.log('data ',data.cart);
            
            return data.cart
        }catch(err){
            dispatch(setError(err.response.data.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleIncrementCartItem = async({productId,variantId})=>{
        dispatch(setLoading(true))
        try{
            await incrementCartItemApi({productId,variantId})
            // console.log('response data:', data)
            dispatch(incrementCartItem({productId,variantId}))
            // console.log('data',data)
             

        }catch(err){
             console.log('actual error:', err)
            dispatch(setError(err.response.data.message|| err.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {handleAddToCartHook,handleGetCart,handleIncrementCartItem}
}