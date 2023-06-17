import Joi from 'joi'
import type UserType from '../types/user_type'

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
