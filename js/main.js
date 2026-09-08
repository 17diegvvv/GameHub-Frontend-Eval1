const productos = [
    { 
        id: 1, 
        nombre: "Mouse Gamer Pro Ultra", 
        precio: 45000, 
        imagen: "https://media.falabella.com/falabellaCL/155880174_01/w=1200,h=1200,fit=pad", 
        categoria: "perifericos", 
        stock: 10,
        descripcion: "Sensor óptico de 16.000 DPI, switches mecánicos con 50 millones de clics de vida útil y diseño ergonómico ultraligero para largas sesiones de juego competitivo."
    },
    { 
        id: 2, 
        nombre: "Teclado Mecánico RGB Switch Red", 
        precio: 65000, 
        imagen: "https://progaming.cl/wp-content/uploads/2024/11/new-project-2024-08-05t103413023-341a2285-f798-4bda-8baf-24c06f1b227c.jpg", 
        categoria: "perifericos", 
        stock: 5,
        descripcion: "Formato TKL (sin pad numérico) ideal para setups compactos. Switches lineales rojos silenciosos y retroiluminación RGB personalizable por tecla."
    },
    { 
        id: 3, 
        nombre: "Audífonos Surround 7.1", 
        precio: 55000, 
        imagen: "https://tienda.lancenter.cl/16960-large_default/redragon-h312-audifonos-gamer-71-surround-sound.jpg", 
        categoria: "audio", 
        stock: 8,
        descripcion: "Audio espacial 7.1 virtual para detectar cada paso. Almohadillas de espuma viscoelástica y micrófono con cancelación de ruido desmontable."
    },
    { 
        id: 4, 
        nombre: "Monitor 24\" 144Hz IPS", 
        precio: 180000, 
        imagen: "https://www.game.co.uk/images/imgzoom/73/73552169_xxl.jpg", 
        categoria: "monitores", 
        stock: 2,
        descripcion: "Panel IPS con tiempo de respuesta de 1ms y tasa de refresco de 144Hz. AMD FreeSync Premium para una imagen fluida sin cortes."
    }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let descuentoAplicado = 0;

function validarCorreoRestringido(correo) {
    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    return dominiosPermitidos.some(dominio => correo.endsWith(dominio));
}

function renderizarCatalogo(idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) return;
    
    contenedor.innerHTML = ""; 
    
    productos.forEach(producto => {
        const article = document.createElement("article");
        article.classList.add("tarjeta-producto");
        const precioFormateado = producto.precio.toLocaleString('es-CL');
        
        article.innerHTML = `
            <div style="margin-bottom: 15px; height: 160px; overflow: hidden; border-radius: 4px; background: white;">
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <h4>${producto.nombre}</h4>
            <p class="precio">$${precioFormateado} CLP</p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="detalle.html?id=${producto.id}" class="btn-secundario" style="text-decoration: none;">Ver Detalle</a>
                <button class="btn-primario" onclick="agregarAlCarrito(${producto.id})">Comprar</button>
            </div>
        `;
        contenedor.appendChild(article);
    });
}

function renderizarDetalle() {
    const contenedor = document.getElementById("contenedor-detalle");
    if (!contenedor) return;

    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = parseInt(urlParams.get("id"));
    const producto = productos.find(p => p.id === idProducto);

    if (!producto) {
        contenedor.innerHTML = "<h2>Producto no encontrado</h2><a href='catalogo.html' class='btn-secundario' style='display:inline-block; margin-top:20px; text-decoration:none;'>Volver al catálogo</a>";
        return;
    }

    contenedor.innerHTML = `
        <div style="display: flex; gap: 40px; background: var(--color-superficie); padding: 40px; border-radius: 8px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px; background: white; border-radius: 8px; padding: 20px; display: flex; align-items: center; justify-content: center;">
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100%; max-height: 400px; object-fit: contain;">
            </div>
            <div style="flex: 1; min-width: 300px;">
                <h2 style="margin-bottom: 10px;">${producto.nombre}</h2>
                <span style="background: var(--color-fondo); padding: 5px 10px; border-radius: 4px; font-size: 14px;">${producto.categoria.toUpperCase()}</span>
                <p class="precio" style="font-size: 32px; margin: 20px 0;">$${producto.precio.toLocaleString('es-CL')} CLP</p>
                <p style="color: var(--color-texto); line-height: 1.6; margin-bottom: 20px;">${producto.descripcion}</p>
                <p style="margin-bottom: 20px;">Stock disponible: <strong>${producto.stock} unidades</strong></p>
                
                <button class="btn-primario" style="font-size: 18px; padding: 15px 30px; width: 100%;" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);

    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
        } else {
            alert("No hay más stock disponible de este producto.");
            return;
        }
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();
    alert(`¡${producto.nombre} agregado al carrito!`);
}

function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.innerText = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }
}

function renderizarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    if (!contenedorCarrito) return;
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        document.getElementById("btn-pagar").style.pointerEvents = "none";
        document.getElementById("btn-pagar").style.opacity = "0.5";
        actualizarTotales();
        return;
    }

    document.getElementById("btn-pagar").style.pointerEvents = "auto";
    document.getElementById("btn-pagar").style.opacity = "1";

    carrito.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item-carrito");
        const subtotalItem = (item.precio * item.cantidad).toLocaleString('es-CL');
        
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap: 15px;">
                <div style="width: 50px; height: 50px; background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                    <img src="${item.imagen}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
                <div>
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toLocaleString('es-CL')} c/u</p>
                </div>
            </div>
            <div class="controles-cantidad">
                <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-cantidad" onclick="modificarCantidad(${item.id}, 1)">+</button>
            </div>
            <div style="text-align: right;">
                <p class="precio">$${subtotalItem}</p>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">Quitar</button>
            </div>
        `;
        contenedorCarrito.appendChild(div);
    });
    actualizarTotales();
}

