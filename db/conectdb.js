const mongoose = require('mongoose')

const dburl = process.env.DB_URI || 'mongodb://127.0.0.1:27017/blog' 

const conectDb = async (conected) => mongoose.connect(dburl).then(
    (result) => {
        conected()
        console.log('Db conected')
    }
).catch(
    (err) => console.error(err)
)

module.exports = conectDb