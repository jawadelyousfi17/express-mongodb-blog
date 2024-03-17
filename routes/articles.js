const { Router } = require('express')
const router = Router()

const {postEditArticle , editArticle , deleteComment, newArticle , getArticleByPath ,addComment, getAllarticles , getArticleByCategory , getAllCategories , vote , getAllComments} = require('../controllers/articles')

router.get('/' , getAllarticles )
router.post('/new' , newArticle )
router.post('/comment/:path' , addComment )
router.post('/edit' , postEditArticle )

router.post('/comment/:id/delete' , deleteComment )
router.get('/:id/edit' , editArticle )

router.post('/vote' , vote )
router.get('/new' , (req,res) => {
    console.log(458)
    res.render('main')
})
router.get('/category' , getAllCategories )
router.get('/comments' , getAllComments)

router.get('/category/:category' , getArticleByCategory )
router.get('/:articlePath' , getArticleByPath )

module.exports = router