const { Router } = require("express");
const router = Router();

const apiCourseController = require("./apiCourseController");

router.put("/banCourse/:id", apiCourseController.putBanCourse);
router.get("/listCourse", apiCourseController.getListCourse);

router.put("/unBanCourse/:id", apiCourseController.putUnBanCourse);

module.exports = router;
