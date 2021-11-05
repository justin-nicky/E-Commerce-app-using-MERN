import mongoose from 'mongoose'

const categorySchema = mongoose.Schema(
  {
    category: {
      required: true,
      type: String,
    },
    subCategory: [String],
    discount: {
      required: true,
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
)

const Category = mongoose.model('Category', categorySchema)

export default Category
