import mongoose from 'mongoose'

const categorySchema = mongoose.Schema(
  {
    category: {
      required: true,
      type: String,
    },
    subCategory: [String],
  },
  { timestamps: true }
)

const Category = mongoose.model('Category', categorySchema)

export default Category
