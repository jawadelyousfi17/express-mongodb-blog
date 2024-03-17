const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({
    author : {
        type : String  
    } ,
    content : {
        type : String 
    } , 
    createdAt : {
        type : Date , 
        default : Date.now()
    } ,
    like : {
        type : Number , 
        default : 0 
    } ,
    dislike : {
        type : Number , 
        default : 0 
    }
    , article : 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'article'
        }
    
})

commentSchema.statics.addComment = async function(author = 'Anonymous' , content , article) {
    if(!content) throw {content : 'no comment please enter something'}
        try {
            const comment  = await this.create({ author : author? author : 'Anonymous' , content , article })
            return comment
        } catch (error) {
            console.log(error)
        }
}

const Comment  = mongoose.model('comment', commentSchema)

module.exports = Comment

