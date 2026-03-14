const Post = require('../models/Post');

async function createPost(userId, data) {
    const post = await Post.create({ ...data, user: userId });
    return post.populate('user', 'full_name email');
}

async function updatePost(postId, userId, data) {
    const post = await Post.findOne({ _id: postId, user: userId });
    if (!post) throw new Error('Bài viết không tồn tại hoặc không có quyền sửa');
    const { user, ...allowed } = data;
    Object.assign(post, allowed);
    await post.save();
    return post.populate('user', 'full_name email');
}

async function deletePost(postId, userId) {
    const post = await Post.findOneAndDelete({ _id: postId, user: userId });
    if (!post) throw new Error('Bài viết không tồn tại hoặc không có quyền xóa');
    return post;
}

async function listPosts({ page = 1, limit = 10, search, sort = 'newest' }) {
    const query = {};
    if (search && search.trim()) {
        const s = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(s, 'i');
        query.$or = [{ title: re }, { content: re }, { summary: re }];
    }
    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        Post.find(query).sort(sortOpt).skip(skip).limit(limit).populate('user', 'full_name email'),
        Post.countDocuments(query),
    ]);

    return {
        posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function getPostById(postId) {
    const post = await Post.findById(postId).populate('user', 'full_name email');
    if (!post) throw new Error('Bài viết không tồn tại');
    return post;
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    listPosts,
    getPostById,
};
