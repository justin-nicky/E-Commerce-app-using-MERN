import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { GoogleLogin } from 'react-google-login'
import FormContainer from '../Components/FormContainer'
import Center from '../Components/Center'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { googleSignIn, login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState({ email: '', password: '' })

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, userInfo, error } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  const googleAuthSuccessHandler = async (res) => {
    const token = res.getAuthResponse().id_token
    dispatch(googleSignIn(token))
  }

  const googleAuthFailureHandler = (error) => {
    console.log(error)
  }

  useEffect(() => {
    if (userInfo?.isAdmin) {
      history.push('/admin')
    } else if (userInfo) {
      history.push(redirect)
    }
  }, [userInfo, redirect, history])

  const submitHandler = (e) => {
    e.preventDefault()
    if (email && password) {
      dispatch(login(email, password))
    } else {
      if (!email) {
        setErrorMessage({ ...errorMessage, email: 'Email is required' })
      }
      if (!password) {
        setErrorMessage({ ...errorMessage, password: 'Password is required' })
      }
    }
  }

  return (
    <FormContainer>
      <Form onSubmit={submitHandler}>
        <Center>
          <h2>Sign In</h2>
        </Center>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form.Group className='my-3 ' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder='Enter email'
          />
          <Form.Text className='text-danger fs-6'>
            {errorMessage.email}
          </Form.Text>
        </Form.Group>

        <Form.Group className='my-3 ' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            placeholder='Enter password'
          />
          <Form.Text className='text-danger fs-6'>
            {errorMessage.password}
          </Form.Text>
        </Form.Group>
        <Center>
          <Button variant='primary' type='submit'>
            Submit
          </Button>
        </Center>
      </Form>
      <Center>
        <Form.Text className='text-muted my-3'>
          --------------------- or ---------------------
        </Form.Text>
      </Center>
      <Center>
        <GoogleLogin
          clientId='281012013724-s56cgsgh6afak08a1r09lj3j4baef7fv.apps.googleusercontent.com'
          buttonText='Sign In With Google'
          disabled={false}
          onSuccess={googleAuthSuccessHandler}
          onFailure={googleAuthFailureHandler}
          cookiePolicy={'single_host_origin'}
        />
      </Center>
      <Row className='py-3'>
        <Col>
          New user?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : 'register'}>
            Sign Up
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
