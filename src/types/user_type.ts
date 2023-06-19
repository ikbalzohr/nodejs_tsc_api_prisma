export interface UserType {
  email: string
  password: string
  name: string
  role: string
}
export interface UserProfileType {
  email: string
  name: string
}

export interface UserPasswordType {
  email: string
  old_password: string
  new_password: string
  confirm_password: string
}
