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