import cloudinary from 'cloudinary'

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

// req.files.file.path
export const upload = async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: 'auto', // jpeg, png
  })
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  })
}

export const remove = (req, res) => {
  let image_id = req.body.public_id

  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err })
    res.json({ message: 'image removed' })
  })
}
