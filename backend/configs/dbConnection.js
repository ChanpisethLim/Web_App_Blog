const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.DB_CONN, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true, 
    useFindAndModify: false
})
.then(() => {
    console.log('DB connected')
})
.catch(err => {
    console.log('DB connection failed')
})