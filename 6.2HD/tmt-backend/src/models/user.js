const pool = require("../services/pool");

async function getUsersAndFriendshipStatus(currentUserId, pageNumber = 1, nameQuery = "", location = "", relationshipStatus = "") {
    try {
        const sql = `
            SELECT \`UserID\`, \`Username\`, \`Email\`, \`DisplayName\`, \`Gender\`, \`Birthdate\`, \`Location\`, \`RelationshipStatus\`, \`ProfilePicture\`, \`Bio\`, \`Status\`
            FROM \`User\`
            LEFT JOIN (SELECT * FROM \`Friendship\` WHERE \`UserA\` = ? OR \`UserB\` = ?) AS \`UserARelationships\`
            ON (\`User\`.\`UserID\` = \`UserARelationships\`.\`UserA\` OR \`User\`.\`UserID\` = \`UserARelationships\`.\`UserB\`)
            WHERE \`UserID\` != ? ${nameQuery ? `AND (\`Username\` LIKE ? OR \`DisplayName\` LIKE ?)` : ""}
            ${location ? `AND \`Location\` = ?` : ""}
            ${relationshipStatus ? `AND \`RelationshipStatus\` = ?` : ""}
            LIMIT ?, 20
        `;
        const values = [currentUserId, currentUserId, currentUserId];
        nameQuery && values.push(`%${nameQuery}%`, `%${nameQuery}%`);
        location && values.push(location);
        relationshipStatus && values.push(relationshipStatus);
        values.push(String((pageNumber - 1) * 20));

        console.log(sql, values);

        const [result, _] = await pool.execute(sql, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getUserAndFriendshipStatus(currentUserId, targetUsername) {

}

async function createFriendRequest(requesterUsername, recipientUsername) {
    try {
        const sql = `
            INSERT INTO \`Friendship\` VALUES (
                (SELECT \`UserID\` FROM \`User\` WHERE \`Username\` = ?),
                (SELECT \`UserID\` FROM \`User\` WHERE \`Username\` = ?),
                "Pending"
            )
        `;
        await pool.execute(sql, [requesterUsername, recipientUsername]);
    } catch (error) {
        throw error;
    }
}

async function deleteFriendRequest(requesterUsername, recipientUsername) {
    try {
        const sql = `
            DELETE FROM \`Friendship\` WHERE 
                \`UserA\` = (SELECT UserID FROM \`User\` WHERE Username = ?) AND
                \`UserB\` = (SELECT UserID FROM \`User\` WHERE Username = ?) AND
                \`Status\` = "Pending"
        `;
        await pool.execute(sql, [requesterUsername, recipientUsername]);
    } catch (error) {
        throw error;
    }
}

async function acceptFriendRequest(requesterUsername, recipientUsername) {
    try {
        const sql = `
            UPDATE \`Friendship\` SET \`Status\` = "Accepted" WHERE 
                \`UserA\` = (SELECT UserID FROM \`User\` WHERE Username = ?) AND
                \`UserB\` = (SELECT UserID FROM \`User\` WHERE Username = ?)
        `;
        await pool.execute(sql, [requesterUsername, recipientUsername]);
    } catch (error) {
        throw error;
    }
}

async function getSentFriendRequests(senderUsername) {
    try {
        const sql = `
            SELECT * FROM \`User\`
            JOIN (SELECT * FROM \`Friendship\` WHERE \`UserA\` = (SELECT \`UserID\` FROM \`User\` WHERE \`Username\` = ?) AND \`Status\` = "Pending") AS \`SentRequests\`
            ON \`User\`.\`UserID\` = \`SentRequests\`.\`UserB\`
        `;
        const [result, _] = await pool.execute(sql, [senderUsername]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getReceivedFriendRequests(recipientUsername) {
    try {
        const sql = `
            SELECT * FROM \`User\`
            JOIN (SELECT * FROM \`Friendship\` WHERE \`UserB\` = (SELECT \`UserID\` FROM \`User\` WHERE \`Username\` = ?) AND \`Status\` = "Pending") AS \`ReceivedRequests\`
            ON \`User\`.\`UserID\` = \`ReceivedRequests\`.\`UserA\`
        `;
        const [result, _] = await pool.execute(sql, [recipientUsername]);
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

async function createUser(user) {
    let {
        username,
        email,
        password,
        displayName,
        gender,
        birthdate,
        location,
        relationshipStatus,
        bio
    } = user;
    birthdate = birthdate.split("T")[0];

    try {
        const sql = "INSERT INTO User (Username, Email, Password, DisplayName, Gender, Birthdate, Location, RelationshipStatus, Bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [username, email, password, displayName, gender, birthdate, location, relationshipStatus, bio];
        const [queryResult, _] = await pool.execute(sql, values);
        
        return queryResult;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getUsersAndFriendshipStatus,
    getUserByUsername,
    getUserByEmail,
    createUser
};