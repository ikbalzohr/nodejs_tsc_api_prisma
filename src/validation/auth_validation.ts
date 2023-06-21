import Joi from 'joi'
import { type UserPasswordType, type UserLoginType, type UserRegisterType } from '../types/user_type'

export const addUserValidation = (payload: UserRegisterType): any => {
  const schema = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(payload)
}

export const loginValidation = (payload: UserLoginType): any => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(payload)
}

export const refreshSessionValidation = (payload: { refreshToken: string }): any => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })
  return schema.validate(payload)
}

export const updatePasswordValidation = (payload: UserPasswordType): any => {
  const schema = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
  })
  return schema.validate(payload)
}
