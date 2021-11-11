import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import Center from './Center'

import { fileUpload } from '../helpers/FileUpload'

function ImageCropperModal({
  isModalVisible,
  setIsModalVisible,
  setFiles,
  srcImg,
  setResult,
}) {
  //save the image that used to be crop
  const [image, setImage] = useState(null)
  //change the aspect ratio of crop tool as you preferred
  const [crop, setCrop] = useState({ aspect: 1 / 1 })

  const handleOk = async () => {
    await getCroppedImg()
    setFiles(true)
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const uploadImageHandler = async (e, setImage, setLoading) => {
    try {
      const url = await fileUpload(e)
      setImage(url)
    } catch (error) {
      console.log(error)
    }
  }

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement('canvas')
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      var originWidth = crop.width * scaleX
      var originHeight = crop.height * scaleY
      // maximum width/height
      var maxWidth = 12000,
        maxHeight = 12000 / (1 / 1)
      var targetWidth = originWidth,
        targetHeight = originHeight
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          targetWidth = maxWidth
          targetHeight = Math.round(maxWidth * (originHeight / originWidth))
        } else {
          targetHeight = maxHeight
          targetWidth = Math.round(maxHeight * (originWidth / originHeight))
        }
      }
      // set canvas size
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        targetWidth,
        targetHeight
      )

      const base64Image = canvas.toDataURL('image/jpeg', 1)

      setResult(base64Image)
      uploadImageHandler(base64Image, setResult)
    } catch (e) {
      console.log('crop the image')
    }
  }

  return (
    <>
      <Modal
        show={isModalVisible}
        onHide={() => setIsModalVisible(false)}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
      >
        <Modal.Body className='m-2'>
          {srcImg && (
            <div className='text-center'>
              <ReactCrop
                style={{ maxWidth: '50%' }}
                src={srcImg}
                onImageLoaded={setImage}
                crop={crop}
                onChange={setCrop}
              />
              <div className='p-3'></div>
            </div>
          )}

          <Center>
            <Button className='mx-3' variant='primary' onClick={handleOk}>
              Save
            </Button>
            <Button className='mx-3' variant='secondary' onClick={handleCancel}>
              Cancel
            </Button>
          </Center>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ImageCropperModal
