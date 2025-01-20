import { Router } from 'express'
import lockersRoutes from './lockers'
import spacesRoutes from './spaces'

const router = Router()

router.use('/lockers', lockersRoutes)
router.use('/spaces', spacesRoutes)

export default router
