import "dotenv/config" //para las variables de entorno
import express, { json, urlencoded } from "express" //modulo completo y json - urlencoded ya desestructurado
import morgan from "morgan" //para mostrar los log de las solicitudes
import { errorHandler } from "./middlewares/errorHandler.js" //manejador de errores
import { initMongoDB } from "./db/connection.js" //conexion a la db
import MainRouter from "./routes/index.js"
import cookieParser from "cookie-parser"
import passport from "passport"
import MongoStore from "connect-mongo"
import session from "express-session"
import "./passport/local-strategy.js"

const mainRouter = new MainRouter()

const app = express(); //instanciar la clase de express

//configuracion de las opciones para el manejo de la sesion
const storeConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_ATLAS_URL,
        crypto: { secret: process.env.SECRET_KEY_JWT },
        ttl: 180,
    }),
    secret: process.env.SECRET_KEY_JWT,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 180000 }
};


app
    .use(json()) //middleware para analizar los datos en formato json
    .use(urlencoded({ extended: true })) //middleware para analizar los datos que vengan de formularios html
    .use(cookieParser()) //Convierte las cookies de la solicitud en un objeto JavaScript accesible en req.cookies.
    .use(session(storeConfig)) //Permite que los datos de la sesión persistan entre solicitudes.
    .use(morgan("dev")) //para mostrar los log de las solicitudes
    .use(passport.initialize()) //permite que Passport gestione la autenticación de solicitudes.
    .use(passport.session()) // Almacena la información de la sesión del usuario en el servidor
    .use("/api", mainRouter.getRouter()) //aca se inicializan todas las rutas centralizadas en una clase
    .use(errorHandler) //manejador de errores


const PERSISTENCE = process.env.PERSISTENCE //persistencia para el dao

if (PERSISTENCE === "MONGO") initMongoDB()

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`Server ok PORT: ${PORT}`))