import {setWishlist,setLoading,setError} from '../state/wishlist.slice'
import {addToWishlist,getWishlist,removeWishlist} from '../services/wishlist.api'
import { useDispatch } from 'react-redux'

export const useWishlist = ()=>{
    const dispatch = useDispatch()

    const handleAddToWishlist = async({productId,variantId})=>{
        dispatch(setLoading(true))
        try{
            const data = await addToWishlist({productId,variantId})
            dispatch(setWishlist(data.wishlist))
        }catch(err){
            dispatch(setError(err.response.data.mesaage))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleGetWishlist = async()=>{
        dispatch(setLoading(true))
        try{
            const data = await getWishlist()
            dispatch(setWishlist(data.wishlist))
        }catch(err){
            dispatch(setError(err.response.data.mesaage))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleRemoveWishlist = async({productId,variantId})=>{
        dispatch(setLoading(true))
        try{
            const data = await removeWishlist({productId,variantId})
            dispatch(setWishlist(data.wishlist))

        }catch(err){
            dispatch(setError(err.response.data.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {handleAddToWishlist,handleGetWishlist,handleRemoveWishlist}
}
