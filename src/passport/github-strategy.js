import { Strategy as GithubStrategy } from "passport-github2";
import passport from "passport";
import UserService from "../services/user.services.js";
import "dotenv/config"

const userService = new UserService()

const strategyConfig = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}

const registerOrLogin = async (accessToken, refreshToken, profile, done) => {
    try {
        // console.log(profile)
        const email = profile._json.email ?? "";
        const first_name = profile._json.name.split(" ")[0]
        const last_name = profile._json.name.split(" ").length === 3 ? profile._json.name.split(" ")[1].concat( " ", profile._json.name.split(" ")[2]) : profile._json.name.split(" ")[1]
        const user = await userService.getByEmail(email)
        if(user) return done(null, user); //si todo ok se ejecuta el callbackurl
        //registrar usuario porque no se encontro
        const newUser = await userService.register({
            first_name,
            last_name,
            email,
            password: " ",
            isGithub: true
        });
        return done(null, newUser);
    } catch (error) {
        return done(error)
    }
}


passport.use('github', new GithubStrategy(strategyConfig, registerOrLogin))

passport.serializeUser((user, done) => {
    done(null, user._id)
})


//busca el usuario por id y devuelve info
passport.deserializeUser(async (id, done) => {
    try {
        const user = await services.getUserById(id)
        return done(null, user)
    } catch (error) {
        return done(error)
    }

})
