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
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../Components/Rating'
import { useEffect } from 'react'
import { listProductDetails } from '../actions/productActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'

const ProductScreen = ({ match }) => {
  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, product, error } = productDetails

  useEffect(() => {
    dispatch(listProductDetails(match.params.id))
  }, [match, dispatch])

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={'danger'}>{error}</Message>
      ) : (
        <>
          <Link className='btn' to='/'>
            Go Back
          </Link>
          <Row>
            <Col md={5}>
              <Image src={product.previewImage} alt={product.name} fluid />
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
                  <Row>
                    <Col>
                      <Button
                        className='btn-block'
                        type='button'
                        disabled={product.countInStock <= 0}
                      >
                        Add To Cart
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        className='btn-block'
                        type='button'
                        disabled={product.countInStock <= 0}
                      >
                        Buy Now
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
