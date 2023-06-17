import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    price: {
      type: Number
    },
    name: {
      type: String
    },
    size: {
      type: String
    }
  },
  { timestamps: true }
)

const productModel = mongoose.model('products', productSchema)

export default productModel
