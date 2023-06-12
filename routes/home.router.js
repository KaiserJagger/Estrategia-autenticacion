import { Router } from "express";
import { ProductManagerDB } from "../dao/ProductManagerDB.js";

const router = Router();
const prod = new ProductManagerDB();

router.get("/", async (req, res) => {
    let { limit=10, page=1, query, sort } = req.query;
    try {
        const products = await prod.getProducts(limit, page, query, sort);
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;
