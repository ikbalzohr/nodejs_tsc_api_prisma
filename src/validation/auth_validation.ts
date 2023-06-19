import Joi from 'joi'
import { type UserPasswordType, type UserProfileType, type UserType } from '../types/user_type'

export const addUserValidation = (payload: UserType): any => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    role: Joi.string().allow('', null)
  })
  return schema.validate(payload)
}

export const createSessionValidation = (payload: UserType): any => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
  return schema.validate(payload)
}

export const refreshSessionValidation = (payload: UserType): any => {
  const schema = Joi.object({
    refreshToken: Joi.string().required()
  })
  return schema.validate(payload)
}

export const updateUserValidation = (payload: UserProfileType): any => {
  const schema = Joi.object({
    email: Joi.string().required(),
    name: Joi.string().allow('', null)
  })
  return schema.validate(payload)
}

export const updatePasswordValidation = (payload: UserPasswordType): any => {
  const schema = Joi.object({
    email: Joi.string().required(),
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required()
  })
  return schema.validate(payload)
}
