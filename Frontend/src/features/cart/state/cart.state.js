import { createSlice } from "@reduxjs/toolkit";


export const cartSlice = createSlice({
    name:'cart',
    initialState:{
        items:[],
        error:null,
        loading:false
    },
    reducers:{
        setItems:(state,action)=>{
            state.items = action.payload
        },
        addItem:(state,action)=>{
            state.items.push(action.payload)
        },
        setError:(state,action)=>{
            state.error = action.payload
        },
        setLoading:(state,action)=>{
            state.loading = action.payload
        }
    }

})

export const {setItems,addItem,setError,setLoading} = cartSlice.actions
export default cartSlice.reducer
