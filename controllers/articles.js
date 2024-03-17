const moment = require('moment');

const Article = require('../models/article')
const Category = require('../models/categories')
const writeToFile = require('./writeToFile')
const { htmlToText, getFirst5Words, removeEmptyElements } = require('../utils/htmlToText');
const article = require('../models/article');
const Comment = require('../models/comment');



const newArticle = async (req, res) => {
    let { title, category, content } = req.body
    const description = `${htmlToText(content).substring(0, 200)}...`
    title = title || getFirst5Words(description)
    let newCategories = []
    category = Array.from(new Set(category));
    category = removeEmptyElements(category)
    if (category.length === 0) category.push('')
    try {
        await Promise.all(category.map(async (category) => {
            const ctg = await Category.addNewCategorie(category || 'Uncategorized')
            ctg.count++
            await ctg.save()
            newCategories.push(ctg)
        }));
    } catch (error) {
        console.log(error)
    }
    try {
        const article = await Article.addArticle(title, description)
        newCategories.forEach(category => article.categories.push(category))
        await article.save()
        const articlePath = article.path
        await writeToFile(content, `${articlePath}.ejs`)
        res.status(201).json({ path: `/articles/${article.path}` })
        // res.status(201).json({message : 'jood'})
    } catch (error) {
        console.log(error)
        res.status(401).json(error.error)
    }
}

const getArticleByPath = async (req, res, next) => {
    const articlePath = req.params.articlePath
    try {
        const article = await Article.findOne({ path: articlePath })
        if (article) {
            article.date = moment(article.createdAt).format("dddd, MMMM D, YYYY")
            const category = await article.populate('categories')
            const comments = await (await article.populate('comments'))
            article.visited++
            await article.save()
            res.render('article', {
                errors: null,
                comments: comments.comments,
                article,
                category: category.categories,
                createdAt: moment(article.createdAt).format("dddd, MMMM D, YYYY")
            })
        } else {
            next()
        }

    } catch (error) {
        console.log(error.message)
    }
}

const getAllarticles = async (req, res) => {

    try {
        const allArticles = await Article.find().populate('categories').sort({ createdAt: -1 })
        if (allArticles) {
            allArticles.forEach(article => {
                article.date = moment(article.createdAt).format("dddd, MMMM D, YYYY")
            })
            res.render('all-articles', {
                data: allArticles
            })
        }
    } catch (error) {

    }
}


const getArticleByCategory = async (req, res) => {
    const category = req.params.category
    try {
        const articleCategory = await Category.findOne({ title: category })
        if (!articleCategory) {
            console.log('no article ')
            return []
        }
        const articles = await Article.find({ categories: articleCategory._id }).populate('categories')

        res.render('article-by-category', {
            data: articles, category: articleCategory.title

        })
    } catch (error) {
        console.log(error)
    }

}

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.render('category', {
            categories
        })

    } catch (err) {

    }
}


const addComment = async (req, res) => {
    const { author, content } = req.body
    try {
        const article = await Article.findOne({ path: req.params.path })
        const comment = await Comment.addComment(author, content, article)
        console.log(article.title)
        article.comments.push(comment)
        await article.save()
        res.redirect(`/articles/${article.path}`)
    } catch (error) {
        console.log(error)
    }
}

const vote = async (req, res) => {
    const { commentId, action } = req.body
    const voteup = action === 'like' ? true : false
    console.log(voteup, action)
    try {
        const comment = await Comment.findById(commentId)
        if (comment) {
            if (voteup) { comment.like++ } else { comment.dislike++ }
        }
        await comment.save()
        res.json(comment.like - comment.dislike)
    } catch (error) {
        console.log(error)
    }
}
const getAllComments = async (req, res) => {

    try {
        const comments = await Comment.find().populate('article')
        if (comments) {
            res.render('comments', {
                comments
            })
        }

    } catch (error) {
        console.log(error)
    }
}


deleteComment = async (req, res) => {

    try {
        const comments = await Comment.findByIdAndDelete(req.params.id)
        if (comments) {
            res.redirect('/articles/comments')
        }

    } catch (error) {
        console.log(error)
    }
}

articleAdmin = async (req, res) => {
    try {
        const allArticles = await Article.find().sort({ createdAt: -1 })
        if (allArticles) {
            allArticles.forEach(article => {
                article.date = moment(article.createdAt).format("dddd, MMMM D, YYYY")
            })
            res.render('admin', {
                data: allArticles
            })
        }
    } catch (error) {

    }
}
editArticle = async (req, res) => {
    let categories = ''
    try {
        const article = await Article.findById(req.params.id).populate('categories')
        article.categories.forEach(category => {
            console.log(category.title)
            categories += category.title+ ' , '
        })
    
        res.render('edit', {
            article ,
             category : categories
        })
    } catch (error) {

    }
}

postEditArticle =  async (req, res) => {
     let { title, category, content , id } = req.body

    try {
        const article = await Article.findById(id)
        await writeToFile(content, `${article.path}.ejs`)
        article.title = title 
        await article.save()
        res.redirect(`/articles/${article.path}`)
    } catch (error) {
        console.log(error)
    }
    }

module.exports = { postEditArticle , editArticle, articleAdmin, deleteComment, newArticle, getArticleByPath, getAllarticles, getArticleByCategory, getAllCategories, addComment, vote, getAllComments }