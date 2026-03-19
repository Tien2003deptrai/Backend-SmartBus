const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const adminUserValidation = require('../validations/adminUserValidation');
const auth = require('../middlewares/auth');
const requireAdmin = require('../middlewares/requireAdmin');

router.use(auth);
router.use(requireAdmin);

router.post(
    '/users/listUsers',
    adminUserValidation.listUserRules,
    adminUserValidation.validate,
    adminUserController.getListUser
);

router.get(
    '/users/detail/:id',
    adminUserValidation.idParamRule,
    adminUserValidation.validate,
    adminUserController.getUserDetail
);

router.put(
    '/users/updateActive/:id',
    adminUserValidation.idParamRule,
    adminUserValidation.updateActiveRules,
    adminUserValidation.validate,
    adminUserController.updateUserActive
);

router.delete(
    '/users/delete/:id',
    adminUserValidation.idParamRule,
    adminUserValidation.validate,
    adminUserController.deleteUser
);

module.exports = router;
