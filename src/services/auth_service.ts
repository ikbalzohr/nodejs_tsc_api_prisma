import { type UserType } from '../types/user_type'
import { PrismaClient, type User } from '@prisma/client'

const prisma = new PrismaClient()

export const addUser = async (data: UserType): Promise<User> => {
  const result = await prisma.user.create({ data })
  return result
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({ where: { email } })
  return result
}

export const updateUserByEmail = async (email: string, name: string): Promise<any> => {
  const result = await prisma.user.update({
    where: { email },
    data: { name },
    select: { email: true, name: true }
  })
  return result
}

export const updatePasswordByEmail = async (email: string, password: string): Promise<any> => {
  const result = await prisma.user.update({
    where: { email },
    data: { password },
    select: { email: true, name: true }
  })
  return result
}

export const deleteUserByEmail = async (email: string): Promise<any> => {
  const result = await prisma.user.delete({
    where: { email },
    select: { email: true, name: true }
  })
  return result
}
