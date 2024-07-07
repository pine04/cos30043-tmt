const express = require("express");
const {
    handleGetMyProfile,
    handleUpdateMyProfile,
    handleGetProfile
} = require("./profile.middlewares");

const router = express.Router();

router.get("/my-profile", handleGetMyProfile);
router.patch("/my-profile", handleUpdateMyProfile);
router.get("/profiles/:username", handleGetProfile);

module.exports = router;