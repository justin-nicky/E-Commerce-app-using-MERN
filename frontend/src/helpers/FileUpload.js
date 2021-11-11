import React from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import store from '../store'

export const fileUploadAndResize = (e) => {
  return new Promise((resolve, reject) => {
    let file = e.target.files[0]
    const {
      userLogin: { userInfo },
    } = store.getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    if (file) {
      Resizer.imageFileResizer(
        file,
        1280,
        720,
        'JPEG',
        65,
        0,
        (uri) => {
          axios
            .post(`/api/upload`, { image: uri }, config)
            .then((res) => {
              //console.log('IMAGE UPLOAD RES DATA', res)
              resolve(res.data.url)
            })
            .catch((err) => {
              //console.log('CLOUDINARY UPLOAD ERR', err)
              reject(err)
            })
        },
        'base64'
      )
    }
  })
}
export const fileUpload = (e) => {
  return new Promise((resolve, reject) => {
    let file = e
    //.target.files[0]

    const {
      userLogin: { userInfo },
    } = store.getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    if (file) {
      axios
        .post(`/api/upload`, { image: e }, config)
        .then((res) => {
          //console.log('IMAGE UPLOAD RES DATA', res)
          resolve(res.data.url)
        })
        .catch((err) => {
          //console.log('CLOUDINARY UPLOAD ERR', err)
          reject(err)
        })
    }
  })
}
