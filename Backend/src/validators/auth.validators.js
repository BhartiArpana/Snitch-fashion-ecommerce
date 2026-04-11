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
      .matches(/^\d{10}$/).withMessage("Contact number must be a 10-digit number "),
    body('password')
      .isLength({min:6}).withMessage('Password must be contain atleast 6-characters'),
    body('fullname')
      .isLength({min:3}).withMessage('Fullname must be atleast 3 character '),
    body('isSeller')
      .isBoolean().withMessage("isSller must be a Boolean "),
    validateRequest
]