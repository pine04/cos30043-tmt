require("dotenv").config();

const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const morgan = require("morgan");

const authRouter = require("./src/features/auth/auth.router");

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(
    session({
        secret: "textmetomorrow",
        cookie: {
            maxAge: 14 * 24 * 3600 * 1000
        },
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            ttl: 14 * 24 * 3600
        })
    })
);

app.use(authRouter);

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
