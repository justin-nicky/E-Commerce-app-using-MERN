import React, { useEffect, useState } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
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
    // if (createSuccess) {
    dispatch(listCategories())
    //createSuccess = false
    // }
  }, [dispatch, history, userInfo, createSuccess])

  const createCategoryHandler = () => {
    if ((_category !== _subCategory) !== '') {
      dispatch(createCategory(_category, _subCategory))
      set_category('')
      set_subCategory('')
    }
  }

  return (
    <>
      <Row xs={1} md={2} className='g-4'>
        <Col>
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
        </Col>

        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Category</Card.Title>
              <Table bordered responsive className='table-sm'>
                <thead>
                  <tr>
                    <th>Categories</th>
                    <th>Sub Categories</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.category}</td>

                      <td>
                        <ListGroup variant='flush'>
                          {category.subCategory.map((sub) => (
                            <ListGroup.Item>{sub}</ListGroup.Item>
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
