import passport from "passport"
import {Strategy as LocalStrategy} from "passport-local"
import UserService from "../services/user.services.js";

const userService = new UserService()


const strategyConfig = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
};

const signUp = async (req, email, password, done) => {
    try {
        const user = await userService.getByEmail(email);
        if(user) return done(null, false);
        const newUser = await userService.register(req.body);
        return done(null, newUser);
    } catch (error) {
        console.log(error);
        return done(error);
    }
};

const login = async (req, email, password, done) => {
    try {
        const {user, token} = await userService.login({ email, password });
        if(!user)return done(null, false, { message: 'Alto ahí bandido ⛔' });
        user.token = token
        return done(null, user)
    } catch (error) {
        console.log(error)
        return done(error)
    }
};

const signUpStrategy = new LocalStrategy(strategyConfig, signUp);
const loginStrategy = new LocalStrategy(strategyConfig, login);

passport.use('register', signUpStrategy);
passport.use('login', loginStrategy);

//req.session.passport.user = ''
passport.serializeUser((user, done)=>{
    done(null, user._id)
});

passport.deserializeUser(async(id, done)=>{
    try {

        const user = await userService.getUserById(id);
        return done(null, user);
    } catch (error) {
        done(error)
    }
});
