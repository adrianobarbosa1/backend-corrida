import express from 'express'
const router = express.Router()

router.use('/usuarios', require('./usuarios'))

export default router