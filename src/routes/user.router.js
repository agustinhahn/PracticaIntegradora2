import { Router } from 'express';
import { checkAuth } from '../middlewares/authJwt.js';
import UserController from '../controllers/user.controllers.js';
import passport from 'passport';
const controller = new UserController();

const router = Router();

//register y login con passport local
router.post('/register', passport.authenticate('register') , controller.register);
router.post('/login', passport.authenticate('login'),controller.login);

//register y login con passport github
router.get("/register-github", passport.authenticate('github',{scope:['user:email']})) //endpoint que se dispara cuando el user ponga en iniciar sesion con github
router.get('/profile',passport.authenticate('github',{scope:['user:email']}), controller.githubResponse)

router.get('/current', checkAuth, controller.infoSession)
// router.get('/profile', checkAuth, controller.profile);
router.post("/logout",checkAuth, controller.logout); //no funciona

export default router;