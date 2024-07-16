const { createPost } = require("../../models/post");
const { getPresignedPutUrl } = require("../../services/bucket");
const getUniqueId = require("../../services/uuid");
const { createPostSchema } = require("./posts.schemas");

async function handleCreatePost(req, res, next) {
    if (!req.session.username) {
        return next(createError(401, "Not logged in."));
    }

    const { value: post, error } = createPostSchema.validate(req.body);
    
    if (error) {
        return next(createError(400, error.details[0].message));
    }

    const userId = req.session.userId;
    const uniqueMediaFileIds = post.mediaFiles.map(_ => getUniqueId());

    try {
        const postId = await createPost(userId, post.textContent, uniqueMediaFileIds);
        const uploadUrls = [];

        for (const fileId of uniqueMediaFileIds) {
            const url = await getPresignedPutUrl(fileId);
            uploadUrls.push(url);
        }

        res.status(201).json({
            message: "Post created successfully.",
            resourceUrl: `/api/posts/${postId}`,
            mediaUploadUrls: uploadUrls.map((url, index) => ({
                file: post.mediaFiles[index],
                url: url
            }))
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    handleCreatePost
}