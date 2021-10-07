import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../Components/FormContainer'
import Center from '../Components/Center'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import {
  nameInputChangeHandler,
  nameInputBlurHandler,
  emailInputBlurHandler,
  emailInputChangeHandler,
  passwordInputBlurHandler,
  passwordInputChangeHandler,
} from '../helpers/validationHelpers'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameError, setNameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)

  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, userInfo, error } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [userInfo, redirect, history])

  const submitHandler = (e) => {
    e.preventDefault()
    setNameError(nameInputBlurHandler(name))
    setEmailError(emailInputBlurHandler(email))
    setPasswordError(passwordInputBlurHandler(password))
    if (!password == confirmPassword) {
      setPasswordError('Passwords do not match')
    } else if (
      !nameError &&
      !emailError &&
      !passwordError &&
      name !== '' &&
      password !== '' &&
      email !== '' &&
      name !== null &&
      password !== null &&
      email !== null
    ) {
      dispatch(register(name, email, password))
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

        <Form.Group className='my-3 ' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(nameInputChangeHandler(e.target.value))
            }}
            onBlur={(e) => {
              setNameError(nameInputBlurHandler(e.target.value, nameError))
            }}
            placeholder='Enter name'
          />
          <Form.Text className='text-danger fs-6'>
            {nameError && nameError}
          </Form.Text>
        </Form.Group>

        <Form.Group className='my-3 ' controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError(emailInputChangeHandler(e.target.value, emailError))
            }}
            onBlur={(e) => {
              setEmailError(emailInputBlurHandler(e.target.value))
            }}
            placeholder='Enter email'
          />
          <Form.Text className='text-danger fs-6'>
            {emailError && emailError}
          </Form.Text>
        </Form.Group>

        <Form.Group className='my-3 ' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError(passwordInputChangeHandler(e.target.value))
            }}
            onBlur={(e) => {
              setPasswordError(passwordInputBlurHandler(e.target.value))
            }}
            placeholder='Enter password'
          />
          <Form.Text className='text-danger fs-6'>
            {passwordError && passwordError}
          </Form.Text>
        </Form.Group>

        <Form.Group className='my-3 ' controlId='confirmPasswrod'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
            }}
            placeholder='Re-enter password'
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
          Already a user?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : 'login'}>
            Sign In
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
