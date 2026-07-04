import { useDispatch } from "react-redux";
import {setUser,setError,setLoading} from '../state/auth.slice'
import {register,login} from '../services/auth.api'

export const useAuth = ()=>{
    const dispatch = useDispatch()
    //  console.log('register ',register);

    const handleRegister = async({fullName, email, contact, password, isSeller=false})=>{
        try{
           
            
            dispatch(setLoading(true))
            const data = await register({fullName,email,contact,password,isSeller})
        dispatch(setUser(data.user))
        }catch(err){
            dispatch(setError(err.message))
        }finally{
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async({email,password})=>{
        try{
            dispatch(setLoading(true))
            const data = await login({email,password})
            dispatch(setUser(data.user))

        }catch(err){
            dispatch(setError(err))
        }finally{
            dispatch(setLoading(false))
        }
    }

    return {handleRegister,handleLogin}
}