import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      if (req.user.isDisabled) {
        res.status(401)
        throw new Error('Not Authorized, Blocked User.')
      }
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not Authorized, Token Failed.')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not Authorized, No Token.')
  }
})

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not Authorized as admin')
  }
})

export { protect, admin }
