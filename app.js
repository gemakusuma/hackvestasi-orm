const express = require('express')
const app = express()
const port = 3001
const router = require('./routers/index')
const session = require('express-session')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }));

const path = require('path')
app.use('/public', express.static(path.join(__dirname, 'public')))


app.use(session({
    secret: 'Zy4mNp2ZqLvT2',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))


app.use('/', router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})