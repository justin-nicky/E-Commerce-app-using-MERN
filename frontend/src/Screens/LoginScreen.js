import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../Components/FormContainer'
import Center from '../Components/Center'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, userInfo, error } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [userInfo, redirect, history])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
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
          {/* <Form.Text className='text-muted'>
            We'll never share your email with anyone else.
          </Form.Text> */}
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
        </Form.Group>
        <Center>
          <Button variant='primary' type='submit'>
            Submit
          </Button>
        </Center>
      </Form>
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
