const mongoose = require('mongoose')

const dburl = process.env.DB_URI 

const conectDb = async (conected) => mongoose.connect(dburl).then(
    (result) => {
        conected()
        console.log('Db conected')
    }
).catch(
    (err) => console.error(err)
)

module.exports = conectDb
