import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Modal, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import FormContainer from '../Components/FormContainer'
import Center from '../Components/Center'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { listCategories } from '../actions/categoryActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [previewImage, setPreviewImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  //const [subShow, setSubShow] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState([])
  const [modal, setModal] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  const categoryList = useSelector((state) => state.categoryList)
  const {
    loading: categoryListLoading,
    error: categoryListError,
    categories,
  } = categoryList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    dispatch(listCategories())
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/manageproducts')
    }
    //else {
    if (!product.name || product._id !== productId) {
      dispatch(listProductDetails(productId))
    } else {
      setName(product.name)
      setPrice(product.price)
      setPreviewImage(product.previewImage)
      setBrand(product.brand)
      setCategory(product.category)
      setSubCategory(product.subCategory)
      setCountInStock(product.countInStock)
      setDescription(product.description)
    }
    //}
  }, [dispatch, history, productId, product, successUpdate, userInfo])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setPreviewImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = () => {
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        previewImage,
        images: [],
        subCategory,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  const categorySelectHandler = (e) => {
    setCategory(e.target.value)
    let category = categories.filter(
      (category) => category.category === e.target.value
    )
    category = category[0].subCategory
    setSelectedCategory(category)
  }
  return (
    <>
      <Link to='/admin/manageproducts' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h3>Edit Product</h3>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
              ></Form.Control>
              <Form.File
                className='custom-file-input'
                id='image-file'
                custom
                accept='image/*'
                onChange={uploadFileHandler}
              ></Form.File>

              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter countInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Category</Form.Label>
              <select
                aria-label='Default select example'
                onChange={categorySelectHandler}
                className='form-control'
              >
                <option>{category}</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Sub-category</Form.Label>
              <select
                aria-label='Default select example'
                onChange={(e) => {
                  setSubCategory(e.target.value)
                }}
                className='form-control'
              >
                <option>{subCategory}</option>
                {selectedCategory.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Form.Group>

            <Center>
              <Button
                type='submit'
                variant='primary'
                className='m-3'
                onClick={() => {
                  setModal(true)
                }}
              >
                Update
              </Button>
            </Center>
          </Form>
        )}
      </FormContainer>

      {/* //////////////modal///////////// */}
      <Modal
        show={modal}
        onHide={() => setModal(false)}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          <Container>
            <Row>
              <Col xs={6} md={4}>
                Name:
              </Col>
              <Col xs={12} md={8}>
                {name}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Price:
              </Col>
              <Col xs={12} md={8}>
                {price}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Image:
              </Col>
              <Col xs={12} md={8}>
                {previewImage}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Brand:
              </Col>
              <Col xs={12} md={8}>
                {brand}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Count In Stock:
              </Col>
              <Col xs={12} md={8}>
                {countInStock}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Description:
              </Col>
              <Col xs={12} md={8}>
                {description}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Category:
              </Col>
              <Col xs={12} md={8}>
                {category}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Sub-Category:
              </Col>
              <Col xs={12} md={8}>
                {subCategory}
              </Col>
            </Row>
            <hr />
          </Container>
          <Center>
            <h5 className='pb-2'>Are you sure you want to save?</h5>
          </Center>
          <Center>
            <Button
              className='mx-3'
              variant='primary'
              onClick={() => {
                //toggleEnableDisable(modal.id, modal.disable)
                submitHandler()
                setModal(false)
              }}
            >
              Save
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

export default ProductEditScreen
