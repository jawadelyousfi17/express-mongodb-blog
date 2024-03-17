const mongoose = require('mongoose')
const ShortUniqueId = require('short-unique-id');
const slugify = require('slugify')


// generate unique slogan (alpha numeric)
const generateId = (idLength) => {
    const uid = new ShortUniqueId({ length: idLength });
    return uid.rnd()
}

const articleShcema = new mongoose.Schema({
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categorie'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }],
    title: {
        type: String
    },
    path: {
        type: String,
        default: generateId(8),
        unique: true
    },

    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    , visited: {
        type: Number,
        default: 0
    }

})

articleShcema.statics.addArticle = async function (title, description, recalled = false) {
    if (!title) throw { error: 'invalid name' }

    try {
        const path = recalled ? `${title} ${generateId(2)}` : title
        const myArticle = await this.create({ title, path: slugify(path, { lower: true, strict: true }), description })
        return myArticle
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return this.addArticle(title, description, true)
        }
        throw error
    }
}


module.exports = mongoose.model('article', articleShcema)