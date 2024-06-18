const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const createError = require("http-errors");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(session({
    secret: "textmetomorrow",
    cookie: {
        maxAge: 14 * 24 * 3600 * 1000
    },
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        ttl: 14 * 24 * 3600
    })
}));

app.get("/test", async (req, res) => {
    try {
        const user = await getUserByUsername("hello");
        res.json(user);
    } catch (e) {
        console.log(e);
    }
});

app.get("/protected", (req, res) => {
    if (!req.session.username) {
        res.status(401).json({message: "Log in pls"});
    } else {
        res.status(200).json({message: `Logged in as ${req.session.username}`});
    }
})

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "An error happened on the server";

    console.log(err);

    res.status(status).json({ message });
});

app.listen(8000, () => console.log("Listening on port 8000..."));

process.on("SIGINT", () => {
    console.log("Closing server...");
    process.exit(0);
});
