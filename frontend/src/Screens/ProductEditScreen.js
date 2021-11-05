import axios from 'axios'
import React, { useState, useEffect, useCallback } from 'react'
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
import ReactCrop from 'react-image-crop'
import Cropper from 'react-easy-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Message from '../Components/Message'
import Loader from '../Components/Loader'
import FormContainer from '../Components/FormContainer'
import Center from '../Components/Center'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { listCategories } from '../actions/categoryActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import { fileUploadAndResize } from '../helpers/FileUpload'

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
  const [crop1, setCrop1] = useState({ aspect: 1 / 1 })
  const [crop2, setCrop2] = useState({ aspect: 1 / 1 })
  const [crop3, setCrop3] = useState({ aspect: 1 / 1 })
  const [cropping1, setCropping1] = useState(false)
  const [cropping2, setCropping2] = useState(false)
  const [cropping3, setCropping3] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

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

  // const uploadFileHandler = async (e) => {
  //   const file = e.target.files[0]
  //   const formData = new FormData()
  //   formData.append('image', file)
  //   setUploading(true)

  //   try {
  //     const config = {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }

  //     const { data } = await axios.post('/api/upload', formData, config)

  //     setPreviewImage(data)
  //     setUploading(false)
  //   } catch (error) {
  //     console.error(error)
  //     setUploading(false)
  //   }
  // }

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }, [])

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

  const getCroppedImg = (image, crop, setImage) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    // New lines to be added
    const pixelRatio = window.devicePixelRatio
    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = 'high'

    console.log(crop)

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    // As Base64 string
    //const base64Image = canvas.toDataURL('image/jpeg')

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = Date.now()
          resolve(blob)
          setImage(blob)
        },
        'image/jpeg',
        1
      )
    })
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
              <Form.Label>Images</Form.Label>
              <Row>
                <Col md={4}>
                  {/* <Form.Group
                    className='mb-3 fluid'
                    onInput={(e) => {
                      console.log(URL.createObjectURL(e.target.files[0]))
                      setSubImage1(URL.createObjectURL(e.target.files[0]))
                      //uploadImageHandler(e, setSubImage1, setSub1Loading)
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
                      <>
                        {cropping1 ? (
                          <ReactCrop
                            src={subImage1}
                            crop={crop1}
                            onChange={(newCrop) => setCrop1(newCrop)}
                          />
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
                        <Button className='m-1'>Upload</Button>

                        {cropping1 ? (
                          <Button
                            className='m-1'
                            onClick={() => {
                              setCropping1(false)
                              getCroppedImg(subImage1, crop1, setSubImage1)
                            }}
                          >
                            Done
                          </Button>
                        ) : (
                          <Button
                            className='m-1'
                            onClick={() => {
                              setCropping1(true)
                            }}
                          >
                            Crop
                          </Button>
                        )}
                      </>
                    )}
                  </Form.Group> */}
                </Col>
                <Col md={4} style={{ position: 'relative' }}>
                  {/* Row */}
                  <Form.Group
                    className='mb-3 fluid'
                    onInput={(e) => {
                      uploadImageHandler(
                        e,
                        setPreviewImage,
                        setPreviewImageLoading
                      )
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
                      <>
                        {cropping2 ? (
                          <Cropper
                            image={previewImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1 / 1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                          />
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
                      </>
                    )}
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group
                    className='mb-3 fluid'
                    onInput={(e) => {
                      uploadImageHandler(e, setSubImage2, setSub2Loading)
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
              <Row>
                <Col md={4}></Col>
                <Col md={4}>
                  <Button className='m-1'>Upload</Button>

                  {cropping2 ? (
                    <Button
                      className='m-1'
                      onClick={() => {
                        setCropping2(false)
                        //getCroppedImg(subImage1, crop1, setSubImage1)
                      }}
                    >
                      Done
                    </Button>
                  ) : (
                    <Button
                      className='m-1'
                      onClick={() => {
                        setCropping2(true)
                      }}
                    >
                      Crop
                    </Button>
                  )}
                </Col>
                <Col md={4}></Col>
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
    </>
  )
}
export default ProductEditScreen
