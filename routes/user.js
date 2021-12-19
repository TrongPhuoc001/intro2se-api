const express = require("express");
const router = express.Router();

const verify = require("../helper/verifyToken");

const controller = require('../controllers/user');

router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

router.use(verify);

router.get("/:userId/courses", controller.getCourse);
router.get('/:userId/allCourses',controller.getAllCourse);

router.delete("/:user_id/delete",controller.deleteUser);

router.put('/:user_id/update',controller.updateUser)


module.exports = router;