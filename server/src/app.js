const express = require('express')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const api = require('./routes/api')
const passport = require('passport')
const helmet = require('helmet')
const localAuth = require('./auth/passport-local')
const googleAuth = require('./auth/oauth2/google-auth')
const cookieSession = require('cookie-session')
const { verify } = require('crypto')
require('dotenv').config()

const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1,
    COOKIE_KEY_2: process.env.COOKIE_KEY_2
}

const app = express()

app.use(helmet())

app.use(cors({
    origin: 'http://localhost:3000',
}))

app.use(cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2]
}))

app.use(morgan('combined'))
app.use(localAuth.initialize())
app.use(localAuth.session())
app.use(googleAuth.initialize())
app.use(googleAuth.session())

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', api)
app.get('/*', (req, res) => {
    res.send(path.join(__dirname, '..', 'public', 'index.html'))
    // Sets all paths not named in the server to be set to be handled by the frontend
})

module.exports = app