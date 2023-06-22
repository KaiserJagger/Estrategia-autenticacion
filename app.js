// Importacion de modulos y paquetes
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import __dirname, { passportAuthenticate } from "./utils.js";
import { messageModel } from "./dao/models/messageModel.js";
import initializatePassport from "./config/passport.config.js";
import passport from "passport";
import dotenv from 'dotenv'

import { Server } from "socket.io";

// Importacion de rutas(enrutador)
import apiProductsRouter from "./routes/apiProducts.router.js";
import productsRouter from "./routes/products.router.js";
import apiCartsRouter from "./routes/apiCarts.router.js";
import cartsRouter from "./routes/carts.router.js";
import realTimeProductsRouter from "./routes/realtimeproducts.router.js";
import chatRouter from "./routes/chat.router.js";
import userRouter from "./routes/users.router.js";
import cookieParser from "cookie-parser";

mongoose.set("strictQuery", false);
dotenv.config()
//Puerto
const port = 8080;

// Configuracion de express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuracion de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Configuracion de la session
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

initializatePassport()
app.use(passport.initialize())
app.use(passport.session())

// Configuracion de rutas
app.use("/realtimeproducts",passportAuthenticate("jwt"),realTimeProductsRouter);
app.use("/api/products", passportAuthenticate("jwt"), apiProductsRouter);
app.use("/api/carts", passportAuthenticate("jwt"), apiCartsRouter);
app.use("/products", passportAuthenticate("jwt"), productsRouter);
app.use("/carts", passportAuthenticate("jwt"), cartsRouter);
app.use("/chat", passportAuthenticate("jwt"), chatRouter);
app.use("/", userRouter);

//  Archivos estaticos
app.use(express.static(__dirname + "/public"));

 //Conexion a la base de datos
try {
    await mongoose.connect(
        "mongodb+srv://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@clusters-ecommerce.42ewhbm.mongodb.net/JaggerStore",
        {
            serverSelectionTimeoutMS: 5000,
        },
    );
    console.log("DB conected");
    const httpServer = app.listen(port, () => {
        console.log("Server corriendo en puerto: " + port);
    });

    const socketServer = new Server(httpServer);

    // Configuracion del Socket.io
    socketServer.on("connection", (socketClient) => {
        //const prod = new ProductManager("./src/data/productos.json");
        console.log("User conected");
        socketClient.on("deleteProd", (prodId) => {
            const result = prod.deleteProduct(prodId);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto eliminado");
            }
        });
        socketClient.on("addProd", (product) => {
            const producto = JSON.parse(product);
            const result = prod.addProduct(producto);
            if (result.error) {
                socketClient.emit("error", result);
            } else {
                socketServer.emit("products", prod.getProducts());
                socketClient.emit("result", "Producto agregado");
            }
        });
        socketClient.on("newMessage", async (message) => {
            try {
                console.log(message);
                let newMessage = await messageModel.create({
                    user: message.email.value,
                    message: message.message,
                });
                console.log("app", newMessage);
                socketServer.emit("emitMessage", newMessage);
            } catch (error) {
                console.log(error);
                socketClient.emit("error", error);
            }
        });
    });
} catch (error) {
    console.log(error);
}
