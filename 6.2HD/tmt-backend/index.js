require("dotenv").config();

const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const morgan = require("morgan");
const cors = require("cors");

const authRouter = require("./src/features/auth/auth.router");

const app = express();
const PORT = 8002;

app.use(cors({
    origin: "http://localhost:5173"
}));
app.use(morgan("dev"));

app.use(express.urlencoded())

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

app.use("/api", authRouter);

app.get("/login-form", (req, res) => {
    res.status(200).send(
        `
            <form method="POST" action="/login">
                Username: <input type="text" name="usernameOrEmail">
                Password: <input type="text" name="password">
                <button type="submit">Login</button>
            </form>
        `
    )
})

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
