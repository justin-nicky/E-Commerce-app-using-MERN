import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { fileUploadAndResize } from '../helpers/FileUpload'
import {
  getOrderDetails,
  payOrder,
  //deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  //ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  // const orderDeliver = useSelector((state) => state.orderDeliver)
  // const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  //if (!loading) {
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const itemsPrice = order?.orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )
  //}

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

    if (
      !order ||
      successPay ||
      // || successDeliver
      order._id !== orderId
    ) {
      dispatch({ type: ORDER_PAY_RESET })
      //dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [
    dispatch,
    orderId,
    successPay,
    //successDeliver,
    order,
  ])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    //dispatch(deliverOrder(order))
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
                <Message variant='success'>Paid on {order.paidAt}</Message>
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
                          {item.qty} x ${item.price} = ${item.qty * item.price}
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
              {!order.isPaid && order.paymentMethod !== 'COD' && (
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
              {/* {loadingDeliver && <Loader />} */}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen

// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { PayPalButton } from 'react-paypal-button-v2'
// import axios from 'axios'
// import { Form, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
// import { useDispatch, useSelector } from 'react-redux'
// import Message from '../Components/Message'
// import Loader from '../Components/Loader'
// import {
//   getOrderDetails,
//   payOrder,
//   updateOrderStatus,
// } from '../actions/orderActions'
// // import { ORDER_CREATE_RESET } from '../constants/orderConstants'
// // import { USER_DETAILS_RESET } from '../constants/userConstants'
// import { ORDER_UPDATE_STATUS_RESET } from '../constants/orderConstants'
// import { ORDER_PAY_RESET } from '../constants/orderConstants'

// const OrderScreen = ({ match }) => {
//   const orderId = match.params.id
//   const dispatch = useDispatch()

//   const [sdkReady, setSdkReady] = useState(false)

//   const orderDetails = useSelector((state) => state.orderDetails)
//   const { order, loading, error } = orderDetails

//   const userLogin = useSelector((state) => state.userLogin)
//   const { userInfo } = userLogin

//   const orderPay = useSelector((state) => state.orderPay)
//   const { loading: loadingPay, success: successPay } = orderPay

//   const orderUpdateStatus = useSelector((state) => state.orderUpdateStatus)
//   const {
//     success: updateStatusSuccess,
//     loading: updateStatusLoading,
//     error: updateStatusError,
//   } = orderUpdateStatus

//   //if (!loading) {
//   //   Calculate prices

//   const itemsPrice = order?.orderItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   )

//   // }

//   useEffect(() => {
//     const addPaypalScript = async () => {
//       const { data: clientId } = await axios.get('/api/config/paypal')
//       const script = document.createElement('script')
//       script.type = 'text/javascript'
//       script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`
//       script.async = true
//       script.onload = () => {
//         setSdkReady(true)
//         console.log('button added')
//       }
//       document.body.appendChild(script)
//     }
//     // if (!order || order._id !== orderId || order.status === 'Delivered') {
//     //   dispatch({ type: ORDER_UPDATE_STATUS_RESET })
//     //   dispatch(getOrderDetails(orderId))
//     // }
//     if (!order || successPay) {
//       dispatch({ type: ORDER_PAY_RESET })
//       dispatch(getOrderDetails(orderId))
//     } else if (!order.isPaid) {
//       if (!window.paypal) {
//         addPaypalScript()
//       } else {
//         setSdkReady(true)
//       }
//     }
//   }, [dispatch, successPay, orderId, order])

//   const updateStatusHandler = (status) => {
//     dispatch(updateOrderStatus(order._id, status))
//   }

//   const successPaymentHandler = (paymentResult) => {
//     console.log(paymentResult)
//     dispatch(payOrder(orderId, paymentResult))
//   }

//   return loading ? (
//     <Loader />
//   ) : error ? (
//     <Message variant='danger'>{error}</Message>
//   ) : (
//     <>
//       <Row>
//         <Col md={8}>
//           <ListGroup variant='flush'>
//             <ListGroup.Item>
//               <h3>Shipping</h3>
//               <p>
//                 <strong>Name: </strong> {order.user.name}
//               </p>
//               <p>
//                 <strong>Email: </strong>{' '}
//                 <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
//               </p>
//               <p>
//                 <strong>Address:</strong>
//                 {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
//                 {order.shippingAddress.postalCode},{' '}
//                 {order.shippingAddress.country}
//               </p>
//               <Message variant='secondary'>{order.status}</Message>
//             </ListGroup.Item>

//             <ListGroup.Item>
//               <h3>Payment Method</h3>
//               <p className='mb-3'>
//                 <strong>Method: </strong>
//                 {order.paymentMethod}
//               </p>
//               {order.isPaid ? (
//                 <Message variant='success'>Paid on {order.paidAt}</Message>
//               ) : (
//                 <Message variant='secondary'>Not Paid</Message>
//               )}
//             </ListGroup.Item>

//             <ListGroup.Item>
//               <h3>Order Items</h3>
//               {order.orderItems.length === 0 ? (
//                 <Message>order is empty</Message>
//               ) : (
//                 <ListGroup variant='flush'>
//                   {order.orderItems.map((item, index) => (
//                     <ListGroup.Item key={index}>
//                       <Row>
//                         <Col md={1}>
//                           <Image
//                             src={item.image}
//                             alt={item.name}
//                             fluid
//                             rounded
//                           />
//                         </Col>
//                         <Col>
//                           <Link to={`/product/${item.product}`}>
//                             {item.name}
//                           </Link>
//                         </Col>
//                         <Col md={4}>
//                           {item.qty} x ₹{item.price >> 0} = ₹
//                           {(item.qty * item.price) >> 0}
//                         </Col>
//                       </Row>
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>
//               )}
//             </ListGroup.Item>
//           </ListGroup>
//         </Col>
//         <Col md={4}>
//           <Card>
//             <ListGroup variant='flush'>
//               <ListGroup.Item>
//                 <h4>Order Summary</h4>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Items</Col>
//                   <Col>₹{itemsPrice >> 0}</Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Shipping</Col>
//                   <Col>₹{order.shippingPrice >> 0}</Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Tax</Col>
//                   <Col>₹{order.taxPrice >> 0}</Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>
//                     <strong>Total</strong>
//                   </Col>
//                   <Col>
//                     <strong>₹{order.totalPrice >> 0}</strong>
//                   </Col>
//                 </Row>
//               </ListGroup.Item>

//               {!order.isPaid && (
//                 <ListGroup.Item>
//                   {loadingPay || !sdkReady ? (
//                     <Loader />
//                   ) : (
//                     <PayPalButton
//                       amount={Math.floor(order.totalPrice)}
//                       onSuccess={successPaymentHandler}
//                     />
//                   )}
//                 </ListGroup.Item>
//               )}

//               {userInfo &&
//                 userInfo.isAdmin &&
//                 order.status !== ('Delivered' || 'Cancelled') && (
//                   <Form.Control
//                     className='shadow-sm btn btn-primary '
//                     as='select'
//                     value={order.status}
//                     onChange={(e) => {
//                       updateStatusHandler(e.target.value)
//                     }}
//                   >
//                     {['Placed', 'Shipped', 'Delivered'].map((state) => (
//                       <option key={state} value={state}>
//                         {state}
//                       </option>
//                     ))}
//                   </Form.Control>
//                 )}
//             </ListGroup>
//           </Card>
//         </Col>
//       </Row>
//     </>
//   )
// }

// export default OrderScreen
