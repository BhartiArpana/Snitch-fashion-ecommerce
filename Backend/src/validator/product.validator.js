import {body,validationResult} from 'express-validator'

function validateRequest(req,res,next){
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
      }
      next()
}

export const productValitor = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('priceAmount').isNumeric().withMessage("PriceAmount must be a number"),
    body('priceCurrency').notEmpty().withMessage('PriceCurrent is required'),
    validateRequest
]