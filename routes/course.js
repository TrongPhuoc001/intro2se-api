const express = require("express");
const router = express.Router();

const verify = require("../helper/verifyToken");

const controller = require('../controllers/course')



router.get('/all', controller.getAll)
router.get('/available', controller.getAvai)

router.get('/subject',controller.getCourseSubject)

router.get('/search', controller.searchCourse)

router.get("/:courseId", controller.getCourse);

router.post("/:userId/sign", verify, controller.postCourse);

router.delete("/:userId/unsign/:courseId", verify, controller.deleteOrUnsign);

router.put('/:userId/start', verify,controller.startCourse)

router.put('/:userId/end', verify,controller.endCourse)

module.exports = router;