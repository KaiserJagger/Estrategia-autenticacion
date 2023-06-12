const socketClient = io();

Swal.fire({
    title: "Bienvenido al Chat",
    input: "email",
    text: "Para ingresar dejanos tu email",
    allowOutsideClick: false,
}).then((email) => {
    // busco todos los mensajes del usuario ingresado y les agrego el class mymessage
    const mymessages = document.querySelectorAll('*[user="'+email.value+'"');
    for (let i = 0; i < mymessages.length; i++) {
        mymessages[i].setAttribute("class", "message mymessage");
    }
    document.querySelector("#chatbox").scroll({
        top: document.querySelector("#chatbox").scrollHeight,
        left: 0,
        behavior: "smooth",
    });
    const addform = document.querySelector("#newMessage");
    addform.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const message = ev.currentTarget.message.value;
        // emito un evento para guardar el mensaje
        socketClient.emit("newMessage", {
            message,
            email,
        });
        ev.currentTarget.message.value = "";
    });
    socketClient.on("emitMessage", (newMessage) => {
        console.log(newMessage.user, email.value, newMessage.user === email);
        const mymessage =
            email.value === newMessage.user ? "message mymessage" : "message";
        const innerHtml = `
        <div class="email">
            ${newMessage.user}
        </div>
        <div class="text">
            ${newMessage.message}
        </div>
        <div class="date">
            ${newMessage.date}
        </div>`;
        const newMessageDiv = document.createElement("div");
        newMessageDiv.setAttribute("class", mymessage);
        newMessageDiv.innerHTML = innerHtml;
        console.log(innerHtml);
        document.querySelector("#chatbox").appendChild(newMessageDiv);
        document.querySelector("#chatbox").scroll({
            top: document.querySelector("#chatbox").scrollHeight,
            left: 0,
            behavior: "smooth",
        });
    });
});

/*
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
*/
