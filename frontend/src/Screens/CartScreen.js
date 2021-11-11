import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  Container,
} from 'react-bootstrap'
import Message from '../Components/Message'
import Center from '../Components/Center'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id

  const qty = location.search ? Number(location.search.split('=')[1]) : 1

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  return (
    <Row>
      <Col md={8}>
        <h3>Shopping Cart</h3>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is Empty, <Link to='/'>continue shopping.</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((_item) => (
              <ListGroup.Item key={_item.product}>
                <Row className='d-flex align-items-center'>
                  <Col md={2}>
                    <Image src={_item.image} alt={_item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link
                      className='text-decoration-none text-reset'
                      to={`/product/${_item.product}`}
                    >
                      {_item.name}
                    </Link>
                  </Col>

                  {_item.discount > 0 || _item.categoryDiscount1 > 0 ? (
                    <Col>
                      ₹{' '}
                      {Math.min(
                        _item.price - (_item.price * _item.discount) / 100,
                        _item.price -
                          (_item.price * _item.categoryDiscount1) / 100
                      )}
                    </Col>
                  ) : (
                    <Col md={2}>₹ {_item.price}</Col>
                  )}

                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={_item.qty}
                      onChange={(e) => {
                        dispatch(
                          addToCart(_item.product, Number(e.target.value))
                        )
                      }}
                    >
                      {[...Array(_item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => {
                        removeFromCartHandler(_item.product)
                      }}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h5 className='fw-normal'>
                {' '}
                SUBTOTAL ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                ITEMS
              </h5>
              ₹{' '}
              {cartItems.reduce((acc, item) => {
                let price =
                  item.discount > 0 || item.categoryDiscount1 > 0
                    ? Math.min(
                        item.price - (item.price * item.discount) / 100,
                        item.price - (item.price * item.categoryDiscount1) / 100
                      )
                    : item.price

                return acc + item.qty * price
              }, 0)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Center>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed To Checkout
                </Button>
              </Center>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
