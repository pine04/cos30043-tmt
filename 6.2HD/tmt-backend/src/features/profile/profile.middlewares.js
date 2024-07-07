const createError = require("http-errors");

const { getUserByUsername } = require("../../models/user");

async function handleGetMyProfile(req, res, next) {
    if (!req.session.username) {
        return next(createError(401, "Not logged in."));
    }
    console.log("hey")

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

async function handleGetProfile(req, res, next) {

}

module.exports = {
    handleGetMyProfile,
    handleGetProfile,
    handleUpdateMyProfile
};