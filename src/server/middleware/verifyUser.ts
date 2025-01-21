import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const verifyUser: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.token
    if (!token) return next(new Error('Unauthorized'))

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      user: {
        id: string
        name: string
        email: string
      }
      iat: number
    }

    res.locals.user = payload.user

    next()
  } catch (error) {
    console.error(error)
    next(new Error('Unauthorized'))
  }
}

export default verifyUser
