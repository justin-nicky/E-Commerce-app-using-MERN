import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Form,
  Button,
  Modal,
  InputGroup,
  FormControl,
  Row,
  Col,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../Components/FormContainer'
import CheckoutSteps from '../Components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import Center from '../Components/Center'
import {
  addressInputBlurHandler,
  addressInputChangeHandler,
} from '../Helpers/validationHelpers'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [modalShow, setModalShow] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [index, setIndex] = useState(-2)
  const [modal, setModal] = useState(false)
  const [error, setError] = useState({
    radio: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  })

  const dispatch = useDispatch()

  const continueHandler = (e) => {
    e.preventDefault()
    if (index >= 0 && index < addresses.length) {
      console.log(address, city, postalCode, country)
      dispatch(saveShippingAddress({ address, city, postalCode, country }))
      history.push('/payment')
    } else {
      setError({ ...error, radio: 'Please select an address' })
    }
  }
  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get('/api/users/address', config)
      setAddresses(data.addresses)
    } catch (error) {
      console.log(error)
    }
  }

  const submitHandler = async () => {
    //e.preventDefault()
    setModalShow(false)
    const formData = {
      address,
      city,
      postalCode,
      country,
    }
    try {
      await axios.post('/api/users/address', formData, config)
      fetchAddresses()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteHandler = async () => {
    try {
      await axios.delete(`/api/users/address/${index}`, config)
      fetchAddresses()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Center>
        <CheckoutSteps step1 step2 />
      </Center>
      <Center>
        <h3>Shipping</h3>
      </Center>
      <FormContainer>
        <Form onSubmit={continueHandler}>
          {addresses.map((address, i) => (
            <Row key={i}>
              <Col md={1}>
                <input
                  type='radio'
                  name='address'
                  value={i}
                  key={i}
                  onChange={(e) => {
                    setAddress(address.address)
                    setCity(address.city)
                    setPostalCode(address.postalCode)
                    setCountry(address.country)
                    setIndex(i)
                    setError({ ...error, radio: '' })
                  }}
                ></input>
              </Col>
              <Col md={7}>
                <div>
                  {address.address +
                    ' ' +
                    address.city +
                    ' ' +
                    address.postalCode +
                    ' ' +
                    address.country}
                </div>
              </Col>
            </Row>
          ))}
          <Button className='m-3 mt-5' type='submit'>
            Continue
          </Button>
          <span className='text-danger text-small'>{error.radio}</span>
        </Form>
        <Button
          variant='secondary'
          onClick={() => setModalShow(true)}
          className='m-3'
        >
          Add new address
        </Button>
        {address !== '' && (
          <Button
            variant='secondary'
            onClick={() => {
              setModal(true)
            }}
            className='m-3'
          >
            Delete Address
          </Button>
        )}
      </FormContainer>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            Add Address
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormContainer>
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                submitHandler()
              }}
            >
              <Form.Group controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter address'
                  value={address}
                  required
                  onChange={(e) => {
                    setAddress(e.target.value)
                    setError({
                      ...error,
                      address: addressInputChangeHandler(e.target.value),
                    })
                  }}
                  onBlur={(e) => {
                    setError({
                      ...error,
                      address: addressInputBlurHandler(e.target.value),
                    })
                  }}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='city'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter city'
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='postalCode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter postal code'
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter country'
                  value={country}
                  required
                  onChange={(e) => setCountry(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary' className='my-3'>
                Add Address
              </Button>
            </Form>
          </FormContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={(e) => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={modal}
        onHide={() => setModal(false)}
        size='sm'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          <h5>Are you sure you want to delete?</h5>

          <Center>
            <Button
              className='mx-3'
              variant='danger'
              onClick={() => {
                deleteHandler()
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

export default ShippingScreen
