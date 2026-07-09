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
        // console.log('response',response.data);
        
        return response.data
    }catch(err){
        console.log(err);
        
    }
}

export const getMe = async()=>{
    const response = await authApiInstance.get('/get-me')
    return response.data
}