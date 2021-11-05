import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import axios from 'axios'
import { Table, Button, Row, Col, Form, Card, ListGroup } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import Center from '../Components/Center'
import FormContainer from '../Components/FormContainer'
import { createCategory, listCategories } from '../actions/categoryActions'
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants'

const CategoryManage = ({ history }) => {
  const [_category, set_category] = useState('')
  const [_subCategory, set_subCategory] = useState('')
  const [updateCouponForm, setUpdateCouponForm] = useState({
    category: '',
    discount: 0,
  })

  const dispatch = useDispatch()

  const categoryList = useSelector((state) => state.categoryList)
  const {
    loading: categoryListLoading,
    error: categoryListError,
    categories,
  } = categoryList

  const categoryCreate = useSelector((state) => state.categoryCreate)
  let {
    loading: createLoading,
    error: createError,
    success: createSuccess,
  } = categoryCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: CATEGORY_CREATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }
    if (categories.length === 0 && !categoryListLoading) {
      dispatch(listCategories())
      //createSuccess = false
    }
  }, [dispatch, history, userInfo, createSuccess, categories])

  const createCategoryHandler = () => {
    if ((_category !== _subCategory) !== '') {
      dispatch(createCategory(_category, _subCategory))
      set_category('')
      set_subCategory('')
    }
  }

  const updateCouponDiscountHandler = async () => {
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } }
    const result = await axios.put(
      `/api/categories/${updateCouponForm.category}`,
      { discount: updateCouponForm.discount },
      config
    )
    dispatch(listCategories())
  }

  return (
    <>
      <Row xs={1} md={2} className='g-4'>
        <Col md={5}>
          <Row>
            <Card>
              <Card.Body>
                <Card.Title>Add Category</Card.Title>
                {createLoading ? (
                  <Loader />
                ) : createError ? (
                  <Message variant='danger'>{createError}</Message>
                ) : (
                  <Form onSubmit={createCategoryHandler}>
                    <Form.Group controlId='category'>
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter Category'
                        value={_category}
                        onChange={(e) => set_category(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='subCagtegory'>
                      <Form.Label>Sub Category</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder='Enter subCategory'
                        value={_subCategory}
                        onChange={(e) => set_subCategory(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='m-3'>
                      Add
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Row>
          <Row className='mt-3'>
            <Card>
              <Card.Body>
                <Card.Title>Add/Update Discount</Card.Title>

                <Form onSubmit={updateCouponDiscountHandler}>
                  {categories && (
                    <Form.Group controlId='Category'>
                      <Form.Label>Category</Form.Label>
                      <select
                        aria-label='Default select example'
                        onChange={(e) => {
                          setUpdateCouponForm({
                            ...updateCouponForm,
                            category: e.target.value,
                          })
                        }}
                        className='form-control'
                      >
                        <option>{updateCouponForm.category}</option>
                        {categories.map((category) => (
                          <option
                            key={category.category}
                            value={category.category}
                          >
                            {category.category}
                          </option>
                        ))}
                      </select>
                    </Form.Group>
                  )}
                  <Form.Group controlId='discount' className='mt-3'>
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder='Enter discount percentage'
                      value={updateCouponForm.discount}
                      onChange={(e) =>
                        setUpdateCouponForm({
                          ...updateCouponForm,
                          discount: e.target.value,
                        })
                      }
                    ></Form.Control>
                  </Form.Group>

                  <Button type='submit' variant='primary' className='m-3'>
                    save
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Col>

        <Col md={7}>
          <Card>
            <Card.Body>
              <Card.Title>Category</Card.Title>
              <Table bordered responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>Categories</th>
                    <th>Discount</th>
                    <th>Sub Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.category}</td>
                      <td>{category.discount}%</td>
                      <td>
                        <ListGroup variant='flush'>
                          {category.subCategory.map((sub) => (
                            <ListGroup.Item key={sub}>{sub}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CategoryManage
