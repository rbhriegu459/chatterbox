const express = require("express");
const userController= require('../controllers/user-controller');
const chatController = require('../controllers/chat-controller');

const authentication = require('../middleware/auth');
const router = express.Router();

router.get('/signup', userController.getSignUp);
router.post('/signup', userController.postSignUp);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

router.get('/chat', chatController.getChat);
router.post('/chat', authentication.authenticate, chatController.postChat);

module.exports = router;