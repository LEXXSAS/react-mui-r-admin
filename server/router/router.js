// @ts-nocheck
const Router = require('express').Router;
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');
const testMiddleware = require('../middlewares/test-middleware');
const testMiddlewareNext = require('../middlewares/test-middleware-next');
const userController = require('../controllers/user-controller');

router.post('/registration', body('username').isLength({min: 2, max: 32}),
  userController.registration
 );
 
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/getcount', userController.getcount);
router.get('/users', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getUsers);
router.get('/otherpage', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getOther);
router.get('/othertwo', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getOther);
router.post('/roles', userController.createRoles);

// crud mern роуты
router.get('/getall', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getAllData);
router.get('/getsysteminfo', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getSystemDataInfo);
router.get('/paginationall', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getAllPaginationData);
router.get('/searchall', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getAllSearchData);
router.get('/searchqueryall', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getAllSearchAndPagination);
router.get('/searchqueryalltwo', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getAllSearchAndPaginationtwo);
router.get('/getallusersfor', roleMiddleware(['ADMIN']), userController.getAllUsersForAdmin);
router.post('/createuser', roleMiddleware(['ADMIN', 'USER', 'TEST']), testMiddleware(['ADMIN', 'USER', 'TEST']), userController.createSingleUser);
router.post('/createmanyusers', roleMiddleware(['ADMIN']), testMiddleware(['ADMIN']), userController.createManyUsers);
router.get('/getuser/:id', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getSingleUser);
router.get('/getusertwo/:id', roleMiddleware(['ADMIN', 'USER', 'TEST']), userController.getSingleUserTwo);
router.put('/updateuser/:id', roleMiddleware(['ADMIN', 'USER', 'TEST']), testMiddleware(['ADMIN', 'USER', 'TEST']), userController.updateSingleUser);
router.delete('/deleteuser/:id', roleMiddleware(['ADMIN', 'USER', 'TEST']), testMiddleware(['ADMIN', 'USER', 'TEST']), userController.deleteSingleUser);
router.delete('/deleteuserfrom/:id', roleMiddleware(['ADMIN', 'USER', 'TEST']), testMiddleware(['ADMIN', 'USER', 'TEST']), userController.deleteSingleUserfromusers);

module.exports = router
