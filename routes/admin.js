const express = require("express");

const router = express.Router();

const controller = require('../controllers/admin')

router.get('/', controller.index)
router.get('/login', controller.getLogin)
router.get('/dashboard',controller.getDashboard)
router.get('/dashboard/:table_name', controller.getTable)

router.delete('/dashboard/:table_name/:record_id', controller.delRecord)

router.post('/dashboard/:table_name', controller.postTable)

router.post('/login', controller.postLogin)
router.get('/logout',controller.logout);


module.exports = router;