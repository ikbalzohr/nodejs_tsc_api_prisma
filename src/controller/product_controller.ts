import { type Request, type Response } from 'express'

import { logger } from '../utils/logger'
import { addProductValidation, updateProductValidation } from '../validation/product_validation'
import {
  addProductToDB,
  deleteProductById,
  getProductById,
  getProductByName,
  getProductFromDB,
  updateProductById
} from '../services/product_service'

export async function createProduct(req: Request, res: Response): Promise<any> {
  const { error, value } = addProductValidation(req.body)
  if (error) {
    logger.error(`Product - create = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  const result = await getProductByName(value.name)
  if (result?.name) {
    logger.error('Product - create = Data already exists')
    return res.status(403).send({ status: false, statusCode: 403, message: 'Data already exists' })
  }
  try {
    const result = await addProductToDB(value)
    logger.info('Success add new product')
    return res.status(200).send({ status: true, statusCode: 200, message: 'Add product success', data: result })
  } catch (error) {
    logger.error(`Product - create = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export async function getProduct(req: Request, res: Response): Promise<any> {
  const {
    params: { id }
  } = req

  if (id) {
    try {
      const result = await getProductById(id)
      if (result) {
        logger.info('Success get product data')
        return res.status(200).send({ status: true, statusCode: 200, data: result })
      } else {
        return res.status(404).send({ status: true, statusCode: 404, message: 'Data Not Found', data: {} })
      }
    } catch (error) {
      logger.error(`Product - update = ${error}`)
      return res.status(422).send({ status: false, statusCode: 422, message: error })
    }
  } else {
    const results: any = await getProductFromDB()
    logger.info('Success get products data')
    return res.status(200).send({ status: true, statusCode: 200, data: results })
  }
}

export async function updateProduct(req: Request, res: Response): Promise<any> {
  const {
    params: { id }
  } = req
  const { error, value } = updateProductValidation(req.body)
  if (error) {
    logger.error(`Product - create = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const result = await updateProductById(id, value)
    if (result) {
      logger.info('Success update product')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Update product success', data: result })
    } else {
      logger.info('Data not found')
      return res.status(404).send({ status: true, statusCode: 404, message: 'Data not found' })
    }
  } catch (error) {
    logger.error(`Product - update = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<any> {
  const {
    params: { id }
  } = req

  try {
    const result = await deleteProductById(id)
    if (result) {
      logger.info('Success delete product')
      return res.status(200).send({ status: true, statusCode: 200, message: 'Delete product success', data: result })
    } else {
      logger.info('Data not found')
      return res.status(404).send({ status: true, statusCode: 404, message: 'Data not found' })
    }
  } catch (error) {
    logger.error(`Product - delete = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}
