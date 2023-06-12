// Importacion de modulos y paquetes
import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import { messageModel } from "./dao/models/messageModel.js";
import initializatePassport from "./config/passport.config.js";
import passport from "passport";
import dotenv from 'dotenv'
dotenv.config()

import { Server } from "socket.io";

// Importacion de rutas(enrutador)
import apiProductsRouter from "./routes/apiProducts.router.js";
import productsRouter from "./routes/products.router.js";
import apiCartsRouter from "./routes/apiCarts.router.js";
import cartsRouter from "./routes/carts.router.js";
import realTimeProductsRouter from "./routes/realtimeproducts.router.js";
import chatRouter from "./routes/chat.router.js";
import userRouter from "./routes/users.router.js";

mongoose.set("strictQuery", false);

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
app.use(
    session({
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://NicoAndreolli:Nico1507veintiuno@clusters-ecommerce.42ewhbm.mongodb.net/",
            dbName: "JaggerStore",
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
            ttl: 14 * 24 * 60 * 60, //tiempo de vida
        }),
        secret: "c0d3r",
        resave: true,
        saveUninitialized: true,
    }));

    initializatePassport()
    app.use(passport.initialize())
    app.use(passport.session())

// Configuracion de rutas
app.use("/realtimeproducts", realTimeProductsRouter);
app.use("/api/products", apiProductsRouter);
app.use("/api/carts", apiCartsRouter);
app.use("/products", productsRouter);
app.use("/carts", cartsRouter);
app.use("/chat", chatRouter);
app.use("/", userRouter);

//  Archivos estaticos
app.use(express.static(__dirname + "/public"));


 //Conexion a la base de datos
try {
    await mongoose.connect(
        "mongodb+srv://NicoAndreolli:Nico1507veintiuno@clusters-ecommerce.42ewhbm.mongodb.net/JaggerStore",
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
