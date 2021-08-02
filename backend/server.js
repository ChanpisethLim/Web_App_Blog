require('./configs/dbConnection')

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const path = require("path")

// Middlewares
const app = express()
const { requireAuth } = require('./middlewares/jwtAuth')
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const userAuthRoute = require('./routes/userAuth')
const userProfileRoute = require('./routes/userProfile')
const categoryRoute = require('./routes/category')
const blogRoute = require('./routes/blog')
const commentRoute = require('./routes/comment')

app.use('/api/v1/auth', requireAuth)
app.use('/api/v1', userAuthRoute)
app.use('/api/v1', userProfileRoute)
app.use('/api/v1', categoryRoute)
app.use('/api/v1', blogRoute)
app.use('/api/v1', commentRoute)

// Server
app.listen(process.env.PORT || 3000, () => {
    console.log('app listen on port 3000')
})