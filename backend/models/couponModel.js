import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Code is required'],
      unique: [true, 'Code is already taken'],
      upperCase: true,
      trim: true,
      minlength: [3, 'Code must be at least 3 characters long'],
      maxlength: [10, 'Code must be at most 10 characters long'],
    },
    discount: {
      type: Number,
      required: [true, 'Discount is required'],
      min: [0, 'Discount must be at least 0%'],
      max: [100, 'Discount must be at most 100%'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
  },
  { timestamps: true }
)

couponSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 })
const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon
