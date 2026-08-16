import { addToCart, getCart, incrementCartItemApi, decrementCartItemApi, removeCartItem, createOrder, verifyPayment, createBuyNowOrder } from '../services/cart.api'
import { setItems, addItem, setError, setLoading, incrementCartItem, decrementCartItem, removeItem } from '../state/cart.state'
import { useDispatch } from 'react-redux'

export const useCart = () => {
    const dispatch = useDispatch()

    const handleAddToCartHook = async ({ productId, variantId }) => {
        dispatch(setLoading(true))
        try {

            const data = await addToCart({ productId, variantId })
            dispatch(setItems(data.cart))
            // console.log('data ',data.cart);

            return data.cart

        } catch (err) {
            dispatch(setError(err.response.data.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetCart = async () => {
        dispatch(setLoading(true))
        try {
            const data = await getCart()
            dispatch(setItems(data.cart))
            // console.log('data ',data.cart);

            return data.cart
        } catch (err) {
            dispatch(setError(err.response.data.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleIncrementCartItem = async ({ productId, variantId }) => {
        dispatch(setLoading(true))
        try {
            await incrementCartItemApi({ productId, variantId })
            // console.log('response data:', data)
            dispatch(incrementCartItem({ productId, variantId }))
            // console.log('data',data)


        } catch (err) {
            console.log('actual error:', err)
            dispatch(setError(err.response.data.message || err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleDecrementCartItem = async ({ productId, variantId }) => {
        dispatch(setLoading(true))
        try {
            await decrementCartItemApi({ productId, variantId })
            // console.log('response data:', data)
            dispatch(decrementCartItem({ productId, variantId }))
            // console.log('data',data)


        } catch (err) {
            console.log('actual error:', err)
            dispatch(setError(err.response.data.message || err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleRemoveCartItem = async ({ productId, variantId }) => {
        dispatch(setLoading(true))
        try {
            const data = await removeCartItem({ productId, variantId })
            dispatch(removeItem({ productId, variantId }))
            return data
        } catch (err) {
            dispatch(setError(err.response.data.message || err.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleCreateOrder = async ({addressId}) => {
        dispatch(setLoading(true))
        try {
            const data = await createOrder({addressId})
            return data.order
        } catch (err) {
            dispatch(setError(err.response.data.message || err.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleVerifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
        dispatch(setLoading(true))
        try {
            const data = await verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
            return data.success
        } catch (err) {
            dispatch(setError(err.response.data.message || err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleCreateBuyNowOrder = async ({addressId,quantity,productId,variantId }) => {
        dispatch(setLoading(true))
        try {
            const data = await createBuyNowOrder({addressId,quantity,productId,variantId })
            return data.order
        } catch (err) {
            dispatch(setError(err.response.data.message || err.message))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { handleAddToCartHook, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleRemoveCartItem, handleCreateOrder, handleVerifyPayment,handleCreateBuyNowOrder }
}