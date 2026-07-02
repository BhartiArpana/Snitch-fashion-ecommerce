import axios from "axios";

const authApiInstance = axios.create({
    baseURL:'/api/auth',
    withCredentials:true
})

export const register = async({email,fullName,contact,password,isSeller})=>{
      const response = await authApiInstance.post('/register',{
        fullName,
        email,
        contact,
        password,
        isSeller
      })
      return response.data
}

export const login =async({email,password})=>{
    try{
        const response = await authApiInstance.post('/login',{
            email,
            password
        })
        return response.data
    }catch(err){
        console.log(err);
        
    }
}