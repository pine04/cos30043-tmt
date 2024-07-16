const express = require("express");
const {
    handleCreatePost
} = require("./posts.middlewares");

const router = express.Router();

router.post("/posts", handleCreatePost);

module.exports = router;