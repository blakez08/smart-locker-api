import { Router } from 'express'
import verifyUser from '../../middleware/verifyUser'
import getRentals from './getRentals'

const router = Router()

router.get('/', verifyUser, getRentals)

export default router
