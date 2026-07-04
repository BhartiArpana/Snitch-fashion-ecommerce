import axios from "axios";

const productApiInstance = axios.create({
    baseURL:'/api/products',
    withCredentials:true
})

export async function createProduct(formData){
  try{
    const response = await productApiInstance.post('/',formData)
   
    return response.data
}catch(err){
    console.log(err);
    
  }
}

export async function getSellerProducts(){
    try{
      const response = await productApiInstance.get('/seller')
    
      
      return response.data
      
    }catch(err){
        console.log(err);
        
    }
}