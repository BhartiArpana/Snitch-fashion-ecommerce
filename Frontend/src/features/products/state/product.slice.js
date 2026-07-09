import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const productSlice = createSlice({
    name:'products',
    initialState:{
        sellerProducts:[],
        error:null,
        loading:false,
        products:[],
        productDeatails:null
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
        },
        setProducts(state,action){
            state.products = action.payload
        },
        setProductDetails(state,action){
            state.productDeatails = action.payload
        }
    }
})

export default productSlice.reducer
export const {setSellerProducts,setError,setLoading,setProducts,setProductDetails} = productSlice.actions