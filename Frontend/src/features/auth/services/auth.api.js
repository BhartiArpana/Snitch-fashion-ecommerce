import axios from 'axios'

const authApiInstance = axios.create({
    baseURL:'/api/auth',
    withCredentials:true
})

export const register = async({fullname,email, contact,password,isSeller})=>{
  try{
     const response = await authApiInstance.post('/register',{fullname,email,contact,password,isSeller})
//    console.log(response);
     return response.data
  }catch(err){
      throw err.response?.data?.message || 'Something went wrong'
  }
}

export const login = async({email,password})=>{
   try{
     const response = await authApiInstance.post('/login',{email,password})
    return response.data
   }catch(err){
       throw err.response?.data?.message || 'Something went wrong'
   }
}

export const getMe = async()=>{
  try{
      const response = await authApiInstance.get('/me')
      return response.data
  }catch(err){
      console.log(err);
      
  }
}