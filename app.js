const express = require('express')
const path = require('path')
const conectDb = require('./db/conectdb')
const bodyParser = require('body-parser')

// my midleware
const notFound = require('./routes/notfound')
const articlesRoutes = require('./routes/articles')
const adminRoutes = require('./routes/admin')

const app = express()

const PORT =  process.env.PORT || 3000


// Conect db and run server 
conectDb(() => app.listen(PORT , console.log(`server is running on port ${PORT} ...`))  )

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json()); 


app.get('/' , function (req , res) {
    res.redirect('/articles')
} )
app.use('/articles' , articlesRoutes )
app.use('/admin' , adminRoutes )

app.use(notFound)