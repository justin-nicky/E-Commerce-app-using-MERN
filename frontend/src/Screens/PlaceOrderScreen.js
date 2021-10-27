import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import CheckoutSteps from '../Components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()

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

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)

  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
      dispatch({ type: USER_DETAILS_RESET })
      dispatch({ type: ORDER_CREATE_RESET })
    }
    // eslint-disable-next-line
  }, [history, success])

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
                  <Col>₹{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>₹{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
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
