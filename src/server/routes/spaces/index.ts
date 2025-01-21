import { Router } from 'express'
import db, { schema } from '../../../database'
import { eq, inArray } from 'drizzle-orm'
import rentSpace from './rentSpace'
import returnSpace from './returnSpace'
import updateSpace from './updateSpace'
import verifyUser from '../../middleware/verifyUser'
import verifyAdmin from '../../middleware/verifyAdmin'

const router = Router()

router.post('/:spaceId/rent', verifyUser, rentSpace)
router.post('/:spaceId/return', verifyUser, returnSpace)

router.put('/:spaceId', verifyAdmin, updateSpace)

export default router
