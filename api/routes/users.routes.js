var express = require('express')
var router = express.Router()

var userController = require('../controllers/users.controller')

router.route('/getAllUsers').get(userController.getAllUsers);
router.route('/user').put(userController.updateUser)
router.route('/user').delete(userController.deleteUser)
router.route('/user').post(userController.addUser);
router.route('/updatePassword').put(userController.updatePassword);
router.route('/user/:id').get(userController.getUserById);
router.route('/getManagerUser').get(userController.getManagerUser);
router.route('/api/v2.0.1/users/:id/shares')
    .get(userController.getShares)
    .post(userController.createShare);
router.route('/api/v2.0.1/users/:id/profile')
    .get(userController.getProfile)
    .put(userController.updateProfile);
router.route('/api/v2.0.1/users/:id/logout')
    .delete(userController.logout);
router.route("/api/v2.0.1/data")
    .get(userController.getCategories);
router.route('/api/v2.0.1/users/:id/bookmarks')
    .get(userController.getBookmarks)
    .post(userController.createBookmark);




module.exports = router