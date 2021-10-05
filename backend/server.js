import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import products from './Data/products.js'

dotenv.config()
const PORT = process.env.PORT || 5000

connectDB()

const app = express()

app.get('/api/products', (req, res) => {
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find((product) => product._id == req.params.id)
  res.json(product)
})

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
