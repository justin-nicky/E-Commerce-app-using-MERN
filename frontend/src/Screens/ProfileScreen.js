import React, { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col, Image } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import { fileUploadAndResize } from '../helpers/FileUpload'
import {
  nameInputChangeHandler,
  nameInputBlurHandler,
  emailInputChangeHandler,
  emailInputBlurHandler,
  passwordInputBlurHandler,
} from '../helpers/validationHelpers'

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [profileImage, setProfileImage] = useState('user2.png')
  const [profileImageLoading, setProfileImageLoading] = useState(false)
  // error message states
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderListProfile = useSelector((state) => state.orderListProfile)
  const {
    loading: loadingOrders,
    error: errorOrders,
    orders,
  } = orderListProfile

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
        if (user.profileImage !== '') {
          setProfileImage(user.profileImage)
        }
      }
    }
  }, [
    dispatch,
    history,
    userInfo,
    user,
    //success
  ])

  const submitHandler = (e) => {
    e.preventDefault()
    nameInputBlurHandler(name, setNameError)
    emailInputBlurHandler(email, setEmailError)
    if (password !== '') {
      passwordInputBlurHandler(password, setPasswordError)
      passwordInputBlurHandler(confirmPassword, setConfirmPasswordError)
    } else {
      setPasswordError('')
      setConfirmPasswordError('')
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
    } else if (
      nameError === '' &&
      emailError === '' &&
      passwordError === '' &&
      confirmPasswordError === ''
    ) {
      dispatch(
        updateUserProfile({ id: user._id, name, email, password, profileImage })
      )
    }
  }

  const uploadImageHandler = async (e) => {
    try {
      setProfileImageLoading(true)
      const url = await fileUploadAndResize(e)
      setProfileImage(url)
      setProfileImageLoading(false)
    } catch (error) {
      console.log(error)
      setProfileImage(false)
    }
  }

  return (
    <Row>
      <Col md={3}>
        <Row>
          <h2>User Profile</h2>
          {message && <Message variant='danger'>{message}</Message>}
          {success && <Message variant='success'>Profile Updated</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group
                className='mb-3 fluid'
                onInput={(e) => {
                  uploadImageHandler(e)
                }}
                style={{
                  cursor: 'pointer',
                }}
              >
                <Form.Control
                  type='file'
                  accept='image/*'
                  id='imageInput'
                  hidden
                />
                {profileImageLoading ? (
                  <Loader />
                ) : (
                  <Image
                    src={profileImage}
                    alt='image'
                    rounded
                    fluid
                    onClick={() => {
                      document.getElementById('imageInput').click()
                    }}
                  />
                )}
              </Form.Group>

              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='name'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    nameInputChangeHandler(e.target.value, setNameError)
                  }}
                  onBlur={(e) => {
                    nameInputBlurHandler(e.target.value, setNameError)
                  }}
                ></Form.Control>
                <span className='text-danger'>{nameError}</span>
              </Form.Group>

              <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    emailInputChangeHandler(e.target.value, setEmailError)
                  }}
                  onBlur={(e) => {
                    emailInputBlurHandler(e.target.value, setEmailError)
                  }}
                ></Form.Control>
                <span className='text-danger'>{emailError}</span>
              </Form.Group>

              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                ></Form.Control>
                <span className='text-danger'>{passwordError}</span>
              </Form.Group>

              <Form.Group controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                  }}
                ></Form.Control>
                <span className='text-danger'>{confirmPasswordError}</span>
              </Form.Group>

              <Button type='submit' variant='primary' className='m-2 '>
                Update
              </Button>
            </Form>
          )}
        </Row>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message variant='danger'>{errorOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>STATUS</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>₹{order.totalPrice >> 0}</td>
                  <td>
                    {order.isPaid ? (
                      <i
                        className='fas fa-check'
                        style={{ color: 'green' }}
                      ></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>{order.status}</td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default ProfileScreen
