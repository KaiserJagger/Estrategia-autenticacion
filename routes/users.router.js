import { Router } from "express";
import { UserManagerDB } from "../dao/UserManagerDB.js";
import passport from "passport";

const router = Router();
const user = new UserManagerDB();
router.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        res.render("login", {});
    }
});

router.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        res.render("login", {});
    }
});

router.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/failurelogin" }),
    async (req, res) => {
        if (!req.user) {
            res.render("login", {
                message: {
                    type: "error",
                    title: "Error de logueo",
                    text: "El correo eletrónico o contraseña no son correctos",
                },
            });
        } else {
            delete req.user.password;
            delete req.user._id;
            delete req.user.__v;
            req.session.user = req.user;
            res.redirect("/products");
        }
    },
);

router.get("/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/products");
    } else {
        res.render("register", {});
    }
});

router.post(
    "/register",
    passport.authenticate("register", {
        failureRedirect: "failureregister",
    }),
    async (req, res) => {
        res.render("login", {
            message: {
                type: "success",
                title: "Registro exitoso",
                text: "Iniciá tu session con los datos cargados",
            },
        });
    },
);

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.status(500).render("errors", { error: error });
        } else {
            res.redirect("login");
        }
    });
});

router.get("/failureregister", (req, res) => {
    res.render("register", {
        message: {
            type: "error",
            title: "Error de registro",
            text: "El email ya se encuentre registrado",
        },
    });
});

router.get("/failurelogin", (req, res) => {
    res.render("login", {
        message: {
            type: "error",
            title: "Error de logueo",
            text: "El correo eletrónico o contraseña no son correctos",
        },
    });
});

// Auteticacion por terceros: Github
router.get("/githublogin",passport.authenticate("github", { scope: ["user: email"] }),(req, res) => {},);

router.get("/githubcallback",passport.authenticate("github", { failureRedirect: "/failurelogin" }),
    async (req, res) => {
        delete req.user.password;
        delete req.user._id;
        delete req.user.__v;
        req.session.user = req.user;
        res.redirect("/products");
    },
);

export default router;