function modificarCantidad(id, cambio) {
    const item = carrito.find(p => p.id === id);
    const productoBase = productos.find(p => p.id === id);
    
    if (item) {
        const nuevaCantidad = item.cantidad + cambio;
        if (nuevaCantidad > 0 && nuevaCantidad <= productoBase.stock) {
            item.cantidad = nuevaCantidad;
        } else if (nuevaCantidad > productoBase.stock) {
            alert("No puedes superar el stock disponible.");
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
        renderizarResumenCheckout();
        actualizarContador();
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    renderizarResumenCheckout();
    actualizarContador();
}

function actualizarTotales() {
    if (!document.getElementById("subtotal-carrito")) return;
    const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const descuentoDinero = subtotal * descuentoAplicado;
    const total = subtotal - descuentoDinero;
    document.getElementById("subtotal-carrito").innerText = `$${subtotal.toLocaleString('es-CL')} CLP`;
    document.getElementById("descuento-carrito").innerText = `-$${descuentoDinero.toLocaleString('es-CL')} CLP`;
    document.getElementById("total-carrito").innerText = `$${total.toLocaleString('es-CL')} CLP`;
}

function aplicarCupon() {
    const input = document.getElementById("input-cupon").value.toUpperCase();
    const mensaje = document.getElementById("mensaje-cupon");
    if (input === "PROMO20") {
        descuentoAplicado = 0.20;
        mensaje.style.color = "var(--color-acento)";
        mensaje.innerText = "Cupón aplicado con éxito.";
    } else {
        descuentoAplicado = 0;
        mensaje.style.color = "var(--color-error)";
        mensaje.innerText = "Cupón inválido.";
    }
    actualizarTotales();
}

function renderizarResumenCheckout() {
    const contenedorResumen = document.getElementById("resumen-checkout");
    if (!contenedorResumen) return;

    if (carrito.length === 0) {
        contenedorResumen.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    let html = "";
    let subtotal = 0;

    carrito.forEach(item => {
        const subtotalItem = item.precio * item.cantidad;
        subtotal += subtotalItem;
        html += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
                <span>${item.cantidad}x ${item.nombre}</span>
                <span>$${subtotalItem.toLocaleString('es-CL')}</span>
            </div>
        `;
    });

    html += `
        <div style="border-top: 1px solid #2a3f5a; margin-top: 15px; padding-top: 15px; font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; color: var(--color-acento);">
            <span>TOTAL:</span>
            <span>$${subtotal.toLocaleString('es-CL')} CLP</span>
        </div>
    `;
    contenedorResumen.innerHTML = html;
}

// Eventos de Formularios
const formCheckout = document.getElementById("form-checkout");
if (formCheckout) {
    formCheckout.addEventListener("submit", function(e) {
        e.preventDefault();
        if (carrito.length === 0) {
            alert("No puedes comprar con el carrito vacío.");
            return;
        }
        
        const correo = document.getElementById("checkout-correo").value;
        if (!validarCorreoRestringido(correo)) {
            alert("El correo de despacho debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
            return;
        }

        const telefono = document.getElementById("checkout-tel").value;
        if (telefono.length < 8 || isNaN(telefono)) {
            document.getElementById("error-tel").innerText = "Ingresa un teléfono numérico válido.";
            return;
        }
        
        alert("¡Orden procesada! Tu pago ha sido simulado y aprobado.");
        localStorage.removeItem("carrito");
        window.location.href = "ordenes.html";
    });
}

const formRegistro = document.getElementById("form-registro");
if (formRegistro) {
    formRegistro.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const correo = document.getElementById("registro-correo").value;
        const pass = document.getElementById("registro-pass").value;
        const passConfirm = document.getElementById("registro-pass-confirm").value;
        const tel = document.getElementById("registro-tel").value;

        if (!validarCorreoRestringido(correo)) {
            alert("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com");
            return;
        }
        
        if (pass.length < 4 || pass.length > 10) {
            alert("La contraseña debe tener entre 4 y 10 caracteres.");
            return;
        }
        
        if (pass !== passConfirm) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        if (tel && (tel.length < 8 || isNaN(tel))) {
            alert("El teléfono debe ser un número válido.");
            return;
        }

        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        window.location.href = "login.html";
    });
}

const formNewsletter = document.getElementById("form-newsletter");
if (formNewsletter) {
    formNewsletter.addEventListener("submit", function(e) {
        e.preventDefault(); 
        const email = document.getElementById("email-news").value;
        const errorElement = document.getElementById("error-news");
        
        if (!validarCorreoRestringido(email)) {
            errorElement.innerText = "Solo correos @duoc.cl, @profesor.duoc.cl o @gmail.com";
        } else {
            errorElement.innerText = "";
            alert("¡Suscripción exitosa!");
            formNewsletter.reset();
        }
    });
}

// Ejecución
renderizarCatalogo("contenedor-destacados");
renderizarCatalogo("contenedor-catalogo");
renderizarCarrito();
renderizarResumenCheckout();
actualizarContador();
renderizarDetalle();