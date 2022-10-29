const { Router } = require('express');
const router = Router();
const BD = require('../config/settingdb');
const { getPost, createPost } = require('../controllers/posts-controller');

router.get('/getPost',getPost)
router.post('/createPost', createPost)

module.exports = router;