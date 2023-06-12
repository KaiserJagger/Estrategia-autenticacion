import * as fs from "fs";

class ProductManager {
    #products;
    #path; // ruta del archivo
    constructor(path = "./src/productos.json") {
        this.#path = path;
        this.#products = [];
        const loadProducts = async () => {
            try {
                // Si el archivo existe copio los datos del archivo a #products.
                this.#products = JSON.parse(
                    await fs.promises.readFile(this.#path, "utf-8")
                );
            } catch {
                // Si el archivo no existe inicializo #products con un array vacio.
                this.#products = [];
            }
        };
        loadProducts();
    }
    getProducts = () => {
        return this.#products;
    };

    getProductById = (id) => {
        const found = this.#products.find((producto) => producto.id === id);
        if (!found) {
            return false;
        } else {
            return found;
        }
    };

    // Metodo para obtener la ruta al archivo
    getPath = () => {
        return this.#path;
    };

    addProduct = ({
        title,
        description,
        price,
        thumbnails = [],
        code,
        stock,
        category,
        status = true,
    }) => {
        const id =
            this.#products.length === 0
                ? 1
                : this.#products[this.#products.length - 1].id + 1;
        let errortxt = [];
        (!title || title.length === 0) &&
            errortxt.push("title es obligatorio.");
        (!description || description.length === 0) &&
            errortxt.push("description es obligatorio.");
        (!code || code.length === 0) && errortxt.push("code es obligatorio.");
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
        !Array.isArray(thumbnails) &&
            errortxt.push("thumbnails tiene que ser un array.");
        const found = this.#products.find((producto) => producto.code === code);
        if (found) {
            errortxt.push("Ya se encuentra un producto con el mismo code.");
        }
        if (errortxt.length > 0) {
            return { error: 1, errortxt: errortxt };
        } else {
            const product = {
                id,
                title,
                description,
                price,
                status,
                category,
                thumbnails,
                code,
                stock,
            };
            this.#products.push(product);
            const saveProducts = () => {
                try {
                    const filewriten = fs.promises.writeFile(
                        this.#path,
                        JSON.stringify(this.#products)
                    );
                    return product;
                } catch (err) {
                    return err;
                }
            };
            return saveProducts();
        }
    };

    updateProduct = ({
        id,
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        category,
        status,
    }) => {
        // busco el indice del producto
        const found = this.#products.findIndex(
            (producto) => producto.id === parseInt(id)
        );
        // Si no existe devuelvo el error, sino valido los campos y guardo
        if (found < 0) {
            return { error: 2, errortxt: "el producto no existe" };
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
            !thumbnails && errortxt.push("status es obligatorio.");
            !Array.isArray(thumbnails) &&
                errortxt.push("thumbnails tiene que ser un array.");
            // verifico si el codigo nuevo no se repite en otro producto
            const codefound = this.#products.find(
                (producto) => producto.code === code
            );
            if (codefound && parseInt(id) !== codefound.id) {
                errortxt.push("Ya se encuentra un producto con el mismo code.");
            }

            if (errortxt.length > 0) {
                return { error: 1, errortxt: errortxt };
            } else {
                this.#products[found] = {
                    id,
                    title,
                    description,
                    price,
                    status,
                    category,
                    thumbnails,
                    code,
                    stock,
                };
                const saveProducts = async () => {
                    try {
                        const filewriten = await fs.promises.writeFile(
                            this.#path,
                            JSON.stringify(this.#products)
                        );
                        return this.#products[found];
                    } catch (err) {
                        return err;
                    }
                };
                return saveProducts();
            }
        }
    };

    deleteProduct = (id) => {
        // busco el indice del producto
        const found = this.#products.findIndex(
            (producto) => producto.id === parseInt(id)
        );
        // Si no existe devuelvo el error, sino quito el producto del array y guardo
        if (found < 0) {
            return { error: 2, errortxt: "el producto no existe" };
        } else {
            this.#products.splice(found, 1);
            const saveProducts = () => {
                try {
                    const filewriten = fs.promises.writeFile(
                        this.#path,
                        JSON.stringify(this.#products)
                    );
                    return { id: id };
                } catch (err) {
                    return err;
                }
            };
            return saveProducts();
        }
    };
}

export { ProductManager };
