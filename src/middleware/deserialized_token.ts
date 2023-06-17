import { type Request, type Response, type NextFunction } from 'express'
import { verifyJWT } from '../utils/jwt'

const deserializeToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '')
  if (!accessToken) {
    next()
    return
  }
  const { decoded, expired } = verifyJWT(accessToken)
  if (decoded) {
    res.locals.user = decoded
    next()
    return
  }

  if (expired) {
    next()
    return
  }

  next()
}

export default deserializeToken
