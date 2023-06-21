export interface UserRegisterType {
  id: string
  email: string
  password: string
}

export interface UserServiceType {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface UserLoginType {
  email: string
  name: string
}

export interface UserPasswordType {
  old_password: string
  new_password: string
  confirm_password: string
}
