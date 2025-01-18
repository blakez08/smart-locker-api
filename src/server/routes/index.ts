import { Router } from 'express'
import lockersRoutes from './lockers'

const router = Router()

router.use('/lockers', lockersRoutes)

export default router
