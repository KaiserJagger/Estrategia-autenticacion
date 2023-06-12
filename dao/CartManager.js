import * as fs from "fs";

import { ProductManager } from "./ProductManager.js";

const prod = new ProductManager("./src/data/productos.json");

class CartManager {
    #Carts;
    #path; // ruta del archivo
    constructor(path = "./src/data/carrito.json") {
        this.#path = path;
        this.#Carts = [];
        const loadCarts = async () => {
            try {
                // Si el archivo existe copio los datos del archivo a #Carts.
                this.#Carts = JSON.parse(
                    await fs.promises.readFile(this.#path, "utf-8")
                );
            } catch {
                // Si el archivo no existe inicializo #Carts con un array vacio.
                this.#Carts = [];
            }
        };
        loadCarts();
    }
    getCarts = () => {
        return this.#Carts;
    };

    getCartById = (cid) => {
        // busco el indice del Carro
        const cartfound = this.#Carts.findIndex(
            (Carro) => Carro.id === parseInt(cid)
        );
        // Si no existe devuelvo el error
        if (cartfound < 0) {
            return { error: 2, errortxt: "el Carro no existe" };
        }
        const Carro = this.#Carts[cartfound];
        const productosCompleto = Carro.products.map((producto) => {
            // busco el id del producto en la lista de productos
            const prodexists = prod.getProductById(producto.id);
            // Si no existe agrego el error al producto, sino agrego los datos faltantes al producto
            if (prodexists.id === undefined) {
                return {
                    ...producto,
                    error: 2,
                    errortxt: "el Producto ya no esta disponible",
                };
            } else {
                return { ...producto, ...prodexists };
            }
        });
        return {id: Carro.id, products: productosCompleto};
    };

    // Metodo para obtener la ruta al archivo
    getPath = () => {
        return this.#path;
    };

    addCart = () => {
        const id =
            this.#Carts.length === 0
                ? 1
                : this.#Carts[this.#Carts.length - 1].id + 1;
        const products = [];
        const Cart = {
            id,
            products,
        };
        this.#Carts.push(Cart);
        const saveCarts = async () => {
            try {
                const filewriten = await fs.promises.writeFile(
                    this.#path,
                    JSON.stringify(this.#Carts)
                );
                return Cart;
            } catch (err) {
                return err;
            }
        };
        return saveCarts();
    };

    addProduct = ({ cid, pid }) => {
        // busco el indice del Carro
        const cartfound = this.#Carts.findIndex(
            (Carro) => Carro.id === parseInt(cid)
        );
        // Si no existe devuelvo el error
        if (cartfound < 0) {
            return { error: 2, errortxt: "el Carro no existe" };
        }
        const Carro = this.#Carts[cartfound];
        // busco el id del producto en la lista de productos
        const prodexists = prod.getProductById(pid);
        // Si no existe devuelvo el error
        if (prodexists.id === undefined) {
            return { error: 2, errortxt: "el Producto no existe" };
        }
        // busco el id del producto dentro del carro
        const prodfound = Carro.products.findIndex(
            (product) => product.id === parseInt(pid)
        );
        // Si no existe devuelvo sumo el producto al carro, sino sumo 1 en quantity
        if (prodfound < 0) {
            Carro.products.push({ id: pid, quantity: 1 });
        } else {
            Carro.products[prodfound].quantity++;
        }
        // grabo los carros
        const saveCarts = async () => {
            try {
                const filewriten = await fs.promises.writeFile(
                    this.#path,
                    JSON.stringify(this.#Carts)
                );
                return Carro;
            } catch (err) {
                return err;
            }
        };
        return saveCarts();
    };
    /*
    updateCart = ({
        id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
    }) => {
        // busco el indice del Carro
        const found = this.#Carts.findIndex(
            (Carro) => Carro.id === parseInt(id)
        );
        // Si no existe devuelvo el error, sino valido los campos y guardo
        if (found < 0) {
            return { error: 2, errortxt: "el Carro no existe" };
        } else {
            let errortxt = [];
            (!title || title.length === 0) &&
                errortxt.push("title es obligatorio.");
            (!description || description.length === 0) &&
                errortxt.push("description es obligatorio.");
            (!code || code.length === 0) &&
                errortxt.push("code es obligatorio.");
            (!price || price.length === 0) &&
                errortxt.push("price es obligatorio.");
            price &&
                (isNaN(price) || price <= 0) &&
                errortxt.push("price tiene que ser un número positivo.");
            (!stock || stock.length === 0) &&
                errortxt.push("stock es obligatorio.");
            stock &&
                (isNaN(stock) || stock <= 0) &&
                errortxt.push("stock tiene que ser un número positivo.");
            (!category || category.length === 0) &&
                errortxt.push("category es obligatorio.");
            (!status || status.length === 0) &&
                errortxt.push("status es obligatorio.");
            !thumbnail && errortxt.push("thumbnail es obligatorio.");
            // verifico si el codigo nuevo no se repite en otro Carro
            const codefound = this.#Carts.find((Carro) => Carro.code === code);
            if (codefound && parseInt(id) !== codefound.id) {
                errortxt.push("Ya se encuentra un Carro con el mismo code.");
            }

            if (errortxt.length > 0) {
                return { error: 1, errortxt: errortxt };
            } else {
                this.#Carts[found] = {
                    id,
                    title,
                    description,
                    price,
                    status,
                    category,
                    thumbnail,
                    code,
                    stock,
                };
                const saveCarts = async () => {
                    try {
                        const filewriten = await fs.promises.writeFile(
                            this.#path,
                            JSON.stringify(this.#Carts)
                        );
                        return this.#Carts[found];
                    } catch (err) {
                        return err;
                    }
                };
                return saveCarts();
            }
        }
    };

    deleteCart = (id) => {
        // busco el indice del Carro
        const found = this.#Carts.findIndex(
            (Carro) => Carro.id === parseInt(id)
        );
        console.log(id, found);
        // Si no existe devuelvo el error, sino quito el Carro del array y guardo
        if (found < 0) {
            return { error: 2, errortxt: "el Carro no existe" };
        } else {
            this.#Carts.splice(found, 1);
            const saveCarts = async () => {
                try {
                    const filewriten = await fs.promises.writeFile(
                        this.#path,
                        JSON.stringify(this.#Carts)
                    );
                    return { id: id };
                } catch (err) {
                    return err;
                }
            };
            return saveCarts();
        }
    };
*/
}

export { CartManager };
