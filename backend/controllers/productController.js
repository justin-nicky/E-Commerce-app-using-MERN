import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate(
    'categoryDiscount',
    'discount'
  )
  let newProductsObject = products.map((product) => {
    if (product.categoryDiscount != null) {
      product.categoryDiscount1 = product.categoryDiscount.discount
      return { ...product._doc, categoryDiscount1: product.categoryDiscount1 }
    } else {
      product.categoryDiscount1 = 0
      return { ...product._doc, categoryDiscount1: product.categoryDiscount1 }
    }
  })
  res.json(newProductsObject)
})

// @desc   Fetch a product
// @route  GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id).populate(
    'categoryDiscount',
    'discount'
  )

  if (product != null) {
    // if (product.categoryDiscount != null) {
    //   product.categoryDiscount1 = 44
    // } else {
    //   product.categoryDiscount1 = 0
    // }
    res.json({
      ...product._doc,
      categoryDiscount1: product.categoryDiscount.discount,
    })
  } else {
    res.status(404)
    throw new Error('Product not found.')
  }
})

// @desc   Delete a product
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product != null) {
    await product.remove()
    res.json({ message: 'product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found.')
  }
})

// @desc   Create a product
// @route  POST /api/products/
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    previewImage: '/images/sample.jpg',
    images: [],
    brand: 'Sample brand',
    category: 'Sample category',
    subCategory: 'Sample Subcategory',
    countInStock: 0,
    numReviews: 0,
    discount: 0,
    description: 'Sample description',
  })
  const createdProduct = await product.save()
  res.status(201).json({ product: createdProduct })
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    images,
    brand,
    category,
    countInStock,
    previewImage,
    subCategory,
    discount,
  } = req.body

  const product = await Product.findById(req.params.id)

  const { _id: categoryId } = await Category.findOne({ category })

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.previewImage = previewImage
    product.images = images
    product.subCategory = subCategory
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.discount = discount
    product.categoryDiscount = categoryId

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
}
