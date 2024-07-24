const createError = require("http-errors");

const { getUserByUsername, getUsersAndFriendshipStatus } = require("../../models/user");

async function handleGetMyProfile(req, res, next) {
    if (!req.session.username) {
        return next(createError(401, "Not logged in."));
    }

    try {
        const queryResult = await getUserByUsername(req.session.username);
        if (queryResult.length === 0) {
            return next(createError(500));
        }

        const user = queryResult[0];
        res.status(200).json({
            username: user["Username"],
            email: user["Email"],
            displayName: user["DisplayName"],
            gender: user["Gender"],
            birthdate: user["Birthdate"],
            location: user["Location"],
            relationshipStatus: user["RelationshipStatus"],
            profilePicture: user["ProfilePicture"],
            bio: user["Bio"]
        });
    } catch (error) {
        next(error);
    }
}

async function handleUpdateMyProfile(req, res, next) {

}

async function handleGetUser(req, res, next) {

}

async function handleGetUsers(req, res, next) {
    const pageNumber = req.query.pageNumber || 1;
    const nameQuery = req.query.nameQuery || "";
    const location = req.query.location || "";
    const relationshipStatus = req.query.relationshipStatus || "";

    try {
        const users = await getUsersAndFriendshipStatus(req.session.userId, pageNumber, nameQuery, location, relationshipStatus);
        res.status(200).json({
            users: users.map(user => ({
                username: user["Username"],
                email: user["Email"],
                displayName: user["DisplayName"],
                gender: user["Gender"],
                birthdate: user["Birthdate"],
                location: user["Location"],
                relationshipStatus: user["RelationshipStatus"],
                profilePicture: user["ProfilePicture"],
                bio: user["Bio"],
                status: user["Status"] || "Not friend"
            }))
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleGetMyProfile,
    handleGetUser,
    handleGetUsers,
    handleUpdateMyProfile
};