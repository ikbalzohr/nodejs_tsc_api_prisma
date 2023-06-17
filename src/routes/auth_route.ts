import { Router } from 'express'
import { createSession, refreshSession, registerUser } from '../controller/auth_controller'

export const AuthRouter: Router = Router()

AuthRouter.post('/register', registerUser)
AuthRouter.post('/login', createSession)
AuthRouter.post('/refresh', refreshSession)
