import { type Request, type Response, type NextFunction } from 'express'

export const requireUser = (req: Request, res: Response, next: NextFunction): any => {
  const user = res.locals.user
  if (!user) {
    return res.sendStatus(403)
  }

  next()
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction): any => {
  const user = res.locals.user
  if (!user || user.role !== 'admin') {
    return res.sendStatus(403)
  }

  next()
}

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction): any => {
  const user = res.locals.user
  if (!user || user.role !== 'super_admin') {
    return res.sendStatus(403)
  }

  next()
}
