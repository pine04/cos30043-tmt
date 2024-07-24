const express = require("express");
const {
    handleCreatePost,
    handleGetNewsFeed,
    handleGetPost,
    handleGetPostsFromUser
} = require("./posts.middlewares");

const { requireAuthentication } = require("../../utils/helpers");

const router = express.Router();

router.post("/posts", requireAuthentication, handleCreatePost);
router.get("/users/:username/posts", requireAuthentication, handleGetPostsFromUser);
router.get("/posts/:postId", requireAuthentication, handleGetPost);

module.exports = router;