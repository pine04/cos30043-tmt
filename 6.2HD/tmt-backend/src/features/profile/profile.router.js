const express = require("express");
const {
    handleGetMyProfile,
    handleUpdateMyProfile,
    handleGetUser,
    handleGetUsers
} = require("./profile.middlewares");

const router = express.Router();

router.get("/my-profile", handleGetMyProfile);
router.patch("/my-profile", handleUpdateMyProfile);
router.get("/users/:username", handleGetUser);
router.get("/users", handleGetUsers);

module.exports = router;