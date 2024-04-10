const mongoose = require('mongoose')

const dburl = process.env.DB_URI || 'mongodb+srv://jawadpro17:Jawad.18@ecomerce-api-db.ayaobei.mongodb.net/blog?retryWrites=true&w=majority&appName=ecomerce-api-db' 

const conectDb = async (conected) => mongoose.connect(dburl).then(
    (result) => {
        conected()
        console.log('Db conected')
    }
).catch(
    (err) => console.error(err)
)

module.exports = conectDb
