import Joi from 'joi'
import type ProductType from '../types/product_type'

export const addProductValidation = (payload: ProductType): any => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().allow('', null),
    size: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}

export const updateProductValidation = (payload: ProductType): any => {
  const schema = Joi.object({
    name: Joi.string().allow('', null),
    price: Joi.number().allow('', null),
    size: Joi.string().allow('', null)
  })

  return schema.validate(payload)
}
