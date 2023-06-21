import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { dirname } from "path";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}
export default __dirname;

// GENERA TOKEN
export const generateToken = user => {
    const token = jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, {expiresIn: '24h'} )
    return token;
}

// EXTRAE VALOR DE LA COOKIE
export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[process.env.JWT_COOKIE_NAME] : null
}

// AUTENTICA USUARIO
export const passportAuthenticate = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (!user)
                return res.status(401).render("login", {
                    message: {
                        type: "error",
                        title: info.title ? info.title : "Error",
                        text: info.text ? info.text : "Iniciá la sesión",
                    },
                });
            req.user = user;
            next();
        })(req, res, next);
    };
};
export const userLogged = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (user) return res.redirect("products");
            next();
        })(req, res, next);
    };
};
export const passportAuthenticateApi = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (!user)
                return res.status(401).send({
                    error: "No existe una sesión de usuario activa",
                });
                req.user = user;
            next();
        })(req, res, next);
    };
};