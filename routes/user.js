const express = require("express");
const userController= require('../controllers/user-controller');
const chatController = require('../controllers/chat-controller');
const router = express.Router();

router.get('/signup', userController.getSignUp);
router.post('/signup', userController.postSignUp);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

router.get('/chat', chatController.getChat);

module.exports = router;