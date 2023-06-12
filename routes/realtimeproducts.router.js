import { Router } from "express";
import { ProductManager } from "../dao/ProductManager.js";

const router = Router();

const prod = new ProductManager("./src/data/productos.json");

router.get("/", async (req, res) => {
    try {
        const products = prod.getProducts();
        res.render("realTimeProducts", { products: products });
    } catch (err) {
        res.status(400).send(err);
    }
});

export default router;
