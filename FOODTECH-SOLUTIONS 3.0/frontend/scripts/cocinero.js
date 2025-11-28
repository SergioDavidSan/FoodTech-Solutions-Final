// ============================================================
//  VARIABLES Y CONSTANTES
// ============================================================
const LOGIN_PAGE = "../../modules/login.html"; 

// ============================================================
//  SERVICIOS (Wrappers)
// ============================================================
const pedidoService = {
    async getPedidosPorEstado(estado) {
        try {
            return await apiService.request(`/pedidos/estado/${estado}`);
        } catch (error) {
            console.error("Error obteniendo pedidos:", error);
            return [];
        }
    },

    async updatePedidoEstado(id, estado) {
        return await apiService.updatePedidoEstado(id, estado);
    },

    async marcarPedidoListo(id) {
        return await apiService.updatePedidoEstado(id, "LISTO");
    }
};

// ============================================================
//  MAIN (Inicialización)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("👨‍🍳 Iniciando Panel de Cocinero...");

    // 1. VERIFICACIÓN DE SEGURIDAD
    if (typeof authService === 'undefined') {
        window.location.href = LOGIN_PAGE;
        return;
    }

    if (!authService.isAuthenticated() || !authService.hasRole("cocinero")) {
        authService.logout();
        window.location.href = LOGIN_PAGE;
        return;
    }

    // 2. MOSTRAR USUARIO
    const userInfo = authService.getCurrentUser();
    const userInfoElement = document.querySelector(".user-info");
    if (userInfoElement && userInfo) {
        userInfoElement.textContent = `👨‍🍳 ${userInfo.username || "Cocinero"}`;
    }

    // 3. CARGAR DATOS
    cargarPedidosActivos();

    // 4. EVENTOS GLOBALES (Delegación)
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-preparar")) {
            iniciarPreparacion(e.target);
        }
        if (e.target.classList.contains("btn-terminar")) {
            terminarPreparacion(e.target);
        }
    });

    // 5. LOGOUT
    const logoutBtn = document.getElementById("logout-button");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            authService.logout();
        });
    }

    // Recarga automática cada 30s
    setInterval(cargarPedidosActivos, 30000);
});


// ============================================================
//  LÓGICA DE PEDIDOS
// ============================================================

async function cargarPedidosActivos() {
    const contenedor = document.querySelector(".pedidos-grid");
    if (!contenedor) return;

    try {
        console.log("🔄 Actualizando pedidos...");
        const pedidosPendientes = await pedidoService.getPedidosPorEstado("PENDIENTE");
        const pedidosEnPreparacion = await pedidoService.getPedidosPorEstado("EN_PREPARACION");
        
        const todosLosPedidos = [...pedidosEnPreparacion, ...pedidosPendientes];
        // --- DATOS DE PRUEBA (BORRAR LUEGO) ---
todosLosPedidos.push({
    id: 999,
    numeroPedido: 999,
    estado: 'PENDIENTE',
    mesa: 5,
    fechaCreacion: new Date().toISOString(),
    items: [
        { cantidad: 1, nombreProducto: "Ensalada César", notas: "ALERGIA AL GLUTEN" }, // <--- Esto activará la alerta roja
        { cantidad: 2, nombreProducto: "Agua", notas: "sin hielo" } // <--- Esto activará la nota normal
    ]
});
// --------------------------------------

        actualizarVistaPedidos(todosLosPedidos);
        actualizarEstadisticas(todosLosPedidos);
        actualizarResumenProduccion(todosLosPedidos); // <--- ¡AHORA SÍ SE LLAMA!

    } catch (error) {
        console.error("Error cargando pedidos:", error);
        contenedor.innerHTML = `<div class="error-msg">⚠️ Sin conexión con el servidor</div>`;
    }
}


