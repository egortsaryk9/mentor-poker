const { Router } = require('express');
const router = Router();
const { tableController, userController } = require('./../controllers');

router.post('/join', userController.getUserByHash);
router.get('/tables', tableController.getTablesList);
router.post('/table/create', tableController.createTable);

module.exports = router