import Category from '../models/categoryModel.js'
import asyncHandler from 'express-async-handler'

// @desc    Create a category
// @route   POST /api/categories/
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  let { category: _category, subCategory: _subCategory } = req.body
  _category = _category.toUpperCase()
  _subCategory = _subCategory.toUpperCase()
  const category = await Category.findOne({ category: _category })

  if (!category) {
    const newCategory = new Category({
      category: _category,
      subCategory: [_subCategory],
    })
    const createdCategory = await newCategory.save()
    res.status(201).json({ category: createdCategory })
  } else {
    if (category.subCategory.includes(_subCategory))
      res.json({ category: category })
    else {
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: category._id },
        {
          $push: { subCategory: _subCategory },
        },
        { new: true }
      )
      res.status(201).json({ category: updatedCategory })
    }
  }
})

// @desc   Get all categories
// @route  GET /api/categories
// @access Private/Admin
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await User.find({})
  res.json(categories)
})
