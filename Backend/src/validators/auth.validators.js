import {body,validationResult} from 'express-validator'

function validateRequest(req,res,next){
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({
            error:error.array()
        })
    }
    next()
}
export const validateRegisterUser = [
    body('email')
      .isEmail().withMessage('Invalid email format'),
    body('contact')
    .notEmpty().withMessage("Contact is required")
      .matches(/^\d{10}$/).withMessage("Contact number must be a 10-digit number "),
    body('password')
      .isLength({min:6}).withMessage('Password must be contain atleast 6-characters'),
    body('fullname')
    .notEmpty().withMessage("Full name is required")
      .isLength({min:3}).withMessage('Fullname must be atleast 3 character '),
    body('isSeller')
      .toBoolean()
      .isBoolean().withMessage("isSeller must be a Boolean "),
    validateRequest
]

export const validateLoginUser = [
    body('email')
      .isEmail().withMessage('Invalid email format'),
     body('password')
    .isLength({min:6}).withMessage('Password must be contain atleast 6-characters'),
    validateRequest
]