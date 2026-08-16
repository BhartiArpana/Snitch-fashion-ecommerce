import productModel from "../model/product.model.js";
import cartModel from "../model/cart.model.js";
import { stockInVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.services.js";
import {getCartDetails} from '../dao/cart.dao.js'
import paymentModel from "../model/payment.model.js";
import {validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js'
import {config} from '../config/config.js'


export const addToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  const { quantity = 1 } = req.body || {};
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

  if (!product) {
    return res.status(400).json({
      message: "Product not found",
      success: false,
    });
  }

  const stock = stockInVariant;

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user }));

  const isProductAlreadyInCart = cart.items.some(
    (item) =>
      item.product.toString() === productId &&
      item.variants?.toString() === variantId,
  );
  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variants?.toString() === variantId,
    ).quantity;
    if (quantityInCart > stock) {
      return res.status(400).json({
        message: "out of stock",
        success: false,
      });
    }
    await cartModel.findOneAndUpdate(
      {
        user: req.user._id,
        "items.products": productId,
        "item.variants": variantId,
      },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "Cart update successfully",
      success: true,
      cart,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: "out of stock",
      success: false,
    });
  }
  cart.items.push({
    product: productId,
    variants: variantId,
    quantity,
    price: product.price,
  });
  await cart.save();

  res.status(200).json({
    message: "Add to cart successfully",
    success: true,
    cart,
  });
};

export const getCart = async (req, res) => {
  let user = req.user;
  let cart = await getCartDetails(user._id)

  if (!cart) {
    cart = await cartModel.create({
      user: user._id,
    });
  }
  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

export const incrementCartQuantity = async (req, res) => {
  const { variantId, productId } = req.params;
  const product = await productModel.findOne(
    {
      _id: productId,
      "variants._id": variantId,
    },
    {
      "varinats.$": 1,
    },
  );
  if (!product) {
    return res.status(400).json({
      message: "product not found",
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }

  const stock = await stockInVariant(productId, variantId);
  const itemQuantityInCart =
    cart?.items.find(
      (item) =>
        item.product.toString() == productId && item.variants == variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `${stock} item left in the stock`,
      success: false,
    });
  }

  const updateCart = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variants": variantId,
    },
    {
      $inc: { "items.$.quantity": 1 },
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    message: "cart item increment successfully",
    success: true,
    cart: updateCart,
  });
};

export const decrementCartQuantity = async (req, res) => {
  const { variantId, productId } = req.params;
  const product = await productModel.findOne(
    {
      _id: productId,
      "variants._id": variantId,
    },
    {
      "varinats.$": 1,
    },
  );
  if (!product) {
    return res.status(400).json({
      message: "product not found",
    });
  }

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }

  const stock = await stockInVariant(productId, variantId);
  const itemQuantityInCart =
    cart?.items.find(
      (item) =>
        item.product.toString() == productId && item.variants == variantId,
    )?.quantity || 0;

  if (itemQuantityInCart + 1 > stock) {
    return res.status(400).json({
      message: `${stock} item left in the stock`,
      success: false,
    });
  }

  const updateCart = await cartModel.findOneAndUpdate(
    {
      user: req.user._id,
      "items.product": productId,
      "items.variants": variantId,
    },
    {
      $inc: { "items.$.quantity": -1 },
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    message: "cart item increment successfully",
    success: true,
    cart: updateCart,
  });
};

