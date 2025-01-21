import { Router } from 'express'
import db, { schema } from '../../../database'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const [user] = await db
      .insert(schema.users)
      .values({
        email: email.toLowerCase(),
        password: hashedPassword
      })
      .returning()

    res.json({ id: user.id, name: user.name, email: user.email })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email.toLowerCase())
    })

    if (!user) throw new Error('User not found')

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)

    if (!isMatch) throw new Error('Invalid credentials')

    const token = await jwt.sign(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      process.env.JWT_SECRET!
    )

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })
      .json({ token })
  } catch (error) {
    console.error(error)
    next(new Error('Unauthorized'))
  }
})

router.post('/me', async (req, res, next) => {
  try {
    const token = req.body.token || req.cookies.token

    if (!token) return next(new Error('Unauthorized'))

    const { user } = jwt.verify(token, process.env.JWT_SECRET!) as any

    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    next(new Error('Unauthorized'))
  }
})

router.post('/logout', async (req, res, next) => {
  try {
    res.status(200).clearCookie('token').json({ token: '' })
  } catch (error) {
    console.error(error)
    next(error)
  }
})

export default router
