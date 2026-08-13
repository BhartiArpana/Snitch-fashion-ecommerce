import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name:'wishlist',
    initialState:{
        wishlist:[],
        loading:true,
        error:null
    },
    reducers:{
        setWishlist:(state,action)=>{
            state.wishlist = action.payload
        },
        setLoading:(state,action)=>{
            state.loading = action.payload
        },
        setError:(state,action)=>{
            state.error = action.payload
        }
    }
})

export default wishlistSlice.reducer
export const {setWishlist,setLoading,setError} = wishlistSlice.actions