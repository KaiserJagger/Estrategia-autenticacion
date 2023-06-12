import { Router } from "express";
import { CartManagerDB } from "../dao/CartManagerDB.js";

const router = Router();
const carro = new CartManagerDB();

// Verificacion de usuario registrado
router.use((req, res, next) => {
    if (!req.session.user) {
        res.status(401).send({error:5,errortext:'Acceso no autorizado'});
    } else {
        next()
    }
});

// Obtener todos los carritos
router.get("/", async (req, res) => {
    try {
        const result = await carro.getCarts();
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

// Obtener el detalle de un carrito
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    try {
        const result = await carro.getCartById(cid);
        if (result.error) {
            res.status(400).send(result);
        } else {
            res.status(201).send(result);
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

// Crear un carrito
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

// Agregar un producto al carrito
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

// Eliminar un carrito
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

// Eliminar un producto del carrito
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

// Actualizar un producto del carrito
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

// Actualizar un carrito
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
