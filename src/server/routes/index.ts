import { Router } from 'express'
import lockersRoutes from './lockers'
import spacesRoutes from './spaces'
import authRoutes from './auth'
import rentalsRoutes from './rentals'

const router = Router()

router.use('/lockers', lockersRoutes)
router.use('/spaces', spacesRoutes)
router.use('/auth', authRoutes)
router.use('/rentals', rentalsRoutes)

export default router
