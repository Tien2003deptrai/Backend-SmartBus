const Route = require('../models/Route');

async function createRoute(userId, data) {
    const payload = { ...data };
    if (data.stops && Array.isArray(data.stops)) {
        payload.stopsCount = data.stops.length;
    }
    if (userId) payload.userId = userId;
    const route = await Route.create(payload);
    return route;
}

async function updateRoute(routeId, userId, data) {
    const route = await Route.findOne({ _id: routeId, userId: userId });
    if (!route) throw new Error('Tuyến không tồn tại hoặc không có quyền sửa');
    const { userId: _uid, ...allowed } = data;
    Object.assign(route, allowed);
    if (allowed.stops && Array.isArray(allowed.stops)) {
        route.stopsCount = allowed.stops.length;
    }
    await route.save();
    return route;
}

async function deleteRoute(routeId, userId) {
    const route = await Route.findOneAndDelete({ _id: routeId, userId: userId });
    if (!route) throw new Error('Tuyến không tồn tại hoặc không có quyền xóa');
    return route;
}

async function listRoutes({ page = 1, limit = 10, search, sort = 'newest', userId }) {
    const query = {};
    if (userId) query.userId = userId;
    if (search && search.trim()) {
        const s = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(s, 'i');
        query.$or = [
            { name: re },
            { code: re },
            { description: re },
            { startName: re },
            { endName: re },
        ];
    }
    const sortOpt = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
    const skip = (page - 1) * limit;

    const [routes, total] = await Promise.all([
        Route.find(query).sort(sortOpt).skip(skip).limit(limit).populate('userId', 'full_name email').populate('staffId', 'full_name email'),
        Route.countDocuments(query),
    ]);

    return {
        routes,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

async function getRouteById(routeId) {
    const route = await Route.findById(routeId).populate('userId', 'full_name email').populate('staffId', 'full_name email');
    if (!route) throw new Error('Tuyến không tồn tại');
    return route;
}

module.exports = {
    createRoute,
    updateRoute,
    deleteRoute,
    listRoutes,
    getRouteById,
};
