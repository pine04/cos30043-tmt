const createError = require("http-errors");

const { createPostSchema } = require("./posts.schemas");
const { createPost, getPostsFromUser, getPost } = require("../../models/post");
const { getPresignedPutUrl } = require("../../services/bucket");
const { getUniqueNameForFile } = require("../../services/uuid");

async function handleCreatePost(req, res, next) {

    const { value: post, error } = createPostSchema.validate(req.body);
    
    if (error) {
        return next(createError(400, error.details[0].message));
    }

    const userId = req.session.userId;
    const uniqueMediaFileIds = post.mediaFiles.map(fileName => getUniqueNameForFile(fileName));

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

async function handleGetPost(req, res, next) {
    const postId = req.params.postId;

    try {
        const post = await getPost(postId);
        res.status(200).json({
            post: post
        });    
    } catch (error) {
        return next(error);
    }
}

async function handleGetNewsFeed(req, res, next) {

}

async function handleGetPostsFromUser(req, res, next) {
    const username = req.params.username;
    const pageNumber = req.query.pageNumber || 1;

    try {
        const posts = await getPostsFromUser(username, pageNumber);
        res.status(200).json({
            posts: posts.map(post => `/api/posts/${post["PostID"]}`)
        });    
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    handleCreatePost,
    handleGetPost,
    handleGetNewsFeed,
    handleGetPostsFromUser
}