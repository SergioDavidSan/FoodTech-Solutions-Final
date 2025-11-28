// ============================================================
//  CONFIGURACIÓN Y ESTADO
// ============================================================
const LOGIN_PAGE = "../../modules/login.html";
let mesaSeleccionadaId = null;
let notificaciones = []; // Almacén de notificaciones

// --- MOCK DATA (Simulación) ---
const mesasData = [
    { id: 1, estado: 'free', total: 0, items: [] },
    { id: 2, estado: 'busy', total: 85000, items: [{cant: 2, nombre: 'Bandeja Paisa', precio: 35000}, {cant: 3, nombre: 'Cerveza', precio: 5000}] },
    { id: 3, estado: 'free', total: 0, items: [] },
    { id: 4, estado: 'busy', total: 12000, items: [{cant: 2, nombre: 'Jugo Natural', precio: 6000}] },
    { id: 5, estado: 'paying', total: 45000, items: [{cant: 1, nombre: 'Picada 2p', precio: 40000}, {cant: 1, nombre: 'Gaseosa', precio: 5000}] },
    { id: 6, estado: 'free', total: 0, items: [] },
    { id: 7, estado: 'free', total: 0, items: [] },
    { id: 8, estado: 'free', total: 0, items: [] },
    { id: 9, estado: 'free', total: 0, items: [] },
    { id: 10, estado: 'free', total: 0, items: [] },
];

// Productos para generar pedidos aleatorios
const cartaEjemplo = [
    { nombre: 'Hamburguesa', precio: 25000 },
    { nombre: 'Perro Caliente', precio: 18000 },
    { nombre: 'Pizza', precio: 30000 },
    { nombre: 'Gaseosa', precio: 5000 },
    { nombre: 'Jugo', precio: 7000 }
];

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("💰 Iniciando Panel de Caja...");

    if (typeof authService === 'undefined' || !authService.isAuthenticated()) {
        window.location.href = LOGIN_PAGE;
        return;
    }

    const userInfo = authService.getCurrentUser();
    document.getElementById('nombre-usuario').textContent = userInfo?.username || 'Cajero';

    document.getElementById("logout-button")?.addEventListener("click", () => authService.logout());

    // Evento Notificaciones
    document.getElementById("btn-notificaciones").addEventListener("click", toggleNotificaciones);

    // Agregar una notificación de prueba al inicio
    agregarNotificacion("alert", "Sistema iniciado correctamente");

    renderizarMesas();
});

// ============================================================
//  LÓGICA DE NOTIFICACIONES
// ============================================================
function agregarNotificacion(tipo, mensaje) {
    const id = Date.now();
    notificaciones.unshift({ id, tipo, mensaje, leida: false });
    actualizarBadge();
    renderizarNotificaciones();
}

function toggleNotificaciones() {
    const menu = document.getElementById("notificaciones-menu");
    menu.classList.toggle("active");
    
    // Marcar como leídas al abrir
    if (menu.classList.contains("active")) {
        notificaciones.forEach(n => n.leida = true);
        actualizarBadge();
    }
}

function actualizarBadge() {
    const noLeidas = notificaciones.filter(n => !n.leida).length;
    const badge = document.getElementById("badge-notificaciones");
    badge.textContent = noLeidas;
    badge.style.display = noLeidas > 0 ? "flex" : "none";
}

function renderizarNotificaciones() {
    const lista = document.getElementById("lista-notificaciones");
    
    if (notificaciones.length === 0) {
        lista.innerHTML = '<li class="notif-item"><p style="padding:10px; color:#999">No hay notificaciones</p></li>';
        return;
    }

    lista.innerHTML = notificaciones.map(n => {
        let icon = 'fa-info';
        if (n.tipo === 'payment') icon = 'fa-money-bill';
        if (n.tipo === 'alert') icon = 'fa-exclamation';
        
        return `
        <li class="notif-item ${n.tipo} ${n.leida ? '' : 'unread'}">
            <div class="notif-icon"><i class="fa-solid ${icon}"></i></div>
            <span>${n.mensaje}</span>
        </li>
        `;
    }).join("");
}

function limpiarNotificaciones() {
    notificaciones = [];
    renderizarNotificaciones();
    actualizarBadge();
}

// ============================================================
//  LÓGICA DE MESAS Y PEDIDOS
// ============================================================

