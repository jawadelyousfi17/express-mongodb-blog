const { Router } = require('express')
const router = Router()

const { articleAdmin } = require('../controllers/articles')


router.get('/' , articleAdmin )


module.exports = router