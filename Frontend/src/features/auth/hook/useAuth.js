import { useDispatch } from "react-redux";
import {setUser,setError,setLoading} from '../state/auth.slice'
import {register,login,getMe,addAddress} from '../services/auth.api'

export const useAuth = ()=>{
    const dispatch = useDispatch()
    //  console.log('register ',register);

    const handleRegister = async({fullName, email, contact, password, isSeller=false})=>{
        try{
           
            
            dispatch(setLoading(true))
            const data = await register({fullName,email,contact,password,isSeller})
        dispatch(setUser(data.user))
        return data.user
        }catch(err){
            dispatch(setError(err.response.data.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async({email,password})=>{
        try{
            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch(setUser(data.user))
            // console.log('data ',data.user);
            
            return data.user
            
            
        }catch(err){
            dispatch(setError(err.response.data.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleGetMe = async()=>{
        try{
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
            

        }catch(err){
             dispatch(setError(err?.response?.data?.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleAddAddress = async({form})=>{
         dispatch(setLoading(true))
         try{
            const data = await addAddress({form})
           
         }catch(err){
            dispatch(setError(err?.response?.data?.message))
         }finally{
            dispatch(setLoading(false))
         }
    }

    

    return {handleRegister,handleLogin,handleGetMe,handleAddAddress};
}