import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import { OAuth2Client } from 'google-auth-library'
import mongoose from 'mongoose'

// @desc   Auth user and get token
// @route  POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (user.isDisabled) {
    res.status(401)
    throw new Error('Not Authorized, Blocked User.')
  }
  if (user) {
    if (!(await user.matchPassword(password))) {
      res.status(401)
      throw new Error('Incorrect Password.')
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid Credentials.')
  }
})

// @desc   Register a new user
// @route  POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists.')
  }
  const user = await User.create({
    name,
    email,
    password,
  })
  if (user) {
    res.status(201)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc   Register or Login new user using google auth
// @route  POST /api/users/loginwithgoogle
// @access Public
const googleSignInUser = asyncHandler(async (req, res) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken: req.body?.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { email, name } = payload

    const user = await User.findOne({ email })
    if (user.isDisabled) {
      res.status(401)
      throw new Error('Not Authorized, Blocked User.')
    }
    if (user) {
      res.status(200)
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      })
    } else {
      const user = await User.create({
        name,
        email,
      })
      res.status(201)
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      })
    }
  } catch (error) {
    res.status(400)
    throw new Error('Google Authentication failed')
  }
})

// @desc   Get user profile
// @route  GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profileImage: user.profileImage,
    })
  }
})

// @desc   Update user profile
// @route  PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.profileImage = req.body.profileImage || user.profileImage
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      profileImage: updatedUser.profileImage,
    })
  }
})

// @desc   Get all users
// @route  GET /api/users
// @access Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
})

// @desc   patch a user
// @route  PATCH /api/users
// @access Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
  const isIdValid = mongoose.Types.ObjectId.isValid(req.params.id)
  if (isIdValid) {
    console.log(req.body)
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select('-password')

    res.json({ user: user })
  } else {
    next()
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  googleSignInUser,
  getAllUsers,
  updateUser,
  updateUserProfile,
}
