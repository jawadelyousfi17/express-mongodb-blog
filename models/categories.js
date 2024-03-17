const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
    title : {
        type : String  ,
        unique : true 
    } ,
    count : {
        type : Number ,
        default : 1
    }
})

categorySchema.statics.addNewCategorie = async function(categoryName = 'uncategorized') {
   
        try {
            const category = await this.create({ title : categoryName })
            return category
        } catch (error) {
            if (error.name === 'MongoServerError' && error.code === 11000 ) {
                return await this.findOne({title : categoryName})
            }
        }
    
}

const Category  = mongoose.model('categorie', categorySchema)

module.exports = Category

