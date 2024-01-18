const express = require("express");
const userController= require('../controllers/user-controller');

const router = express.Router();

router.get('/signup', userController.getSignUp);
router.post('/signup', userController.postSignUp);

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

router.get('/avatar/:email', userController.avatarPage);
router.post('/avatar/:email', userController.avatarToDb);

module.exports = router;