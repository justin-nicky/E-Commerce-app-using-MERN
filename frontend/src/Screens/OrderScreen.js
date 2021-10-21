import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { getOrderDetails, updateOrderStatus } from '../actions/orderActions'
// import { ORDER_CREATE_RESET } from '../constants/orderConstants'
// import { USER_DETAILS_RESET } from '../constants/userConstants'
import { ORDER_UPDATE_STATUS_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match }) => {
  const orderId = match.params.id
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderUpdateStatus = useSelector((state) => state.orderUpdateStatus)
  const {
    success: updateStatusSuccess,
    loading: updateStatusLoading,
    error: updateStatusError,
  } = orderUpdateStatus

  //if (!loading) {
  //   Calculate prices

  const itemsPrice = order?.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )

  // }

  useEffect(() => {
    if (!order || order._id !== orderId || order.status === 'Delivered') {
      dispatch({ type: ORDER_UPDATE_STATUS_RESET })
      dispatch(getOrderDetails(orderId))
    }
  }, [dispatch, order, orderId])

  const updateStatusHandler = (status) => {
    dispatch(updateOrderStatus(order._id, status))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>Shipping</h3>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              <Message variant='secondary'>{order.status}</Message>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <p className='mb-3'>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='secondary'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Order Items</h3>
              {order.orderItems.length === 0 ? (
                <Message>order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price >> 0} = ₹
                          {(item.qty * item.price) >> 0}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{itemsPrice >> 0}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{order.shippingPrice >> 0}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{order.taxPrice >> 0}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>₹{order.totalPrice >> 0}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {userInfo &&
                userInfo.isAdmin &&
                order.status !== ('Delivered' || 'Cancelled') && (
                  <Form.Control
                    className='shadow-sm btn btn-primary '
                    as='select'
                    value={order.status}
                    onChange={(e) => {
                      updateStatusHandler(e.target.value)
                    }}
                  >
                    {['Placed', 'Shipped', 'Delivered'].map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Form.Control>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
