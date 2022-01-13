const { Router } = require("express");
const router = Router();

const apiUserController = require("./apiUserController");

router.put("/banUser/:id", apiUserController.putBanUser);
router.get("/listUser", apiUserController.getListUser);

router.put("/unBanUser/:id", apiUserController.putUnBanUser);

module.exports = router;
