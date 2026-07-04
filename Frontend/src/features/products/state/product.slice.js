import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const productSlice = createSlice({
    name:'products',
    initialState:{
        sellerProducts:[],
        error:null,
        loading:false
    },
    reducers:{
        setSellerProducts(state,action){
            state.sellerProducts = action.payload
        },
        setError(state,action){
            state.error = action.payload
        },
        setLoading(state,action){
            state.loading = action.payload
        }
    }
})

export default productSlice.reducer
export const {setSellerProducts,setError,setLoading} = productSlice.actions