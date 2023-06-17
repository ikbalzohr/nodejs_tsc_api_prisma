import bcrypt from 'bcrypt'

// encode
export const hashing = (password: string): string => {
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(password, salt)
}

// decode
export const checkPassword = (password: string, userPassword: string): boolean => {
  return bcrypt.compareSync(password, userPassword)
}
