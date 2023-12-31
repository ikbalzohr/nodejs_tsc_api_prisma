import { type Request, type Response } from 'express'
import { logger } from '../utils/logger'
import { checkPassword, hashing } from '../utils/hashing'
import { v4 as uuidv4 } from 'uuid'
import {
  addUserValidation,
  loginValidation,
  refreshSessionValidation,
  updatePasswordValidation
} from '../validation/auth_validation'
import { addUser, deleteUserByEmail, findUserByEmail, updatePasswordByEmail } from '../services/auth_service'
import { signJWT, verifyJWT } from '../utils/jwt'

// register
export async function registerUser(req: Request, res: Response): Promise<any> {
  req.body.id = uuidv4()
  const { error, value } = addUserValidation(req.body)
  if (error) {
    logger.error(`Auth - register = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  function isEmail(email: string): boolean {
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    if (email !== '' && email.match(emailFormat)) {
      return true
    }
    return false
  }

  if (!isEmail(value.email)) {
    logger.error("Auth - register = This is not an e-mail and don't use spaces")
    return res
      .status(403)
      .send({ status: false, statusCode: 403, message: "This is not an e-mail and don't use spaces" })
  }

  try {
    const user = await findUserByEmail(value.email)
    if (user?.email) {
      logger.error('Auth - register = User already exists')
      return res.status(403).send({ status: false, statusCode: 403, message: 'User already exists' })
    }

    value.password = `${hashing(value.password)}`
    const data = await addUser(value)
    logger.info('Success register user')
    return res.status(200).send({ status: true, statusCode: 200, message: 'Register user success', data })
  } catch (error) {
    logger.error(`Auth - register = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

// login
export async function loginUser(req: Request, res: Response): Promise<any> {
  const { error, value } = loginValidation(req.body)
  if (error) {
    logger.error(`Auth - create Session = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    const user = await findUserByEmail(value.email)
    if (!user) {
      logger.error('Email not registered')
      return res.status(401).json({ status: false, statusCode: 401, message: 'Email not registered' })
    }
    const isValid = checkPassword(value.password, user.password)
    if (!isValid) {
      logger.error('Invalid email or password')
      return res.status(401).json({ status: false, statusCode: 401, message: 'Invalid email or password' })
    }
    const accessToken = signJWT({ ...user }, { expiresIn: '10h' })
    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })
    logger.info('Success login')
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Login success',
      data: {
        id: user.id,
        email: user.email,
        accessToken,
        refreshToken,
        token_type: 'Bearer',
        expires_in: '10 hour'
      }
    })
  } catch (error) {
    logger.error(`Auth - create Session = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: `${error}` })
  }
}

// refresh token
export async function refreshSession(req: Request, res: Response): Promise<any> {
  const { error, value } = refreshSessionValidation(req.body)
  if (error) {
    logger.error(`Auth - refresh Session = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }

  try {
    const { decoded } = verifyJWT(value.refreshToken)
    if (!decoded) {
      logger.error('Auth - refresh Session = Token invalid')
      return res.status(422).send({ status: false, statusCode: 422, message: 'Invalid Token' })
    }

    const user = await findUserByEmail(decoded.email)
    if (!user) {
      logger.error('Auth - refresh Session = Token invalid')
      return res.status(422).send({ status: false, statusCode: 422, message: 'Invalid Token' })
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '10h' })
    logger.info('Success refresh session')
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Refresh session success',
      data: { accessToken }
    })
  } catch (error) {
    logger.error(`Auth - refresh Session = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: `${error}` })
  }
}

// change password
export async function updatePassword(req: Request, res: Response): Promise<any> {
  const { error, value } = updatePasswordValidation(req.body)
  if (error) {
    logger.error(`Auth - Update Password = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    const user = res.locals.user
    if (!user) {
      logger.error('Auth - Update Password = Email not registered')
      return res.status(401).json({ status: false, statusCode: 401, message: 'Email not registered' })
    }
    const isValid = checkPassword(value.old_password, user.password)
    if (!isValid) {
      logger.error('Auth - Update Password = Your old password is wrong')
      return res.status(401).json({ status: false, statusCode: 401, message: 'Your old password is wrong' })
    }
    const isSamePassword = value.new_password === value.confirm_password
    if (!isSamePassword) {
      logger.error('Auth - Update Password = Invalid password not same')
      return res.status(401).json({ status: false, statusCode: 401, message: 'Invalid password not same' })
    }
    value.confirm_password = `${hashing(value.confirm_password)}`
    const result = await updatePasswordByEmail(user.id, value.confirm_password)
    logger.info('Success update password user')
    return res.status(200).send({ status: true, statusCode: 200, message: 'Update password success', data: result })
  } catch (error) {
    logger.error(`Auth - Update Password = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: `${error}` })
  }
}

export async function deleteUser(req: Request, res: Response): Promise<any> {
  const {
    params: { email }
  } = req
  try {
    const user = await findUserByEmail(email)
    if (!user) {
      logger.error('Auth - Update Password = Email not registered')
      return res.status(401).json({ status: false, statusCode: 401, message: 'Email not registered' })
    }
    const result = await deleteUserByEmail(email)
    logger.info('Success delete user')
    return res.status(200).send({ status: true, statusCode: 200, message: 'Delete user success', data: result })
  } catch (error) {
    logger.error(`Auth - Update Password = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: `${error}` })
  }
}
