import { type UserServiceType, type UserRegisterType } from '../types/user_type'
import { PrismaClient, type User } from '@prisma/client'

const prisma = new PrismaClient()

export const addUser = async (data: UserRegisterType): Promise<UserServiceType> => {
  const result = await prisma.user.create({
    data,
    select: { id: true, email: true, createdAt: true, updatedAt: true }
  })
  return result
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: { email }
  })
  return result
}

export const updatePasswordByEmail = async (id: string, password: string): Promise<UserServiceType> => {
  const result = await prisma.user.update({
    where: { id },
    data: { password },
    select: { id: true, email: true, createdAt: true, updatedAt: true }
  })
  return result
}

export const deleteUserByEmail = async (email: string): Promise<UserServiceType> => {
  const result = await prisma.user.delete({
    where: { email },
    select: { id: true, email: true, createdAt: true, updatedAt: true }
  })
  return result
}
