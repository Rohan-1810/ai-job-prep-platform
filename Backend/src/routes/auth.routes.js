const {Router} = require('express');
const authController = require('../controllers/auth.controller'); 
const authRouter =Router();
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register',authController.registerUserController);


/**
 * @route POST /api/auth/login
 * @description Login a user,expects email and password in req.body
 * @access Public
 */
authRouter.post('/login', authController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Logout a user,expects token in req.cookies , clears the token cookie and adds the token to blacklist
 * @access Public
 */
authRouter.get('/logout', authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description Get the logged in user's details,expects token in req.cookies
 * @access Private
 */

authRouter.get('/get-me', authMiddleware.authUser, authController.getMeController);

module.exports = authRouter;