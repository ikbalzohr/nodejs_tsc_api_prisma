import userModel from '../models/user_model'
import type UserType from '../types/user_type'

export const addUser = async (payload: UserType): Promise<any> => {
  return await userModel.create(payload)
}

export const findUserByEmail = async (email: string): Promise<any> => {
  return await userModel.findOne({ email: { $regex: email, $options: 'si' } })
}
