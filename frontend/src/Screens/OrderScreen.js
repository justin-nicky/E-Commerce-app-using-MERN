import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Form,
  Modal,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { fileUploadAndResize } from '../helpers/FileUpload'
import Center from '../Components/Center'
import {
  cancelOrder,
  getOrderDetails,
  payOrder,
  updateOrderStatus,
} from '../actions/orderActions'
import {
  ORDER_CANCEL_RESET,
  ORDER_PAY_RESET,
  ORDER_UPDATE_STATUS_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)

  const [modal, setModal] = useState(false)

  const [status, setStatus] = useState('')

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderUpdateStatus = useSelector((state) => state.orderUpdateStatus)
  const {
    loading: loadingStatus,
    success: successStatus,
    error: errorStatus,
  } = orderUpdateStatus

  const orderCancel = useSelector((state) => state.orderCancel)
  const { loading: loadingCancel, success: successCancel } = orderCancel

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const itemsPrice = order?.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }

    const addRazorpayScript = () => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
    }
    addRazorpayScript()

    if (
      !order ||
      successPay ||
      successStatus ||
      successCancel ||
      order._id !== orderId
    ) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_UPDATE_STATUS_RESET })
      dispatch({ type: ORDER_CANCEL_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
    if (order && status !== '' && order.status !== 'Cancelled') {
      setStatus('')
      dispatch(getOrderDetails(orderId))
    }
  }, [
    dispatch,
    orderId,
    successPay,
    successStatus,
    successCancel,
    order,
    status,
  ])

  const displayRazorpay = async () => {
    // creating a new order
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
    const result = await axios.post(
      `/api/orders/${orderId}/razorpay`,
      { order },
      config
    )

    if (!result) {
      alert('Server error. Are you online?')
      return
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data

    const options = {
      key: 'rzp_test_WIdTNldcetMJDu',
      amount: amount.toString(),
      currency: currency,
      name: 'Proshop',
      description: 'Gadget Store',
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        }

        dispatch(payOrder(orderId, data))
      },
      prefill: {
        name: 'Justin',
        email: 'justin@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Crossroads, Carnival Infopark, Kochi',
      },
      theme: {
        color: '#61dafb',
      },
    }

    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const updateStatusHandler = (status) => {
    dispatch(updateOrderStatus(order._id, status))
  }

  const cancelOrderHandler = () => {
    dispatch(cancelOrder(order._id))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h3>Order {order._id}</h3>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4>Shipping</h4>
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
              <h4>Payment Method</h4>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Items</h4>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
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
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
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
              {!order.isPaid &&
                order.paymentMethod === 'card' &&
                order.status !== 'Cancelled' && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={Math.floor(order.totalPrice)}
                        onSuccess={successPaymentHandler}
                      />
                    )}
                  </ListGroup.Item>
                )}
              {!order.isPaid &&
                order.paymentMethod === 'UPI' &&
                userInfo &&
                !userInfo.isAdmin &&
                order.status !== 'Cancelled' && (
                  <ListGroup.Item>
                    <Button className='App-link' onClick={displayRazorpay}>
                      Pay ₹{Math.floor(order.totalPrice)}
                    </Button>
                  </ListGroup.Item>
                )}
              {['Shipped', 'Placed', 'Pending'].includes(order.status) &&
                userInfo &&
                !userInfo.isAdmin && (
                  <ListGroup.Item>
                    <Button onClick={() => setModal(true)}>Cancel</Button>
                  </ListGroup.Item>
                )}
              {userInfo &&
                userInfo.isAdmin &&
                ((order.isPaid && order.paymentMethod !== 'COD') ||
                  (!order.isPaid && order.paymentMethod === 'COD')) &&
                !order.isDelivered &&
                order.status !== 'Cancelled' && (
                  <ListGroup.Item>
                    <Form.Control
                      className='shadow-sm btn btn-primary '
                      as='select'
                      value={order.status}
                      onChange={(e) => {
                        updateStatusHandler(e.target.value)
                        setStatus(e.target.value)
                      }}
                    >
                      {['Pending', 'Placed', 'Shipped', 'Delivered'].map(
                        (state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        )
                      )}
                    </Form.Control>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Modal
        show={modal}
        onHide={() => setModal(false)}
        size='sm'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          <h5>Are you sure you want to Cancel?</h5>

          <Center>
            <Button
              className='mx-3'
              variant='danger'
              onClick={() => {
                cancelOrderHandler()
                setModal(false)
              }}
            >
              Yes
            </Button>
            <Button
              className='mx-3'
              variant='secondary'
              onClick={() => setModal(false)}
            >
              Cancel
            </Button>
          </Center>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default OrderScreen
