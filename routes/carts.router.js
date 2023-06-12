import { Router } from "express";
import { CartManagerDB } from "../dao/CartManagerDB.js";

const router = Router();
const carro = new CartManagerDB();

router.use((req, res, next) => {
    if (!req.session.user) {
        res.render("login", {
            message: {
                type: "error",
                title: "Acceso denegado",
                text: "Inicia sesión para ver los productos",
            },
        });
    } else {
        next()
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await carro.getCarts();
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.render("carts", result)
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const result = await carro.getCartById(cid);
        if (result.error) {
           res.status(400).send(result);
        } else {
            // res.status(201).send(result);
            res.render("cart", result)
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/", async (req, res) => {
    try {
        const result = await carro.addCart();
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const newCartProduct = {
        cid: req.params.cid,
        pid: req.params.pid,
    };
    try {
        const result = await carro.addProduct(newCartProduct);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const result = await carro.deleteAllProducts(cid);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    const deleteCartProduct = {
        cid: req.params.cid,
        pid: req.params.pid,
    };
    try {
        const result = await carro.deleteProduct(deleteCartProduct);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put("/:cid/product/:pid", async (req, res) => {
    const updateProduct = {
        cid: req.params.cid,
        pid: req.params.pid,
        qty: req.body.qty,
    };
    try {
        const result = await carro.updateProductQty(updateProduct);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.put("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const products = req.body;
    try {
        const result = await carro.updateAllProducts(cid, products);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});
export default router;
