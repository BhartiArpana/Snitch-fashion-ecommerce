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

export async function getAllProducts(){
  const response = await productApiInstance.get('/')
  return response.data
}

export async function getProductDetails(id){
  const response = await productApiInstance.get(`/${id}`)
  return response.data
}

export async function addProductVariants({id,variantPayload}){
  const formData =new FormData()
  console.log('vari ',variantPayload.stock);
  
  variantPayload.newImageFiles.forEach((image)=>{
    formData.append('images',image)

  })

  formData.append('stock',variantPayload.stock)
  formData.append('attributes',JSON.stringify(variantPayload.attribut))
  formData.append('priceAmount',JSON.stringify(variantPayload.price.amount))
  formData.append('additional_info',variantPayload.Additional_info)
  console.log('form ', formData);
  

  const response = await productApiInstance.post(`/${id}/variants`,formData)
  return response.data
}

export async function searchSuggestion(searchItem){
  const response = await productApiInstance.get(`/search/suggestion?searchItem=${searchItem}`)
  return response.data
}

export async function searchProducts(searchItem){
  const response = await productApiInstance.get(`/search?searchItem=${searchItem}`)
  return response.data
}