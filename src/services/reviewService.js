const Review = require('../models/Review');

async function createReview(userId, data) {
    const review = await Review.create({ ...data, userId });
    return review;
}

async function updateReview(reviewId, userId, data) {
    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) throw new Error('Đánh giá không tồn tại hoặc không có quyền sửa');
    const { userId: _uid, routeId: _rid, ...allowed } = data;
    Object.assign(review, allowed);
    await review.save();
    return review;
}

async function deleteReview(reviewId, userId) {
    const review = await Review.findOneAndDelete({ _id: reviewId, userId });
    if (!review) throw new Error('Đánh giá không tồn tại hoặc không có quyền xóa');
    return true;
}

async function listReviews({ page = 1, limit = 10, rating, sort = 'newest', routeId }) {
    const query = {};
    if (routeId) query.routeId = routeId;
    if (rating != null && rating !== '') {
        const r = Number(rating);
        if (r >= 1 && r <= 5) query.rating = r;
    }
    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        Review.find(query)
            .sort(sortOpt)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'full_name email')
            .populate('routeId', 'code name'),
        Review.countDocuments(query),
    ]);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function getReviewById(reviewId) {
    const review = await Review.findById(reviewId)
        .populate('userId', 'full_name email')
        .populate('routeId', 'code name');
    if (!review) throw new Error('Đánh giá không tồn tại');
    return review;
}

module.exports = {
    createReview,
    updateReview,
    deleteReview,
    listReviews,
    getReviewById,
};
