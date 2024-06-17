const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const Joi = require("joi");
const morgan = require("morgan");
const mysql = require("mysql2/promise");
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

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "GnutTung@04",
    database: "tmt"
});

const registrationSchema = Joi.object({
    username: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9_]*$"))
        .max(30)
        .required()
        .messages({
            "any.required": "Username is required.",
            "string.empty": "Username cannot be empty.",
            "string.pattern.base": "Username can only consist of alphanumeric characters and underscores.",
            "string.max": "The maximum length for username is 30 characters."
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            "any.required": "Email is required.",
            "string.empty": "Email cannot be empty.",
            "string.email": "Email is invalid."
        }),
    password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
        .required()
        .messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.pattern.base": "Password must consist of alphanumeric characters and be between 8 and 30 characters in length."
        }),
    cfPassword: Joi.string()
        .equal(Joi.ref("password"))
        .required()
        .messages({
            "any.required": "Confirm password is required.",
            "any.only": "Confirm password does not match password."
        })
});

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

app.post("/register", async (req, res, next) => {
    const { error, value } = registrationSchema.validate(req.body);

    if (error) {
        return next(createError(400, error.details[0].message));
    }

    const { username, email, password } = value;

    try {
        const userWithUsername = await getUserByUsername(username);
        if (userWithUsername.length !== 0) {
            return next(createError(400, `The username '${username}' already exists.`));
        }

        const userWithEmail = await getUserByEmail(email);
        if (userWithEmail.length !== 0) {
            return next(createError(400, `The email '${email}' is already used.`));
        }

        const passwordHash = await bcrypt.hash(password, saltRounds);

        await createUser(username, email, passwordHash);
        req.session.username = username;

        res.status(200).json({
            message: `Saved to DB user: ${username}, ${email}, ${passwordHash}`
        });
    } catch (error) {
        next(error);
    }
});

const loginSchema = Joi.object({
    username: Joi.string()
        .messages({
            "string.empty": "Username cannot be empty.",
        }),
    email: Joi.string()
        .email()
        .messages({
            "string.empty": "Email cannot be empty.",
            "string.email": "Email is invalid."
        }),
    password: Joi.string()
        .required()
        .messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty."
        })
}).xor("username", "email").messages({
    "object.missing": "Please provide either username or email.",
    "object.xor": "Please provide either username or email, not both."
});

app.post("/login", async (req, res, next) => {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        return next(createError(400, error.details[0].message));
    }

    const { username, email, password } = value;
    let user;

    try {
        if (username) {
            user = await getUserByUsername(username);
        }

        if (email) {
            user = await getUserByEmail(email);
        }

        if (user.length === 0) {
            return next(createError(400, "User does not exist."));
        }

        const passwordHash = user[0]["Password"];
        const match = await bcrypt.compare(password, passwordHash);

        if (!match) {
            return next(createError(400, "Password incorrect."));
        }

        req.session.username = user[0]["Username"];

        res.status(200).json({
            message: `Logged in as ${user[0]["Username"]}`
        });

    } catch (error) {
        next(error);
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy();

    res.status(200).json({ message: "Logged out." });
});

async function getUserByUsername(username) {
    try {
        const sql = "SELECT * FROM User WHERE Username = ?";
        const [result, fields] = await pool.execute(sql, [username]);

        console.log(result, fields);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function getUserByEmail(email) {
    try {
        const sql = "SELECT * FROM User WHERE Email = ?";
        const [result, fields] = await pool.execute(sql, [email]);

        console.log(result, fields);
        return result;
    } catch (error) {
        console.log(error);
    }
}

async function createUser(username, email, passwordHash) {
    try {
        const sql = "INSERT INTO User (Username, Email, Password) VALUES (?, ?, ?)";
        const values = [username, email, passwordHash];

        const [result, fields] = await pool.execute(sql, values);

        console.log(result, fields);
    } catch (error) {
        console.log(error);
    }
}

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "An error happened on the server";

    res.status(status).json({ message });
});

app.listen(8000, () => console.log("Listening on port 8000..."));

process.on("SIGINT", () => {
    console.log("Closing server...");
});
