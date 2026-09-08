const productos = [
    { id: 1, nombre: "Mouse Gamer Pro", precio: 45000, imagen: "IMG", categoria: "perifericos" },
    { id: 2, nombre: "Teclado Mecánico RGB", precio: 65000, imagen: "IMG", categoria: "perifericos" },
    { id: 3, nombre: "Audífonos 7.1", precio: 55000, imagen: "IMG", categoria: "audio" },
    { id: 4, nombre: "Monitor 144Hz", precio: 180000, imagen: "IMG", categoria: "monitores" }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const contenedorDestacados = document.getElementById("contenedor-destacados");

function renderizarProductos() {
    if (!contenedorDestacados) return;
    
    contenedorDestacados.innerHTML = ""; 
    
    productos.forEach(producto => {
        const article = document.createElement("article");
        article.classList.add("tarjeta-producto");
        const precioFormateado = producto.precio.toLocaleString('es-CL');
        
        article.innerHTML = `
            <div class="imagen-placeholder">${producto.imagen}</div>
            <h4>${producto.nombre}</h4>
            <p class="precio">$${precioFormateado} CLP</p>
            <button class="btn-primario" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
        `;
        contenedorDestacados.appendChild(article);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    alert(`¡${producto.nombre} agregado al carrito!`);
}

function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (!contador) return;

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contador.innerText = totalItems;
}

const formNewsletter = document.getElementById("form-newsletter");
if (formNewsletter) {
    formNewsletter.addEventListener("submit", function(e) {
        e.preventDefault(); 
        const email = document.getElementById("email-news").value;
        const errorElement = document.getElementById("error-news");
        
        if (!email.includes("@") || !email.includes(".")) {
            errorElement.innerText = "Por favor ingresa un correo válido.";
        } else {
            errorElement.innerText = "";
            alert("¡Suscripción exitosa!");
            formNewsletter.reset();
        }
    });
}

renderizarProductos();
actualizarContador();