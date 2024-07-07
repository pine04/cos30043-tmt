require("dotenv").config();

const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const morgan = require("morgan");
const cors = require("cors");

const authRouter = require("./features/auth/auth.router");
const profileRouter = require("./features/profile/profile.router");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(morgan("dev"));

app.use(express.json());
app.use(
    session({
        secret: "textmetomorrow", // probably put in env file :)
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

app.use("/api", authRouter, profileRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "An error happened on the server";

    console.log(err);

    res.status(status).json({ message });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

process.on("SIGINT", () => {
    console.log("Closing server...");
    process.exit(0);
});
