import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`product/${product._id}`}>
        <Card.Img variant='top' src={product.image} />
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
        <Card.Text as='h3' className='my-3'>
          ₹ {product.price}
        </Card.Text>
        <Button variant='primary' className='me-3 my-1'>
          Buy Now
        </Button>
        <Button variant='primary' className='my-1'>
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  )
}

export default Product
