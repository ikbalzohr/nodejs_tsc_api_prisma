import { Router } from 'express'
import { registerUser, loginUser, refreshSession, updatePassword, deleteUser } from '../controller/auth_controller'
import { requireSuperAdmin, requireUser } from '../middleware/auth_middleware'

export const AuthRouter: Router = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', loginUser)
AuthRouter.post('/refresh', refreshSession)
AuthRouter.post('/change-password', requireUser, updatePassword)
AuthRouter.delete('/delete-user/:email', requireSuperAdmin, deleteUser)
