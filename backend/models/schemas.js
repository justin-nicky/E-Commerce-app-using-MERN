import mongoose from 'mongoose'

const addressSchema = mongoose.Schema({
  address: { type: String, requred: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
})

const reviewSchema = mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
})

export { addressSchema, reviewSchema }
