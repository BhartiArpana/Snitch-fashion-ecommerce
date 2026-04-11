import {setUser,setLoading,setError} from '../state/auth.slice'
import {register} from '../services/auth.api'
import useDispatch from '@reduxjs/toolkit'

export const useAuth = ()=>{
    const dispatch = useDispatch()
   async function handleRegister({fullname,email,contact,password,isSeller:flase}){
     const data = register({fullname,email, contact, password,isSeller})

    dispatch(setUser(data.user))
   }

   return {
    handleRegister
   }
}