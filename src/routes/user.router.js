import { Router } from 'express';
import { checkAuth } from '../middlewares/authJwt.js';
import UserController from '../controllers/user.controllers.js';
import passport from 'passport';
const controller = new UserController();

const router = Router();

router.post('/register', passport.authenticate('register') , controller.register);

router.post('/login', passport.authenticate('login'),controller.login);

router.get('/profile', checkAuth, controller.profile);

export default router;