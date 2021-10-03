import React from 'react'
import {
  Button,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from '../Components/Rating'
import products from '../products'

const ProductScreen = ({ match }) => {
  const product = products.find((product) => product._id === match.params.id)
  return (
    <>
      <Link className='btn' to='/'>
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>

        <Col md={4}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4>{product.name}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={` from ${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>₹ {product.price}</h4>
            </ListGroup.Item>
            <ListGroup.Item>
              <p>
                {' '}
                <strong> description: </strong>
                {product.description}
              </p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3} variant='flush'>
          <ListGroup>
            <ListGroupItem>
              <Row>
                <Col>price:</Col>
                <Col>
                  <strong>₹ {product.price}</strong>
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem>
              <Row>
                <Col>status:</Col>
                <Col>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </Col>
              </Row>
            </ListGroupItem>
            <ListGroupItem className='justify-content-center'>
              <Button
                className='btn-block'
                type='button'
                disabled={product.countInStock <= 0}
              >
                Add To Cart
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}

export default ProductScreen
