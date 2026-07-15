import {param,body,validationResult} from 'express-validator'
const validateRequest  = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}
export const validateAddtoCart = [
    param('productId').isMongoId().withMessage("Invalid product id"),
    param('variantId').optional().isMongoId().withMessage('Invalid variant id'),
    body('quantity').optional().isInt({min:1}).withMessage('Qunatity must be at least 1'),

    validateRequest
]