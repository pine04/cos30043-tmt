const express = require("express");
const { handleRegister, handleLogin, handleLogout, handleProtected } = require("./auth.middlewares");

const router = express.Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.get("/protected", handleProtected);

module.exports = router;
