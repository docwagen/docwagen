const express = require("express");
const router = express.Router();
const upload = require("../services").fileUpload;
const converterController = require("../controllers").converterController;

router.post("/", upload.single("file"), converterController.convertFile);

module.exports = router;
