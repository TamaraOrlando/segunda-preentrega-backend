const socket = io();

socket.on("productos", (data) => {
    renderProductos(data);
})

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";

    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("productCard");

        card.innerHTML =
            `
            <p class="textCard"> ${item.title} </p>
            <p class="textCard"> $${item.price} </p>
            <button class="deleteBtn" data-id="${item.id}"> Eliminar </button>
        `

        contenedorProductos.appendChild(card);

    });

    document.querySelectorAll(".deleteBtn").forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            socket.emit("deleteProduct", productId);
        });
    });
};


const formularioProducto = document.getElementById("formularioProducto");

if (formularioProducto) {
    formularioProducto.addEventListener("submit", (e) => {
        e.preventDefault();


        const newProduct = {
            title: e.target.title.value,
            description: e.target.description.value,
            price: e.target.price.value
        };

        socket.emit("addProduct", newProduct);
        e.target.reset();
    });
}


