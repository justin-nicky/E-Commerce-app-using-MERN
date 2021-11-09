import React, { useEffect, useState } from 'react'
import { Card, Form, Button, Row, Col, Table, Modal } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import {
  createCoupon,
  listCoupons,
  deleteCoupon,
} from '../actions/couponActions'
import { COUPON_ADD_RESET } from '../constants/couponsConstants'
import Loader from '../Components/Loader'
import Message from '../Components/Message'
import Center from '../Components/Center'
import {
  nameInputBlurHandler,
  nameInputChangeHandler,
  percentageInputBlurHandler,
  percentageInputChangeHandler,
} from '../helpers/validationHelpers'

const CouponManage = () => {
  const [modal, setModal] = useState({ code: null, show: false })
  // error message states
  const [errorCouponCode, setErrorCouponCode] = useState('')
  const [errorDiscountPercentage, setErrorDiscountPercentage] = useState('')
  const [errorDate, setErrorDate] = useState('')

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const couponList = useSelector((state) => state.couponList)
  const {
    loading: couponListLoading,
    error: couponListError,
    success: couponListSuccess,
    coupons,
  } = couponList

  const couponCreate = useSelector((state) => state.couponCreate)
  const {
    success: couponCreateSuccess,
    loading: couponCreateLoading,
    error: couponCreateError,
  } = couponCreate

  const couponDelete = useSelector((state) => state.couponDelete)
  const {
    success: couponDeleteSuccess,
    loading: couponDeleteLoading,
    error: couponDeleteError,
  } = couponDelete

  const [formData, setFormData] = useState({
    code: '',
    discount: 0,
    expiryDate: '',
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(listCoupons())
    dispatch({ type: COUPON_ADD_RESET })
  }, [couponCreateSuccess, couponDeleteSuccess])

  const addCouponHandler = (e) => {
    e.preventDefault()
    nameInputBlurHandler(formData.code, setErrorCouponCode)
    percentageInputBlurHandler(formData.discount, setErrorDiscountPercentage)
    if (formData.expiryDate === '') {
      setErrorDate('Expiry date is required')
    } else {
      dispatch(createCoupon(formData))
    }
  }

  const deleteCouponHandler = (code) => {
    dispatch(deleteCoupon(code))
  }

  return (
    <>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Add Coupon</Card.Title>
              {couponCreateError && (
                <Message variant='danger'>{couponCreateError}</Message>
              )}
              <Form>
                <Form.Group className='mb-3' controlId='formBasicName'>
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type='name'
                    required
                    placeholder='Enter Code'
                    onChange={(e) => {
                      setFormData({ ...formData, code: e.target.value })
                      nameInputChangeHandler(e.target.value, setErrorCouponCode)
                    }}
                    onBlur={(e) => {
                      nameInputBlurHandler(e.target.value, setErrorCouponCode)
                    }}
                  />
                  <span className='text-danger'>{errorCouponCode}</span>
                </Form.Group>

                <Form.Group className='mb-3' controlId='formBasicNumber'>
                  <Form.Label>Discount Percentage</Form.Label>
                  <Form.Control
                    type='Number'
                    required
                    placeholder='Discount'
                    value={formData.discount}
                    onChange={(e) => {
                      setFormData({ ...formData, discount: e.target.value })
                      percentageInputChangeHandler(
                        e.target.value,
                        setErrorDiscountPercentage
                      )
                    }}
                    onBlur={(e) => {
                      percentageInputBlurHandler(
                        e.target.value,
                        setErrorDiscountPercentage
                      )
                    }}
                  />
                  <span className='text-danger'>{errorDiscountPercentage}</span>
                </Form.Group>
                <Form.Group className='mb-3' controlId='formBasicDate'>
                  <Form.Label>Expiry Date: </Form.Label>
                  <input
                    type='datetime-local'
                    required
                    min={new Date().toISOString().split('.')[0]}
                    className='mx-3 '
                    onChange={(e) => {
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }}
                  ></input>
                  <span className='text-danger'>{errorDate}</span>
                </Form.Group>
                <Button
                  variant='primary'
                  type='submit'
                  onClick={addCouponHandler}
                >
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <h3>Coupons</h3>
          {couponListLoading ? (
            <Loader />
          ) : couponListError ? (
            <Message variant='danger'>{couponListError}</Message>
          ) : (
            <Table striped bordered hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>CODE</th>
                  <th>DISCOUNT</th>
                  <th>EXPIRY DATE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.code}>
                    <td>{coupon.code}</td>
                    <td>{coupon.discount}%</td>
                    <td>{coupon.expiryDate.substring(0, 10)}</td>

                    <td>
                      <Button
                        variant='light'
                        onClick={() => {
                          setModal({
                            show: true,
                            code: coupon.code,
                          })
                        }}
                      >
                        <i
                          className='fas fa-times'
                          style={{ color: 'red' }}
                        ></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      <Modal
        show={modal.show}
        onHide={() => setModal({ ...modal, show: false })}
        size='sm'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          <h5>Are you sure you want to delete {modal.code}?</h5>

          <Center>
            <Button
              className='mx-3'
              variant='danger'
              onClick={() => {
                deleteCouponHandler(modal.code)
                setModal({ show: false, name: null })
              }}
            >
              Yes
            </Button>
            <Button
              className='mx-3'
              variant='secondary'
              onClick={() => setModal({ show: false, name: null })}
            >
              Cancel
            </Button>
          </Center>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CouponManage
