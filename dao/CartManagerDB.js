import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "./models/product.model.js";

class CartManagerDB {
    // Obtiene una lista de los carritos paginados
    getCarts = async (limit = 10, page = 1, query = "{}", sort) => {
        // verifico si query tiene un formato valido
        const isValidJSON = (query) => {
            try {
                JSON.parse(query);
                return true;
            } catch (e) {
                return false;
            }
        };
        const vquery = isValidJSON ? JSON.parse(query) : {};
        // verifico si sort tiene un formato valido
        const carts = cartModel.paginate(vquery, {
            page,
            limit,
            lean: true,
            sort,
        });
        return carts;
    };

    // Busca un carrito especifico por su id
    getCartById = async (cid) => {
        try {
            const cartfound = await cartModel.findOne({ _id: cid }).lean().exec();
            if (cartfound === null) {
                return { error: 2, errortxt: "el carro no existe" };
            }
            return cartfound;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };

    // Crea un carrito vacio
    addCart = async () => {
        const products = [];
        const cart = {
            products,
        };
        try {
            const newCart = new cartModel(cart);
            newCart.save();
            return newCart;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };

    // Agrega productos a un carrito existente
    addProduct = async ({ cid, pid }) => {
        try {
            const cartfound = await cartModel.findOne({ _id: cid });
            if (cartfound === null) {
                return { error: 2, errortxt: "el carro no existe" };
            }
            const prodexists = await productModel.findOne({ _id: pid });
            if (prodexists === null) {
                return { error: 2, errortxt: "el producto no existe" };
            }
            const prodfound = await cartModel.findOne({
                _id: cid,
                "products.product": pid,
            });
            if (prodfound === null) {
                const addedprod = await cartModel.updateOne(
                    { _id: cid },
                    { $addToSet: { products: { product: pid } } },
                );
                return addedprod;
            } else {
                const updatedprod = await cartModel.updateOne(
                    { _id: cid, "products.product": pid },
                    { $inc: { "products.$.quantity": 1 } },
                );
                return updatedprod;
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };

    // Actualiza todos los producto de un carrito
    updateAllProducts = async (cid, products) => {
        try {
            const cartfound = await cartModel.findOne({ _id: cid });
            if (cartfound === null) {
                return { error: 2, errortxt: "el carro no existe" };
            }
            const prodids = products.products.map((product) => {
                return product.product;
            });
            const prodexists = await productModel.find({
                _id: { $in: prodids },
            });
            if (prodexists.length === products.products.length) {
                const updatedProducts = await cartModel.updateOne(
                    { _id: cid },
                    { $set: { products: products.products} },
                );
                return updatedProducts;
            } else {
                return {
                    error: 2,
                    errortxt: "alguno de los productos no existe",
                };
            }
            return prodexists;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };

    // Actualiza la cantidad de productos
    updateProductQty = async ({ cid, pid, qty }) => {
        try {
            if (isNaN(qty) || !Number.isInteger(parseFloat(qty)) || qty < 1) {
                return {
                    error: 2,
                    errortxt:
                        "quantity tiene que ser un numero entero mayor que 0",
                };
            }
            const cartfound = await cartModel.findOne({ _id: cid });
            if (cartfound === null) {
                return { error: 2, errortxt: "el carro no existe" };
            }
            const prodfound = await cartModel.findOne({
                _id: cid,
                "products.product": pid,
            });
            if (prodfound === null) {
                return {
                    error: 2,
                    errortxt: "el producto no esta en el carro",
                };
            } else {
                const updatedprod = await cartModel.updateOne(
                    { _id: cid, "products.product": pid },
                    { $set: { "products.$.quantity": qty } },
                );
                return updatedprod;
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };

    // Elimina todos los productos de un carrito
    deleteAllProducts = async (cid) => {
        try {
            const cartfound = await cartModel.findOne({ _id: cid });
            if (cartfound === null) {
                return { error: 2, errortxt: "el carro no existe" };
            }
            const deletedProducts = await cartModel.updateOne(
                { _id: cid },
                { $set: { products: [] } },
            );
            return deletedProducts;
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };

    // Elimina un producto especifico por su id
    deleteProduct = async ({ cid, pid }) => {
        try {
            const cartfound = await cartModel.findOne({ _id: cid });
            if (cartfound === null) {
                return { error: 2, errortxt: "el carro no existe" };
            }
            const prodfound = await cartModel.findOne({
                _id: cid,
                "products.product": pid,
            });
            if (prodfound === null) {
                return {
                    error: 2,
                    errortxt: "el producto no esta en el carro",
                };
            } else {
                const updatedprods = await cartModel.updateOne(
                    { _id: cid },
                    { $pull: { products: { product: pid } } },
                );
                return updatedprods;
            }
        } catch (error) {
            return { error: 3, servererror: error };
        }
    };
}

export { CartManagerDB };
