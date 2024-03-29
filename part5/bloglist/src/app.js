const logger = require('./utils/logger')
const { MONGODB_URI } = require('./utils/config')

const express = require('express')
require('express-async-errors')

const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const middleware = require('./utils/middleware')

logger.info('connecting to', MONGODB_URI)
mongoose.connect(MONGODB_URI)

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app