function actualizarVistaPedidos(pedidos) {
    const contenedor = document.querySelector(".pedidos-grid");
    if (!contenedor) return;

    if (pedidos.length === 0) {
        contenedor.innerHTML = '<div class="no-pedidos">✅ Todo limpio. Oído cocina.</div>';
        return;
    }

    contenedor.innerHTML = pedidos.map(pedido => crearTarjetaPedido(pedido)).join("");
}

function crearTarjetaPedido(pedido) {
    const estadoClass = pedido.estado === 'EN_PREPARACION' ? 'preparacion' : 'pendiente';
    const estadoTexto = pedido.estado === 'EN_PREPARACION' ? 'En Preparación' : 'Pendiente';
    
    // --- 🚦 SEMÁFORO DE TIEMPO ---
    const ahora = new Date();
    const creado = new Date(pedido.fechaCreacion); // Asegúrate que el backend envíe fechaCreacion
    const minutosPasados = Math.floor((ahora - creado) / 60000); // Diferencia en minutos
    
    let tiempoClass = 'tiempo-verde'; 
    let iconoTiempo = '<i class="fa-regular fa-clock"></i>';
    
    // Reglas de tiempo (ajustables)
    if (minutosPasados > 15) {
        tiempoClass = 'tiempo-rojo'; // Crítico
        iconoTiempo = '<i class="fa-solid fa-fire-flame-curved"></i>';
    } else if (minutosPasados > 5) {
        tiempoClass = 'tiempo-amarillo'; // Alerta
    }

    // --- ITEMS Y ALERTAS ---
    const itemsHtml = (pedido.items || []).map(item => {
        // Detectar alertas en las notas
        const notas = item.notas ? item.notas.toLowerCase() : '';
        const esAlergia = notas.includes('alergia') || notas.includes('sin') || notas.includes('gluten') || notas.includes('no');
        
        const alertaHtml = esAlergia 
            ? `<div class="alerta-alergia"><i class="fa-solid fa-triangle-exclamation"></i> ¡OJO! ${item.notas}</div>` 
            : (item.notas ? `<div class="nota-normal">Nota: ${item.notas}</div>` : '');

        return `
        <div class="item">
            <div class="item-details">
                <span class="cantidad">${item.cantidad}x</span>
                <span class="nombre">${item.nombreProducto}</span>
            </div>
            ${alertaHtml}
            ${pedido.estado === 'PENDIENTE' 
                ? `<button class="btn-preparar">Marchar</button>` 
                : `` // En preparación mostramos el botón global abajo
            }
        </div>
        `;
    }).join("");

    // Botón de acción principal según estado
    const accionPrincipal = pedido.estado === 'EN_PREPARACION' 
        ? `<div class="ticket-actions"><button class="btn-action finish btn-terminar">🔔 Terminar y Avisar</button></div>`
        : ``;

    return `
        <div class="ticket ${estadoClass} ${tiempoClass}" data-pedido-id="${pedido.id}">
            <div class="ticket-header">
                <div class="mesa-info">
                    <span class="mesa">Mesa ${pedido.mesa || "Barra"}</span>
                    <span class="id-pedido">#${pedido.numeroPedido || pedido.id}</span>
                </div>
                <div class="timer-badge">
                    ${iconoTiempo} ${minutosPasados} min
                </div>
            </div>
            
            <div class="ticket-body">
                <div class="pedido-items">
                    ${itemsHtml}
                </div>
            </div>
            ${accionPrincipal}
        </div>
    `;
}

async function iniciarPreparacion(btn) {
    const pedidoCard = btn.closest(".ticket") || btn.closest(".pedido-card");
    const pedidoId = pedidoCard.dataset.pedidoId;

    const originalText = btn.textContent;
    btn.textContent = "...";
    btn.disabled = true;

    try {
        await pedidoService.updatePedidoEstado(pedidoId, "EN_PREPARACION");
        await cargarPedidosActivos();
        mostrarExito("🔥 Pedido marchando");
    } catch (error) {
        console.error("Error:", error);
        btn.textContent = originalText;
        btn.disabled = false;
        mostrarError("Error al iniciar");
    }
}

