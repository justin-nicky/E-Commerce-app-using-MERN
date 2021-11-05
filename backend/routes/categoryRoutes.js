import express from 'express'
import {
  createCategory,
  getAllCategories,
  updateCategory,
} from '../controllers/categoryController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, createCategory)
  .get(protect, admin, getAllCategories)

router.route('/:category').put(protect, admin, updateCategory)

export default router
