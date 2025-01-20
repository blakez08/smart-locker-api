import express, { ErrorRequestHandler } from 'express'
import morgan from 'morgan'
import routes from './routes'
import cookieParser from 'cookie-parser'

const { PORT, NODE_ENV } = process.env

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(NODE_ENV !== 'prod' ? morgan('dev') : morgan('combined'))

app.get('/health', (req, res) => {
  res.status(200).json('ok')
})

app.use(routes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  next(error)
})

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || 'Internal server error'
  res.status(status).json(message)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
