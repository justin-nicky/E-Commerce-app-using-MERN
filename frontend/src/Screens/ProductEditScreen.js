import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Form,
  Button,
  Container,
  Modal,
  Row,
  Col,
  Image,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import FormContainer from '../Components/FormContainer'
import Center from '../Components/Center'
import Resizer from 'react-image-file-resizer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { listCategories } from '../actions/categoryActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import { fileUploadAndResize } from '../helpers/FileUpload'
import ImageCropperModal from '../Components/ImageCropperModal'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [previewImage, setPreviewImage] = useState('/imageplaceholder.png')
  const [subImage1, setSubImage1] = useState('/imageplaceholder.png')
  const [subImage2, setSubImage2] = useState('/imageplaceholder.png')
  const [previewImageLoading, setPreviewImageLoading] = useState(false)
  const [sub1Loading, setSub1Loading] = useState(false)
  const [sub2Loading, setSub2Loading] = useState(false)
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [discount, setDiscount] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState([])
  const [modal, setModal] = useState(false)
  //   const [image, setImage] = useState(null);
  //   const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [isModal1Visible, setIsModal1Visible] = useState(false)
  const [isModal2Visible, setIsModal2Visible] = useState(false)
  const [isModal3Visible, setIsModal3Visible] = useState(false)
  const [srcImg, setSrcImg] = useState(null)
  const [result, setResult] = useState(null)
  const [files, setFiles] = useState(false)

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
    if (!product || !product.name || product._id !== productId) {
      dispatch(listProductDetails(productId))
    } else {
      setName(product.name)
      setPrice(product.price)
      if (product.previewImage !== '') {
        setPreviewImage(product.previewImage)
      }
      setBrand(product.brand)
      setCategory(product.category)
      setSubCategory(product.subCategory)
      setCountInStock(product.countInStock)
      setDescription(product.description)
      setDiscount(product.discount)
      if (product.images) {
        if (product.images.length >= 1) {
          setSubImage1(product.images[0])
        }
        if (product.images.length >= 2) {
          setSubImage2(product.images[1])
        }
      }
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
        images: [subImage1, subImage2],
        subCategory,
        brand,
        category,
        description,
        countInStock,
        discount,
      })
    )
  }

  const uploadImageHandler = async (e, setImage, setLoading) => {
    try {
      setLoading(true)
      const url = await fileUploadAndResize(e)
      setImage(url)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  const categorySelectHandler = (e) => {
    setCategory(e.target.value)
    let category = categories.filter(
      (category) => category.category === e.target.value
    )
    category = category[0].subCategory
    setSelectedCategory(category)
    if (category.length === 1) {
      setSubCategory(category[0])
    } else {
      setSubCategory('')
    }
  }

  //   const handleImage = (e) => {
  //     if (e.target.files.length > 0) {
  //       setSrcImg(URL.createObjectURL(e.target.files[0]))
  //       // console.log(e.target.files[0]);

  //       setIsModalVisible(true)
  //     }
  //   }

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
              <Form.Label>Images</Form.Label>
              <Row>
                <Col md={4}>
                  <Form.Group
                    className='mb-3 fluid'
                    onInput={(e) => {
                      //uploadImageHandler(e, setSubImage1, setSub1Loading)
                      if (e.target.files.length > 0) {
                        setSrcImg(URL.createObjectURL(e.target.files[0]))
                        // console.log(e.target.files[0]);
                        setSubImage1(e.target.files[0])
                        setIsModal1Visible(true)
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Form.Control
                      type='file'
                      accept='image/*'
                      id='imageInput1'
                      hidden
                    />
                    {sub1Loading ? (
                      <Loader />
                    ) : (
                      <Image
                        src={subImage1}
                        alt='image'
                        fluid
                        onClick={() => {
                          document.getElementById('imageInput1').click()
                        }}
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group
                    className='mb-3 fluid'
                    onInput={(e) => {
                      //   uploadImageHandler(
                      //     e,
                      //     setPreviewImage,
                      //     setPreviewImageLoading
                      //
                      if (e.target.files.length > 0) {
                        setSrcImg(URL.createObjectURL(e.target.files[0]))
                        // console.log(e.target.files[0]);

                        setIsModal2Visible(true)
                      }
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Form.Control
                      type='file'
                      accept='image/*'
                      id='imageInput2'
                      hidden
                    />
                    {previewImageLoading ? (
                      <Loader />
                    ) : (
                      <Image
                        src={previewImage}
                        alt='image'
                        fluid
                        onClick={() => {
                          document.getElementById('imageInput2').click()
                        }}
                      />
                    )}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group
                    className='mb-3 fluid'
                    onInput={(e) => {
                      if (e.target.files.length > 0) {
                        setSrcImg(URL.createObjectURL(e.target.files[0]))
                        // console.log(e.target.files[0]);
                        //set
                        setIsModal3Visible(true)
                      }
                      //uploadImageHandler(e, setSubImage2, setSub2Loading)
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Form.Control
                      type='file'
                      accept='image/*'
                      id='imageInput3'
                      hidden
                    />
                    {sub2Loading ? (
                      <Loader />
                    ) : (
                      <Image
                        src={subImage2}
                        alt='image'
                        fluid
                        onClick={() => {
                          document.getElementById('imageInput3').click()
                        }}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>
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

            <Form.Group controlId='discount'>
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter Discount Percent'
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
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
              <Col
                xs={12}
                md={8}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '50ch',
                }}
              >
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
                Discount:
              </Col>
              <Col xs={12} md={8}>
                {discount}%
              </Col>
            </Row>
            <hr />
            <Row>
              <Col xs={6} md={4}>
                Description:
              </Col>
              <Col
                xs={12}
                md={8}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '50ch',
                }}
              >
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

      <ImageCropperModal
        isModalVisible={isModal1Visible}
        setIsModalVisible={setIsModal1Visible}
        //showModal={showModal}
        srcImg={srcImg}
        setResult={setSubImage1}
        setFiles={setFiles}
      />

      <ImageCropperModal
        isModalVisible={isModal2Visible}
        setIsModalVisible={setIsModal2Visible}
        //showModal={showModal}
        srcImg={srcImg}
        setResult={setPreviewImage}
        setFiles={setFiles}
      />

      <ImageCropperModal
        isModalVisible={isModal3Visible}
        setIsModalVisible={setIsModal3Visible}
        //showModal={showModal}
        srcImg={srcImg}
        setResult={setSubImage2}
        setFiles={setFiles}
      />
    </>
  )
}
export default ProductEditScreen
