import {addToCart} from '../services/cart.api'
import {setItems,addItem,setError,setLoading} from '../state/cart.state'
import { useDispatch } from 'react-redux'

export const useCart = ()=>{
    const dispatch = useDispatch()

    const handleAddToCartHook = async({productId,variantId})=>{
        dispatch(setLoading(true))
        try{
            
            const data = await addToCart({productId,variantId})
            // dispatch(setItems(data))
            return data

        }catch(err){
            dispatch(setError(err.response.data.message)) 
        }finally{
        dispatch(setLoading(false))
        }
    }
    return {handleAddToCartHook}
}