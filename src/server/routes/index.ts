import { Router } from 'express'
import lockersRoutes from './lockers'
import spacesRoutes from './spaces'
import authRoutes from './auth'

const router = Router()

router.use('/lockers', lockersRoutes)
router.use('/spaces', spacesRoutes)
router.use('/auth', authRoutes)

export default router
