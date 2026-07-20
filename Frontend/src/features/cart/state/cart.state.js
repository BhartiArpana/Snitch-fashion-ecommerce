import { createSlice } from "@reduxjs/toolkit";


export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        error: null,
        loading: false
    },
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },

        incrementCartItem: (state, action) => {

            const { productId, variantId } = action.payload
            state.items.items = state.items.items.map(item => {
                if (item.product._id == productId && item.variants == variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                else {
                    return item
                }
            })


        },
        decrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload
            state.items.items = state.items.items.map(item => {
                if (item.product._id == productId && item.variants == variantId) {
                    return { ...item, quantity: item.quantity - 1 }
                }
                else {
                    return item
                }
            })
        },
        removeItem: (state, action) => {
            const { productId, variantId } = action.payload;
            //   console.log('current items:', state.items.items)
            //   console.log('looking for:', productId, variantId)
            state.items.items = state.items.items.filter((item) => {
                // console.log('comparing:', item.product._id, item.variants)
                const isMatch = item.product._id == productId && item.variants == variantId;
                return !isMatch;
            });
        }

    }

})

export const { setItems, addItem, setError, setLoading, incrementCartItem, decrementCartItem, removeItem } = cartSlice.actions
export default cartSlice.reducer