async function terminarPreparacion(btn) {
    const pedidoCard = btn.closest(".ticket");
    const pedidoId = pedidoCard.dataset.pedidoId;
    // Obtenemos el número de mesa del HTML para la notificación
    const mesaTexto = pedidoCard.querySelector(".mesa").textContent;

    if (!confirm(`¿Pedido de ${mesaTexto} listo para servir?`)) return;

    try {
        await pedidoService.marcarPedidoListo(pedidoId);
        
        // Efecto visual de salida
        pedidoCard.style.transform = "scale(0.9)";
        pedidoCard.style.opacity = "0";
        
        // 🔔 NOTIFICACIÓN AL MESERO (Simulada visualmente)
        mostrarExito(`🔔 ¡OÍDO! ${mesaTexto} listo. Notificando a mesero...`);

        setTimeout(async () => {
            await cargarPedidosActivos();
        }, 300);

    } catch (error) {
        console.error("Error:", error);
        mostrarError("Error al finalizar");
    }
}

// ============================================================
//  PANEL LATERAL (Estadísticas, Resumen y Detalles)
// ============================================================

function actualizarEstadisticas(pedidos) {
    try {
        const pendientes = pedidos.filter(p => p.estado === 'PENDIENTE').length;
        const enProceso = pedidos.filter(p => p.estado === 'EN_PREPARACION').length;
        
        const stats = document.querySelectorAll(".stat-number"); // Asegúrate de tener estos elementos en HTML
        if (stats.length > 0) {
            if(document.getElementById('count-pendientes')) 
                document.getElementById('count-pendientes').textContent = pendientes;
            if(document.getElementById('count-proceso')) 
                document.getElementById('count-proceso').textContent = enProceso;
        }
    } catch (error) { console.error(error); }
}

function actualizarResumenProduccion(pedidos) {
    const resumen = {};
    
    pedidos.forEach(pedido => {
        if (pedido.estado !== 'LISTO') {
            pedido.items.forEach(item => {
                const nombre = item.nombreProducto; 
                resumen[nombre] = (resumen[nombre] || 0) + item.cantidad;
            });
        }
    });

    const contenedor = document.getElementById('summary-list');
    if(!contenedor) return;
    
    if (Object.keys(resumen).length === 0) {
        contenedor.innerHTML = '<span style="color:#999; font-size:0.9rem">Esperando comandas...</span>';
        return;
    }

    contenedor.innerHTML = Object.entries(resumen)
        .map(([nombre, cantidad]) => `
            <div class="summary-tag">${nombre}: <b>${cantidad}</b></div>
        `).join('');
}

// Función para mostrar detalles del plato (Menú derecho)
function mostrarDetalle(nombre, imagenUrl, ingredientes) {
    const placeholder = document.querySelector('.details-placeholder');
    const content = document.querySelector('.details-content');
    
    const imgEl = document.getElementById('plato-img');
    const nombreEl = document.getElementById('plato-nombre');
    const listaEl = document.getElementById('plato-ingredientes');
    
    if(placeholder) placeholder.style.display = 'none';
    if(content) content.style.display = 'block';
    
    if(imgEl) imgEl.src = imagenUrl;
    if(nombreEl) nombreEl.textContent = nombre;
    
    if(listaEl) {
        listaEl.innerHTML = '';
        ingredientes.forEach(ing => {
            const li = document.createElement('li');
            li.textContent = ing;
            listaEl.appendChild(li);
        });
    }
}

// ============================================================
//  UTILIDADES
// ============================================================
function mostrarError(mensaje) {
    alert("❌ " + mensaje);
}

function mostrarExito(mensaje) {
    console.log("✅ " + mensaje);
    // Si quieres un toast simple en lugar de alert:
    // alert("✅ " + mensaje); 
}