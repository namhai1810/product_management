const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/trash.controller");

router.get("/", controller.index);
router.patch("/change-trash/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);

module.exports = router;