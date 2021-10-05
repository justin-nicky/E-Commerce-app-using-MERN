import mongoose from 'mongoose'
import { addressSchema } from './schemas.js'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    wallet: {
      type: Number,
      required: true,
      default: 0,
    },
    addresses: [addressSchema],
    defaultAddress: {
      building: { type: String, requred: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User
