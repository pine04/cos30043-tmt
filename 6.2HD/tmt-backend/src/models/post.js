const { getPresignedGetUrl } = require("../services/bucket");
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

async function getPostsFromUser(username, pageNumber = 1) {
    try {
        const sql = `
            SELECT \`PostID\` FROM \`Post\` 
            JOIN \`User\` ON \`Post\`.\`UserID\` = \`User\`.\`UserID\` 
            WHERE \`Username\` = ? 
            ORDER BY \`TimePosted\` DESC
            LIMIT ?, 20
        `;
        const [result, _] = await pool.execute(sql, [username, `${(pageNumber - 1) * 20}`]);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getPost(postId) {
    try {
        const sql = `
            SELECT \`DisplayName\`, \`Username\`, \`Post\`.\`PostID\` AS \`PostID\`, \`TimePosted\`, \`TextContent\`, \`MediaName\`, \`Order\` FROM \`Post\`
            JOIN \`User\` ON \`Post\`.\`UserID\` = \`User\`.\`UserID\`
            LEFT JOIN \`PostMedia\` ON \`Post\`.\`PostID\` = \`PostMedia\`.\`PostID\`
            WHERE \`Post\`.\`PostID\` = ?
            ORDER BY \`Order\`
        `;
        const [result, _] = await pool.execute(sql, [postId]);

        if (result.length === 0) {
            return null;
        } else {
            const postDetails = result[0];
            const mediaFileNames = result.filter(row => row["MediaName"] !== null).map(media => media["MediaName"]);
            const mediaFileUrls = [];

            for (const fileName of mediaFileNames) {
                const url = await getPresignedGetUrl(fileName);
                mediaFileUrls.push(url);
            }

            const post = {
                author: {
                    username: postDetails["Username"],
                    displayName: postDetails["DisplayName"]
                },
                postId: postDetails["PostID"],
                timePosted: postDetails["TimePosted"],
                textContent: postDetails["TextContent"],
                media: mediaFileUrls
            };

            return post;
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPost,
    getPostsFromUser,
    getPost
}