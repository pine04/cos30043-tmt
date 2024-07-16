const pool = require("../services/pool");

async function createPost(userId, textContent, mediaFileIds) {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const createPostSql = "INSERT INTO `Post` (`UserID`, `TextContent`, `TimePosted`) VALUES (?, ?, NOW())";
        const [queryResult, _] = await connection.execute(createPostSql, [userId, textContent]);
        
        const postId = queryResult.insertId;
        const createMediaSql = "INSERT INTO `PostMedia` (`PostID`, `MediaName`, `Order`) VALUES (?, ?, ?)";
        for (let [index, fileId] of mediaFileIds.entries()) {
            await connection.execute(createMediaSql, [postId, fileId, index]);
        }

        await connection.commit();        
        pool.releaseConnection(connection);

        return postId;
    } catch (error) {
        await connection.rollback();
        pool.releaseConnection(connection);
        throw error;
    }
}

module.exports = {
    createPost
}