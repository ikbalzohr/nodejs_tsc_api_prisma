import { Router } from 'express'

import { createProduct, deleteProduct, getProduct, updateProduct } from '../controller/product_controller'
import { requireAdmin, requireUser } from '../middleware/auth_middleware'

export const ProductRouter: Router = Router()

ProductRouter.get('/', getProduct)
ProductRouter.get('/:id', requireUser, getProduct)
ProductRouter.post('/', requireAdmin, createProduct)
ProductRouter.put('/:id', requireAdmin, updateProduct)
ProductRouter.delete('/:id', requireAdmin, deleteProduct)
