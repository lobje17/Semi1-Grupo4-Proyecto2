const { Router } = require('express');
const router = Router();
const BD = require('../config/settingdb');
const { getUsers, login, newAccount, upload, updateInfo, createPost, getPosts, searchPost } = require('../controllers/user-controller');

router.get('/getUsers',getUsers)
router.post('/login',login)
router.post('/createAccount', newAccount)
router.post('/updateInfo', updateInfo)
router.post('/upload', upload)

router.post('/getPosts', getPosts)
router.post('/createPost', createPost)
router.post('/searchPost', searchPost)

module.exports = router;