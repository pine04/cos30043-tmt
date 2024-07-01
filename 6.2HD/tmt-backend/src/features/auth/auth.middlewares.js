const createError = require("http-errors");

const { hash, compare } = require("../../services/bcrypt");
const { registrationSchema, loginSchema } = require("./auth.schemas");
const { getUserByUsername, getUserByEmail, createUser, getUsers } = require("./auth.model");

async function handleRegister(req, res, next) {
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

        const passwordHash = await hash(password);

        await createUser(username, email, passwordHash);
        req.session.username = username;

        res.status(200).json({
            message: `Saved to DB user: ${username}, ${email}, ${passwordHash}`
        });
    } catch (error) {
        next(error);
    }
}

async function handleLogin(req, res, next) {
    const { error, value, artifacts } = loginSchema.validate(req.body);

    if (error) {
        return next(createError(400, error.details[0].message));
    }

    const { usernameOrEmail, password } = value;
    const isUsername = artifacts.has("username");

    try {
        const user = await (isUsername ? getUserByUsername(usernameOrEmail) : getUserByEmail(usernameOrEmail));

        if (user.length === 0) {
            return next(createError(400, "User does not exist."));
        }

        const passwordHash = user[0]["Password"];
        const match = await compare(password, passwordHash);

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
}

function handleLogout(req, res) {
    req.session.destroy();

    res.status(200).json({ message: "Logged out." });
}

function handleGetLoginStatus(req, res) {
    res.status(200).json({
        isLoggedIn: !!req.session.username,
        username: req.session.username || ""
    });
}

async function handleProtected(req, res, next) {
    if (!req.session.username) {
        return res.status(401).json({ message: "Pls log in." });
    }

    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetLoginStatus,
    handleProtected
};
