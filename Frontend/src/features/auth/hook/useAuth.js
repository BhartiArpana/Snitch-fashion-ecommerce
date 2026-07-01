import { useDispatch } from "react-redux";
import {setUser,setError,setLoading} from '../state/auth.state'
import {register} from '../services/auth.api'

export const useAuth = ()=>{
    const dispatch = useDispatch()

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

    return {handleRegister}
}