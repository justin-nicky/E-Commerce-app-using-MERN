import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import Message from '../Components/Message'
import CheckoutSteps from '../Components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import { clearCartItems } from '../actions/cartActions'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

  const [couponFromUser, setCouponFromUser] = useState('')
  const [couponFromServer, setCouponFromServer] = useState({})
  const [showCouponForm, setShowCouponForm] = useState(true)
  const [couponError, setCouponError] = useState('')
  //const [discount, setDiscount] = useState(0)

  const cart = useSelector((state) => state.cart)

  if (!cart.shippingAddress.address) {
    history.push('/shipping')
  } else if (!cart.paymentMethod) {
    history.push('/payment')
  }
  //   Calculate prices
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  cart.discount = cart.cartItems.reduce((acc, item) => {
    let price = Math.max(
      (item.price * item.discount) / 100,
      (item.price * item.categoryDiscount1) / 100
    )
    return acc + item.qty * price
  }, 0)

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice) -
    Number(cart.discount)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [crt, setCrt] = useState({
    discount: cart.discount,
    itemsPrice: cart.itemsPrice,
    totalPrice: cart.totalPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
  })

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line
  }, [history, success, crt])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    )
    dispatch(clearCartItems())
  }

  const verifyCouponHandler = async (e) => {
    e.preventDefault()
    if (couponFromUser !== '') {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
        const { data } = await axios.get(
          `/api/coupons/${couponFromUser}`,
          config
        )
        if (data) {
          setCouponFromServer(data.coupon)
          setCouponError('')
          setShowCouponForm(false)

          if (crt.discount < (data.coupon.discount * crt.itemsPrice) / 100) {
            //cart.discount = (couponFromServer.discount * cart.itemsPrice) / 100
            let discount = (data.coupon.discount * crt.itemsPrice) / 100
            let totalPrice = crt.totalPrice - crt.discount + discount
            setCrt({ ...crt, discount, totalPrice })
          }
        }
      } catch (error) {
        setCouponFromServer({})
        setShowCouponForm(true)
        setCouponError('Invalid Coupon')
      }
    } else {
      setCouponError('Please enter a coupon code')
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Payment Method</h4>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h4>Order Items</h4>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                          {item.qty} x ₹{' '}
                          {Math.min(
                            item.price - (item.price * item.discount) / 100,
                            item.price -
                              (item.price * item.categoryDiscount1) / 100
                          )}{' '}
                          = ₹
                          {item.qty *
                            Math.min(
                              item.price - (item.price * item.discount) / 100,
                              item.price -
                                (item.price * item.categoryDiscount1) / 100
                            )}
                        </Col>
                        {/* )} */}
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
                  <Col>₹{crt.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Discount</Col>
                  <Col>- ₹{crt.discount}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{crt.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{crt.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{crt.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {showCouponForm ? (
                  <Form>
                    <Form.Group className='mb-3' controlId='formBasicName'>
                      <Form.Label>Do you have a coupon?</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter coupon'
                        onChange={(e) => {
                          setCouponFromUser(e.target.value)
                        }}
                      />
                      <span className='text-danger'>{couponError}</span>
                    </Form.Group>
                    <Button
                      variant='secondary'
                      type='submit'
                      onClick={verifyCouponHandler}
                    >
                      Apply
                    </Button>
                  </Form>
                ) : (
                  <>
                    {crt.discount >
                    (couponFromServer.discount * crt.itemsPrice) / 100 ? (
                      <>
                        <Message> You already have the best price </Message>
                      </>
                    ) : (
                      <>
                        <Message variant='success'> Coupon Applied </Message>
                      </>
                    )}
                  </>
                )}
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  {' '}
                  <Message variant='danger'>{error}</Message>{' '}
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen

// import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
// import { useDispatch, useSelector } from 'react-redux'
// import Message from '../Components/Message'
// import CheckoutSteps from '../Components/CheckoutSteps'
// import { createOrder } from '../actions/orderActions'
// // import { ORDER_CREATE_RESET } from '../constants/orderConstants'
// // import { USER_DETAILS_RESET } from '../constants/userConstants'

// const PlaceOrderScreen = ({ history }) => {
//   const dispatch = useDispatch()

//   const cart = useSelector((state) => state.cart)

//   if (!cart.shippingAddress.address) {
//     history.push('/shipping')
//   } else if (!cart.paymentMethod) {
//     history.push('/payment')
//   }

//   cart.itemsPrice = cart.cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   )

//   cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 100
//   cart.taxPrice = Number(0.18 * cart.itemsPrice)
//   cart.totalPrice =
//     Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)

//   const orderCreate = useSelector((state) => state.orderCreate)
//   const { order, success, error } = orderCreate

//   useEffect(() => {
//     if (success) {
//       history.push(`/order/${order._id}`)
//       // dispatch({ type: USER_DETAILS_RESET })
//       // dispatch({ type: ORDER_CREATE_RESET })
//     }
//     // eslint-disable-next-line
//   }, [history, success])

//   const placeOrderHandler = () => {
//     dispatch(
//       createOrder({
//         orderItems: cart.cartItems,
//         shippingAddress: cart.shippingAddress,
//         paymentMethod: cart.paymentMethod,
//         itemsPrice: cart.itemsPrice,
//         shippingPrice: cart.shippingPrice,
//         taxPrice: cart.taxPrice,
//         totalPrice: cart.totalPrice,
//       })
//     )
//   }

//   return (
//     <>
//       <CheckoutSteps step1 step2 step3 step4 />
//       <Row>
//         <Col md={8}>
//           <ListGroup variant='flush'>
//             <ListGroup.Item>
//               <h3>Shipping</h3>
//               <p>
//                 <strong>Address:</strong>
//                 {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
//                 {cart.shippingAddress.postalCode},{' '}
//                 {cart.shippingAddress.country}
//               </p>
//             </ListGroup.Item>

//             <ListGroup.Item>
//               <h3>Payment Method</h3>
//               <strong>Method: </strong>
//               {cart.paymentMethod}
//             </ListGroup.Item>

//             <ListGroup.Item>
//               <h3>Order Items</h3>
//               {cart.cartItems.length === 0 ? (
//                 <Message>Your cart is empty</Message>
//               ) : (
//                 <ListGroup variant='flush'>
//                   {cart.cartItems.map((item, index) => (
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
//                 <h>Order Summary</h>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Items</Col>
//                   <Col>₹{cart.itemsPrice >> 0}</Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Shipping</Col>
//                   <Col>₹{cart.shippingPrice >> 0}</Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Tax</Col>
//                   <Col>₹{cart.taxPrice >> 0}</Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Row>
//                   <Col>Total</Col>
//                   <Col>₹{cart.totalPrice >> 0}</Col>
//                 </Row>
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 {error && <Message variant='danger'>{error}</Message>}
//               </ListGroup.Item>
//               <ListGroup.Item>
//                 <Button
//                   type='button'
//                   className='btn-block'
//                   disabled={cart.cartItems === 0}
//                   onClick={placeOrderHandler}
//                 >
//                   Place Order
//                 </Button>
//               </ListGroup.Item>
//             </ListGroup>
//           </Card>
//         </Col>
//       </Row>
//     </>
//   )
// }

// export default PlaceOrderScreen
