import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product, history, match }) => {
  const addToCartHandler = () => {
    history.push(`/cart/${product._id}?qty=1`)
  }

  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`product/${product._id}`}>
        <Card.Img variant='top' src={product.previewImage} />
      </Link>
      <Card.Body>
        <Link to={`product/${product._id}`}>
          <Card.Title as='div' id='card-name'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div' className='my-3'>
          <Rating
            value={product.rating}
            text={` from ${product.numReviews} reviews`}
          />
        </Card.Text>

        {product.discount > 0 || product.categoryDiscount1 > 0 ? (
          <>
            <Card.Text
              as='h4'
              className='my-3 text-secondary fs-6 font-weight-light'
              style={{ textDecoration: 'line-through' }}
            >
              ₹ {product.price}
            </Card.Text>

            <Card.Text as='h4' className='my-3'>
              ₹{' '}
              {Math.min(
                product.price - (product.price * product.discount) / 100,
                product.price -
                  (product.price * product.categoryDiscount1) / 100
              )}
            </Card.Text>
          </>
        ) : (
          <Card.Text as='h4' className='my-3'>
            ₹ {product.price}
          </Card.Text>
        )}

        <Button variant='primary' className='my-1' onClick={addToCartHandler}>
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  )
}

export default Product
