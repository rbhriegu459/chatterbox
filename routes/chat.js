const express = require("express");

const router = express.Router();
const chatController = require('../controllers/chat-controller');

const authentication = require('../middleware/auth');

router.get('/chat', chatController.getChat);
router.post('/chat', authentication.authenticate, chatController.postChat);
router.get('/fetchChat', authentication.authenticate, chatController.fetchChat);
router.get('/getName/:id', chatController.getName);

module.exports = router;