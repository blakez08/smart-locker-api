import { RequestHandler } from 'express'

const verifyAdmin: RequestHandler = (req, res, next) => {
  try {
    console.warn('verifyAdmin middleware not implemented')
    next()
  } catch (error) {
    console.error(error)
    next(new Error('Unauthorized'))
  }
}

export default verifyAdmin
