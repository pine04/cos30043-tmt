const pool = require("../../services/pool");

async function getUsers() {
    try {
        const sql = "SELECT * FROM User";
        const [result, _] = await pool.execute(sql);

        return result;
    } catch (error) {
        throw error;
    }
}

async function getUserByUsername(username) {
    try {
        const sql = "SELECT * FROM User WHERE Username = ?";
        const [result, _] = await pool.execute(sql, [username]);

        return result;
    } catch (error) {
        throw error;
    }
}

async function getUserByEmail(email) {
    try {
        const sql = "SELECT * FROM User WHERE Email = ?";
        const [result, _] = await pool.execute(sql, [email]);

        return result;
    } catch (error) {
        throw error;
    }
}

async function createUser(username, email, passwordHash) {
    try {
        const sql = "INSERT INTO User (Username, Email, Password) VALUES (?, ?, ?)";
        const values = [username, email, passwordHash];

        await pool.execute(sql, values);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUsers,
    getUserByUsername,
    getUserByEmail,
    createUser
};
