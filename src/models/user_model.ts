import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: 'regular'
    }
  },
  { timestamps: true }
)

const userModel = mongoose.model('user', userSchema)

export default userModel