export const removeAddToCart = async (req, res) => {
  const { productId, variantId } = req.params;
  try {
    const product = await productModel.findOne({
      _id: productId,
      "variants._id": variantId,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cart = await cartModel.findOne({
      user: req.user._id,
    });
    if (!cart) {
      return res.status(404).json({
        message: "cart not found",
      });
    }
    const deleteItemId =
      cart.items.find(
        (item) =>
          item.product.toString() == productId &&
          item.variants.toString() == variantId,
      )?._id || null;

    if (!deleteItemId) {
      return res.status(404).json({
        message: "item not found",
        success: false,
      });
    }
    await cartModel.updateOne(
      { user: req.user._id },
      { $pull: { items: { _id: deleteItemId } } },
    );

    res.status(200).json({
      message: "cart deleted successfully",
      success: true,
    });
  } catch (err) {
    console.log("err ", err);
  }
};

export const createorderController = async(req,res)=>{
  const user = req.user
  const {addressId} = req.body
  try{
    const cart = await getCartDetails(user._id)
  if(!cart){
    return res.status(400).json({
      message:'Item not found',
      success:false
    })
  }

  const selectedAddress = user.address.find(a=>a._id.toString()==addressId)
  if(!selectedAddress){
    return res.status(400).json({
      message:'Address not found',
      success:false
    })
  }
   const order = await createOrder({amount:cart.totalPrice,currency:cart.currency})

   const payment =await paymentModel.create( {
    user:user._id,
    price:{
      amount:cart.totalPrice,
      currency:cart.currency
    },
    "razorpay.orderId":order.id,
    orderItems:cart.items.map(item=>({
      title:item.product.title,
      productId:item.product._id,
      variantId:item.variants,
      quantity:item.quantity,
      price:{
        amount:item.price.amount || item.product.price.amount,
        currency:item.price.currency || item.product.price.currency
      },
      images:item.product.variants.images || item.product.images,
      description:item.product.description,
      
    })),

    address:{
        country:selectedAddress.country || 'india' ,
        name:selectedAddress.name || user.name,
        mobileNumber:selectedAddress.mobileNumber || user.mobileNumber,
        street:selectedAddress.street || '',
        city:selectedAddress.city || '',
        state:selectedAddress.state || '',
        pincode:selectedAddress.pincode || '',
      }
   })

   res.status(201).json({
    message:'order created successfully',
    success:true,
    order,
    address:selectedAddress
   })
  }catch(err){
    console.log(err)
    res.status(500).json({
      message:'Internal server error',
      success:false
    })
  }
}

export const verifyPaymentController = async(req,res)=>{
  const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body

  console.log(razorpay_order_id,razorpay_payment_id,razorpay_signature);
  
  const payment = await paymentModel.findOne({
    'razorpay.orderId': razorpay_order_id,
    status:'pending'
  })

  if(!payment){
    return res.status(400).json({
      message:'Payment not found',
      success:false
    })
  }

  const isValid = validatePaymentVerification({
    order_id:razorpay_order_id,
    payment_id:razorpay_payment_id,
  },razorpay_signature,config.RAZORPAY_KEY_SECRET)

  if(!isValid){
    payment.status = 'failed'
    await payment.save()
    return res.status(400).json({
      message:'Payment verification failed',
      success:false
    })
  }

  payment.status = 'paid'
  payment.razorpay.paymentId = razorpay_payment_id
  payment.razorpay.signature = razorpay_signature

  await payment.save()

  res.status(200).json({
    message:'Payment verified successfully',
    success:true,
    payment
  })
}

export const createBuynowOrderController = async(req,res)=>{
  const {productId,variantId} = req.params
  let {quantity,addressId} = req.body
  const user = req.user
 
 try{

  const selectedAddress = user.address.find(a=>a._id.toString()==addressId)
  if(!selectedAddress){
    return res.status(400).json({
      message:'Address not found',
      success:false
    })
  }

   const product = await productModel.findById(productId)
   if(!product){
    return res.status(404).json({
      message:'Product not found',
      success:false
    })
  }

  const variant = product.variants.find(v=>v._id.toString()===variantId)
  if(!variant){
    return res.status(404).json({
      message:'Variant not found',
      success:false
    })
  }
   if(quantity == undefined || quantity <= 0){quantity = 1}
   if(quantity > variant.stock){
    return res.status(400).json({
      message:'Out of stock',
      success:false
    })
   }

   const amount = variant.price.amount * quantity
   const order = await createOrder({amount,currency:variant.price.currency})
   const payment = await paymentModel.create({
    user:user._id,
    price:{
      amount,
      currency:variant.price.currency || product.price.currency
    },
    razorpay:{
      orderId:order.id
    },
    orderItems:[
      {
        title:product.title,
        productId:product._id,
        variantId:variant._id,
        quantity:quantity || 1,
        images:variant.images || product.images,
        description:product.description,
        price:{
          amount:variant.price.amount || amount,
          currency:variant.price.currency || product.price.currency
        },
        
      }
    ],
    address:{
        country:selectedAddress.country || 'india' ,
        name:selectedAddress.name || user.name,
        mobileNumber:selectedAddress.mobileNumber || user.mobileNumber,
        street:selectedAddress.street || '',
        city:selectedAddress.city || '',
        state:selectedAddress.state || '',
        pincode:selectedAddress.pincode || '',
      }
   })

   res.status(201).json({
    message:'Buynow order created successfully',
    success:true,
    order,
    address:selectedAddress 
   })
 }catch(err){
  console.log(err)
  res.status(500).json({
    message:'Internal server error',
    success:false
  })
 }

}