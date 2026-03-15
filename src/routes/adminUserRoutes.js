const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const adminUserValidation = require('../validations/adminUserValidation');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');

router.post(
    '/users/listUsers',
    auth,
    requireAdmin,
    adminUserValidation.listUserRules,
    adminUserValidation.validate,
    adminUserController.getListUser
);

router.get(
    '/users/detail/:id',
    auth,
    requireAdmin,
    adminUserValidation.idParamRule,
    adminUserValidation.validate,
    adminUserController.getUserDetail
);

router.put(
    '/users/updateActive/:id',
    auth,
    requireAdmin,
    adminUserValidation.idParamRule,
    adminUserValidation.updateActiveRules,
    adminUserValidation.validate,
    adminUserController.updateUserActive
);

router.delete(
    '/users/delete/:id',
    auth,
    requireAdmin,
    adminUserValidation.idParamRule,
    adminUserValidation.validate,
    adminUserController.deleteUser
);

module.exports = router;
