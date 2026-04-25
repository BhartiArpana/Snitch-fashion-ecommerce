import {createSlice} from '@reduxjs/toolkit'


const productSlice = createSlice({
    name:'product',
    initialState:{
        sellerProducts : [],
        product :[]
    },
    reducers:{
        setSellerProducts:(state,actions)=>{
            state.sellerProducts = actions.payload
        },
        setAllproducts:(state,actions)=>{
          state.product = actions.payload
        }
    }
})

export const {setSellerProducts,setAllproducts} = productSlice.actions
export default productSlice.reducer