const express = require("express");
const router = express.Router();

const { getCollections, getCollection } = require("../controllers/collectionController");

router.get("/", getCollections);
router.get("/:id", getCollection);

module.exports = router;