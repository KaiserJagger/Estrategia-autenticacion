const socketClient = io();

// Asigno
const addform = document.querySelector("#addproduct");
addform.addEventListener("submit", (ev) => {
    ev.preventDefault();
    // emito un evento para agragar el producto
    socketClient.emit("addProd", ev.currentTarget.prodjson.value);
});
// busco busco todos los botones para borrar el producto
const deletebutton = document.querySelectorAll(".deleteproduct");
deletebutton.forEach((button) => {
    button.addEventListener("click", (ev) => {
        ev.preventDefault();
        socketClient.emit(
            "deleteProd",
            ev.currentTarget.getAttribute("prodid"),
        );
    });
});
socketClient.on("products", (productos) => {
    let innerHtml = "";
    // creo el html para reemplazar los productos en realTimeProducts
    productos.forEach((producto) => {
        innerHtml += `
        <div id="product${producto.id}">
        <h4>${producto.title}</h4>
        <img
        src="https://sinteplastconstruccion.com.ar/assets/img/sinteplastconstruccion.com.ar/photos/w300/${producto.thumbnails}"
        alt="foto producto"
                width="100"
            />
            <p>${producto.description}</p>
            <p>Precio: $${producto.price}</p>
            <p>Categoría: ${producto.category}</p>
            <p>Imagen: ${producto.thumbnails}</p>
            <p>Status: ${producto.status}</p>
            <p>Código: ${producto.code}</p>
            <p>Stock: ${producto.stock}</p>
            <input
                type="button"
                class="deleteproduct"
                prodid="${producto.id}"
                value="Borrar este producto"
            />
            </div>
            `;
    });
    document.querySelector("#realtimeproducts").innerHTML = innerHtml;
    // busco todos los botones para borrar el producto
    const deletebutton = document.querySelectorAll(".deleteproduct");
    deletebutton.forEach((button) => {
        button.addEventListener("click", (ev) => {
            ev.preventDefault();
            socketClient.emit(
                "deleteProd",
                ev.currentTarget.getAttribute("prodid"),
            );
        });
    });
});
socketClient.on("error", (errores) => {
    let errorestxt = "ERROR\r";
    errores.errortxt.forEach((error) => {
        errorestxt += error + "\r";
    });
    alert(errorestxt);
});
socketClient.on("result", (reaultado) => {
    alert(reaultado);
});
