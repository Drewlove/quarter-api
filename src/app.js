require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// const {CLIENT_ORIGIN} = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const validateBearerToken = require('./validate-bearer-token')

const usersRouter = require('./users/users-router')
const articlesRouter = require('./articles/articles-router')
const commentsRouter = require('./comments/comments-router')
const boilerplateRouter = require('./boierplate-endpoints/router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))

app.use(cors())
// app.use(
//   cors({
//     origin: CLIENT_ORIGIN
//   }))
app.use(helmet())

app.use(validateBearerToken)
app.use('/api/users', usersRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/boilerplate-endpoints', boilerplateRouter)

//Open heroku url in browser, see if {ok: true} appears
app.get('/TEST', (req, res) => {
  res.json({ok: true})
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app