import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, 'public/uploads/')
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		)
	},
})

function checkFileType(file, cb) {
	const fileTypes = /jpg|jpeg|png|webp/
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
	const mimetype = fileTypes.test(file.mimetype)

	if (extname && mimetype) {
		return cb(null, true)
	} else {
		cb('Please upload a file of image type')
	}
}

const upload = multer({
	storage,
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb)
	},
})

router.post('/profile', upload.single('profile'), function (req, res) {
	res.json({
		success: true,
		data: `/${req.file.path}`.split('/').splice(2, 3).join('/'),
	})
})
router.post('/cover', upload.single('cover'), function (req, res) {
	res.json({
		success: true,
		data: `/${req.file.path}`.split('/').splice(2, 3).join('/'),
	})
})

router.post('/post', upload.single('post'), function (req, res) {
	res.json({
		success: true,
		// data: req.file.path,
		data: `/${req.file.path}`.split('/').splice(2, 3).join('/'),
	})
})

export default router
