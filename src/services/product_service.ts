import type ProductType from '../types/product_type'
import { PrismaClient, type Product } from '@prisma/client'

const prisma = new PrismaClient()

export const getProductFromDB = async (): Promise<Product[]> => {
  const result = await prisma.product.findMany()
  return result
}

export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await prisma.product.findUnique({
    where: { id }
  })
  return result
}

export const addProductToDB = async (data: ProductType): Promise<Product> => {
  const result = await prisma.product.create({
    data
  })
  // return await productModel.create(payload)
  return result
}

export const updateProductById = async (id: number, data: ProductType): Promise<any> => {
  const result = await prisma.product.update({
    where: { id },
    data
  })
  return result
}

export const deleteProductById = async (id: number): Promise<any> => {
  const result = await prisma.product.delete({
    where: { id }
  })
  return result
}
