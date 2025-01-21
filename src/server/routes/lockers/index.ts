import { Router } from 'express'
import db, { schema } from '../../../database'
import { sql, eq, inArray } from 'drizzle-orm'
import getLockers from './getLockers'
import getLocker from './getLocker'
import updateLocker from './updateLocker'
import createLocker from './createLocker'
import verifyAdmin from '../../middleware/verifyAdmin'

const router = Router()

router.get('/', getLockers)
router.get('/:lockerId', getLocker)

router.put('/:lockerId', verifyAdmin, updateLocker)
router.post('/', verifyAdmin, createLocker)

export default router
