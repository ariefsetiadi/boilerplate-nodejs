const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate } = require('../../middlewares/auth');

router.get('/', authenticate, userController.list);
router.get('/:id', authenticate, userController.detail);
router.post('/create', authenticate, userController.create);
router.put('/update/:id', authenticate, userController.update);

module.exports = router;
