import express from 'express'
import {
  createCategory,
  getAllCategories,
} from '../controllers/categoryController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, createCategory)
  .get(protect, admin, getAllCategories)

// router
//   .route('/:id')
//   .get(getProductById)
//   .delete(protect, admin, deleteProduct)
//   .put(protect, admin, updateProduct)

export default router
