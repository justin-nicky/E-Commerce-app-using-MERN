import React, { useState, useEffect } from 'react'
import {
  Button,
  Col,
  Form,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
  Carousel,
  Card,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../Components/Rating'
import { listProductDetails } from '../actions/productActions'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import { GlassMagnifier } from 'react-image-magnifiers'

const ProductScreen = ({ match, history }) => {
  const dispatch = useDispatch()

  const [qty, setQty] = useState(1)

  const [subImage1, setsubImage1] = useState(null)
  const [subImage2, setsubImage2] = useState(null)

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, product, error } = productDetails

  useEffect(() => {
    if (!product || !product.name || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id))
    }
    if (product && product.images) {
      if (product.images.length >= 1) {
        setsubImage1(product.images[0])
      }
      if (product.images.length >= 2) {
        setsubImage2(product.images[1])
      }
    }
  }, [match, dispatch, product])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

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
              <Carousel>
                {subImage1 && (
                  <Carousel.Item>
                    <GlassMagnifier
                      imageSrc={subImage1}
                      imageAlt={product.name}
                      magnifierBorderSize={1}
                      magnifierSize={'50%'}
                      square={true}
                    />
                  </Carousel.Item>
                )}
                <Carousel.Item>
                  <GlassMagnifier
                    imageSrc={product.previewImage}
                    imageAlt={product.name}
                    magnifierBorderSize={1}
                    magnifierSize={'50%'}
                    square={true}
                  />
                </Carousel.Item>
                {subImage2 && (
                  <Carousel.Item>
                    <GlassMagnifier
                      imageSrc={subImage2}
                      imageAlt={product.name}
                      magnifierBorderSize={1}
                      magnifierSize={'50%'}
                      square={true}
                    />
                  </Carousel.Item>
                )}
              </Carousel>
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
                          product.price -
                            (product.price * product.discount) / 100,
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
                    {product && (
                      <Col>
                        <strong>
                          ₹{' '}
                          {Math.min(
                            product.price -
                              (product.price * product.discount) / 100,
                            product.price -
                              (product.price * product.categoryDiscount1) / 100
                          )}
                        </strong>
                      </Col>
                    )}
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

                {product.countInStock > 0 && (
                  <ListGroupItem>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => {
                            setQty(e.target.value)
                          }}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}

                <ListGroupItem className='justify-content-center'>
                  <Row>
                    <Col>
                      <Button
                        className='btn-block'
                        type='button'
                        disabled={product.countInStock <= 0}
                        onClick={addToCartHandler}
                      >
                        Add To Cart
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