function renderizarMesas() {
    const grid = document.getElementById('tables-grid');
    grid.innerHTML = '';

    mesasData.forEach(mesa => {
        let icon = 'fa-chair';
        let statusClass = 'free';

        if (mesa.estado === 'busy') { 
            icon = 'fa-utensils'; statusClass = 'busy';
        } else if (mesa.estado === 'paying') {
            icon = 'fa-file-invoice-dollar'; statusClass = 'paying';
        }

        const card = document.createElement('div');
        card.className = `table-card ${statusClass}`;
        if (mesa.id === mesaSeleccionadaId) card.classList.add('selected');
        
        card.onclick = () => seleccionarMesa(mesa.id);
        
        card.innerHTML = `
            <i class="fa-solid ${icon} table-icon"></i>
            <h3>Mesa ${mesa.id}</h3>
            ${mesa.total > 0 ? `<div class="current-total">$${mesa.total.toLocaleString()}</div>` : '<small>Disponible</small>'}
        `;
        grid.appendChild(card);
    });
}

function seleccionarMesa(id) {
    const mesa = mesasData.find(m => m.id === id);
    
    // ✅ LÓGICA NUEVA: SIMULAR QUE LLEGA UN PEDIDO
    if (mesa.estado === 'free') {
        if(confirm(`La Mesa ${id} está vacía. ¿Quieres simular un pedido nuevo?`)) {
            generarPedidoSimulado(mesa);
        }
        return;
    }

    mesaSeleccionadaId = id;
    renderizarMesas(); // Para actualizar el borde de selección
    
    document.getElementById('selected-table-id').textContent = `Mesa ${id}`;
    document.getElementById('btn-pay').disabled = false;
    
    renderizarTicket(mesa.items, mesa.total);
}

// Función auxiliar para crear datos falsos
function generarPedidoSimulado(mesa) {
    // Elegir 2 o 3 productos al azar
    const itemsNuevos = [];
    let totalNuevo = 0;
    
    const cantidadItems = Math.floor(Math.random() * 3) + 1; // 1 a 3 productos
    
    for(let i=0; i<cantidadItems; i++) {
        const prod = cartaEjemplo[Math.floor(Math.random() * cartaEjemplo.length)];
        itemsNuevos.push({ cant: 1, nombre: prod.nombre, precio: prod.precio });
        totalNuevo += prod.precio;
    }

    mesa.estado = 'busy';
    mesa.items = itemsNuevos;
    mesa.total = totalNuevo;
    
    agregarNotificacion("alert", `Nuevo pedido en Mesa ${mesa.id}`);
    renderizarMesas();
    seleccionarMesa(mesa.id); // Seleccionarla automáticamente
}

function renderizarTicket(items, total) {
    const container = document.getElementById('ticket-items');
    container.innerHTML = items.map(item => `
        <div class="ticket-item">
            <div>
                <span class="item-qty">${item.cant}x</span>
                <span class="item-name">${item.nombre}</span>
            </div>
            <span class="item-price">$${(item.precio * item.cant).toLocaleString()}</span>
        </div>
    `).join('');

    const propina = total * 0.10;
    const granTotal = total + propina;

    document.getElementById('subtotal').textContent = `$${total.toLocaleString()}`;
    document.getElementById('propina').textContent = `$${propina.toLocaleString()}`;
    document.getElementById('total').textContent = `$${granTotal.toLocaleString()}`;
}

// ============================================================
//  PROCESO DE PAGO
// ============================================================

function procesarPago() {
    if (!mesaSeleccionadaId) return;

    const mesa = mesasData.find(m => m.id === mesaSeleccionadaId);
    const totalPagar = document.getElementById('total').textContent;

    if(confirm(`¿Confirmar pago de ${totalPagar} para la Mesa ${mesaSeleccionadaId}?`)) {
        
        // Resetear la mesa
        mesa.estado = 'free';
        mesa.total = 0;
        mesa.items = [];
        
        agregarNotificacion("payment", `Pago exitoso Mesa ${mesaSeleccionadaId}: ${totalPagar}`);
        alert("✅ ¡Pago registrado exitosamente!");
        
        mesaSeleccionadaId = null;
        renderizarMesas();
        limpiarTicketUI();
    }
}

function limpiarTicketUI() {
    mesaSeleccionadaId = null;
    document.getElementById('selected-table-id').textContent = 'Seleccione Mesa';
    document.getElementById('ticket-items').innerHTML = `
        <div class="empty-state">
            <i class="fa-solid fa-hand-pointer"></i>
            <p>Selecciona una mesa ocupada</p>
        </div>`;
    document.getElementById('subtotal').textContent = '$0';
    document.getElementById('propina').textContent = '$0';
    document.getElementById('total').textContent = '$0';
    document.getElementById('btn-pay').disabled = true;
}