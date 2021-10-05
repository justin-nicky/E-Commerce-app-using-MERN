import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './Data/users.js'
import User from './models/userModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await User.deleteMany()
    console.log('deleted')
    await User.insertMany(users)
    console.log('added to mongo')
    process.exit()
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }
}
