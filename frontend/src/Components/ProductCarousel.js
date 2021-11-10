import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { listTopRatedProducts } from '../actions/productActions'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  useEffect(() => {
    dispatch(listTopRatedProducts())
  }, [dispatch])
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger' content={error} />
  ) : (
    <Carousel id='carousel-top' pause='hover' className='bg-dark mb-3'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image
              id='carousel-image'
              src={product.previewImage}
              alt={product.name}
              fluid
            />
            <Carousel.Caption className='carousel-caption' />
            <h2>
              {product.name} ({product.price})
            </h2>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
