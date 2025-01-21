import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

const verifyUser: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.token
    if (!token) return next(new Error('Unauthorized'))

    const user = jwt.verify(token, process.env.JWT_SECRET!)
    res.locals.user = user

    next()
  } catch (error) {
    console.error(error)
    next(new Error('Unauthorized'))
  }
}

export default verifyUser
