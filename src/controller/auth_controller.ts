import { type Request, type Response } from 'express'

import type UserType from '../types/user_type'
import { addUserValidation, createSessionValidation, refreshSessionValidation } from '../validation/auth_validation'
import { logger } from '../utils/logger'
import { checkPassword, hashing } from '../utils/hashing'
import { addUser, findUserByEmail } from '../services/auth_service'
import { signJWT, verifyJWT } from '../utils/jwt'

export async function registerUser(req: Request, res: Response): Promise<any> {
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

  const user: UserType = await findUserByEmail(value.email)
  if (user?.email) {
    logger.error('Auth - register = User already exists')
    return res.status(403).send({ status: false, statusCode: 403, message: 'User already exists' })
  }

  try {
    value.password = `${hashing(value.password)}`
    const { name, email, createdAt } = await addUser(value)
    logger.info('Success register user')
    return res
      .status(201)
      .send({ status: true, statusCode: 200, message: 'Register user success', data: { name, email, createdAt } })
  } catch (error) {
    logger.error(`Auth - register = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export async function createSession(req: Request, res: Response): Promise<any> {
  const { error, value } = createSessionValidation(req.body)
  if (error) {
    logger.error(`Auth - create Session = ${error.details[0].message}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    const user: UserType = await findUserByEmail(value.email)
    const isValid = checkPassword(value.password, user.password)
    if (!isValid) {
      logger.error('Invalid email or password')
      return res.status(401).json({ status: false, statusCode: 401, message: 'Invalid email or password' })
    }
    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })
    const refreshToken = signJWT({ ...user }, { expiresIn: '1y' })
    logger.info('Success login')
    return res.status(200).send({
      status: true,
      statusCode: 200,
      message: 'Login success',
      data: {
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
        token_type: 'Bearer',
        expires_in: '1 Year'
      }
    })
  } catch (error) {
    logger.error(`Auth - create Session = ${error}`)
    return res.status(422).send({ status: false, statusCode: 422, message: `${error}` })
  }
}

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

    const user = await findUserByEmail(decoded._doc.email)
    if (!user) {
      logger.error('Auth - refresh Session = Token invalid')
      return res.status(422).send({ status: false, statusCode: 422, message: 'Invalid Token' })
    }

    const accessToken = signJWT({ ...user }, { expiresIn: '1d' })
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
