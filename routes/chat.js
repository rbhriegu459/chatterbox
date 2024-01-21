const express = require("express");

const router = express.Router();
const chatController = require('../controllers/chat-controller');

const authentication = require('../middleware/auth');

router.get('/chat', chatController.getChat); //okk
router.post('/chat', authentication.authenticate, chatController.postChat);

// --create group button---
router.get('/addGroup', chatController.addGroup);
router.post('/createGroup', authentication.authenticate, chatController.createGroupInDb);
// ----Getting all members for creating group---
router.get('/allMembers', chatController.allUsers);
// ----Adding group of user in database
router.post('/addUserToGroup', authentication.authenticate, chatController.addUserToGroup);
router.get('/grpId/:name', chatController.grpId);

// --displaying groups to ui---
router.get('/fetchGroup/:id', chatController.fetchGroups);
router.get('/fetchGroupName/:id', chatController.fetchGroupName);

// ------- Getting chats according to the group
router.get('/groupChat/:name', chatController.groupchats);
router.get('/getName/:id', chatController.getName);

// ---exit group----
router.get('/exitGroup/:grp/:id' , chatController.exitChat);

// -----Fetching group members --------
router.get('/allGroupMembers/:group', chatController.allGroupMembers);

// Avatar
router.get('/Avatar/:id', chatController.getAvatar);

// Fetch Admin group
router.get('/fetchAdmin/:groupName', chatController.fetchAdmin);

module.exports = router;