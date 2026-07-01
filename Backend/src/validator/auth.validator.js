import {body,validationResult} from 'express-validator'

function validateRequest(req,res,next){
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
      }
      next()
}

export const registerValidator = [
    body('fullName')
        .notEmpty().withMessage('Full name is required')
        .isLength({min:3}).withMessage('Full name must be at least 3 characters long'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('contact')
        .notEmpty().withMessage('Contact is required')
        .isMobilePhone().withMessage('Invalid contact number'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('isSeller')
        .isBoolean().withMessage('isSeller must be a boolean value'),
        
    validateRequest
]