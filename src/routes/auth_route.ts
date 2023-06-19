import { Router } from 'express'
import {
  createSession,
  deleteUser,
  refreshSession,
  registerUser,
  updatePassword,
  updateUser
} from '../controller/auth_controller'
import { requireAdmin, requireUser } from '../middleware/auth_middleware'

export const AuthRouter: Router = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', requireUser, refreshSession)
AuthRouter.post('/update', requireUser, updateUser)
AuthRouter.post('/change-password', requireUser, updatePassword)
AuthRouter.delete('/delete-user/:email', requireAdmin, deleteUser)
