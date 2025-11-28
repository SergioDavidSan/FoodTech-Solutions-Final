// ============================================================
//  CONFIGURACIÓN
// ============================================================
const LOGIN_PAGE = "../../modules/login.html";
let mesaActual = null;
let comandaActual = [];
let esParaLlevarGeneral = false; // Variable para el estado del switch

// MOCK DATA (Productos con info extra para el inspector)
const menuData = [
    { 
        id: 1, nombre: "Hamb. Clásica", precio: 25000, 
        desc: "Carne angus 150g, lechuga fresca, tomate y salsa.", 
        ingredientes: ["Carne", "Queso", "Pan"],
        img: "../assets/productos/hamburguesa_sencilla.png" 
    },
    { 
        id: 2, nombre: "Perro Caliente", precio: 18000, 
        desc: "Salchicha americana, queso mozzarella y papas.",
        ingredientes: ["Salchicha", "Queso", "Papas"],
        img: "../assets/productos/perro_caliente.png"
    },
    { 
        id: 3, nombre: "Coca Cola", precio: 5000, 
        desc: "Bebida gaseosa 400ml.", ingredientes: ["Bebida"],
        img: "../assets/productos/gaseosa_400ml.png"
    },
    { 
        id: 4, nombre: "Jugo Natural", precio: 7000, 
        desc: "Jugo de fruta en agua o leche.", ingredientes: ["Fruta", "Base"],
        img: "../assets/productos/jugos_naturales.png"
    },
    { 
        id: 5, nombre: "Papas Fritas", precio: 8000, 
        desc: "Porción de papas a la francesa.", ingredientes: ["Papas", "Sal"],
        img: "../assets/productos/papas_fritas.png"
    }
];

// MOCK DATA (Mesas)
const mesasData = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    estado: 'free' 
}));
mesasData[1].estado = 'busy'; // Mesa 2 ocupada
mesasData[4].estado = 'my-table'; // Mesa 5 es mía

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("💁 Iniciando Panel de Mesero...");

    if (typeof authService === 'undefined') { window.location.href = LOGIN_PAGE; return; }

    if (!authService.isAuthenticated()) {
        authService.logout();
        return;
    }

    const userInfo = authService.getCurrentUser();
    document.getElementById('nombre-usuario').textContent = userInfo?.username || 'Mesero';
    
    document.getElementById("logout-button")?.addEventListener("click", () => authService.logout());

    // Evento para el switch de "Para Llevar"
    const switchTogo = document.getElementById('order-togo-check');
    if(switchTogo) {
        switchTogo.addEventListener('change', (e) => {
            esParaLlevarGeneral = e.target.checked;
            // Actualizamos la UI de la comanda para mostrar/ocultar iconos
            actualizarComandaUI(); 
        });
    }

    renderizarMesas();
    renderizarMenu();
});

// ============================================================
//  RENDERIZADO
// ============================================================
function renderizarMesas() {
    const grid = document.getElementById('tables-grid');
    grid.innerHTML = '';

    mesasData.forEach(mesa => {
        let iconClass = 'free';
        let icon = 'fa-chair';
        let label = 'Libre';
        
        if (mesa.estado === 'busy') { iconClass = 'busy'; icon = 'fa-users'; label = 'Ocupada'; }
        if (mesa.estado === 'my-table') { iconClass = 'my-table'; icon = 'fa-user-check'; label = 'Mía'; }

        const card = document.createElement('div');
        card.className = `table-card ${iconClass}`;
        card.onclick = () => abrirMesa(mesa);
        
        card.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <h3>Mesa ${mesa.id}</h3>
            <small>${label}</small>
        `;
        grid.appendChild(card);
    });
}

function renderizarMenu() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = menuData.map(prod => `
        <div class="menu-item" onclick="agregarAComanda(${prod.id})">
            <button class="btn-info" onclick="event.stopPropagation(); verDetalleProducto(${prod.id})">
                <i class="fa-solid fa-info"></i>
            </button>
            
            <span class="item-name">${prod.nombre}</span>
            <span class="item-price">$${prod.precio.toLocaleString()}</span>
        </div>
    `).join('');
}

// ============================================================
//  INTERACCIÓN Y LÓGICA DE MESA
// ============================================================

// NUEVA FUNCIÓN: Crear Pedido Para Llevar (Sin mesa física)
function crearPedidoParaLlevar() {
    const mesaVirtual = { id: 999, estado: 'busy' }; // ID especial
    abrirMesa(mesaVirtual);
    
    // Ajustes visuales específicos
    document.getElementById('mesa-titulo').textContent = "🛍️ Para Llevar";
    
    // Activar el switch visualmente y la variable lógica
    const switchCheck = document.getElementById('order-togo-check');
    if(switchCheck) switchCheck.checked = true;
    esParaLlevarGeneral = true;
}

function abrirMesa(mesa) {
    mesaActual = mesa;
    esParaLlevarGeneral = false; // Resetear estado por defecto
    
    // Resetear switch visual
    const switchCheck = document.getElementById('order-togo-check');
    if(switchCheck) switchCheck.checked = false;
    
    document.getElementById('empty-state-order').style.display = 'none';
    document.getElementById('active-order-panel').style.display = 'flex';
    
    const titulo = mesa.id === 999 ? "🛍️ Para Llevar" : `Mesa ${mesa.id}`;
    document.getElementById('mesa-titulo').textContent = titulo;
    
    // Limpiar selección visual anterior
    document.querySelectorAll('.table-card').forEach(c => c.style.border = '2px solid transparent');
    
    comandaActual = [];
    actualizarComandaUI();
    switchTab('menu');
    
    // Resetear inspector
    document.getElementById('inspector-empty').style.display = 'flex';
    document.getElementById('inspector-content').style.display = 'none';
}

function cerrarMesaActual() {
    mesaActual = null;
    document.getElementById('empty-state-order').style.display = 'flex';
    document.getElementById('active-order-panel').style.display = 'none';
}

// --- INSPECTOR DE PRODUCTO ---
function verDetalleProducto(idProd) {
    const prod = menuData.find(p => p.id === idProd);
    if (!prod) return;

    document.getElementById('inspector-empty').style.display = 'none';
    document.getElementById('inspector-content').style.display = 'flex';

    document.getElementById('insp-img').src = prod.img;
    document.getElementById('insp-title').textContent = prod.nombre;
    document.getElementById('insp-price').textContent = `$${prod.precio.toLocaleString()}`;
    document.getElementById('insp-desc').textContent = prod.desc;
    
    const listaIng = document.getElementById('insp-list');
    listaIng.innerHTML = prod.ingredientes.map(ing => `<li>${ing}</li>`).join('');
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`view-${tabName}`).classList.add('active');
    const btnIndex = tabName === 'menu' ? 0 : 1;
    document.querySelectorAll('.tab-btn')[btnIndex].classList.add('active');
}

// ============================================================
//  COMANDA
// ============================================================
function agregarAComanda(idProd) {
    const producto = menuData.find(p => p.id === idProd);
    const existe = comandaActual.find(i => i.id === idProd);
    
    if (existe) {
        existe.cantidad++;
    } else {
        comandaActual.push({ ...producto, cantidad: 1 });
    }
    
    actualizarComandaUI();
}

// NUEVA FUNCIÓN: Eliminar Item
function eliminarItem(idProd) {
    const index = comandaActual.findIndex(i => i.id === idProd);
    if (index !== -1) {
        const item = comandaActual[index];
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            comandaActual.splice(index, 1); // Borrar del array si llega a 0
        }
        actualizarComandaUI();
    }
}

function actualizarComandaUI() {
    const lista = document.getElementById('comanda-list');
    let total = 0;
    let totalItems = 0;

    if (comandaActual.length === 0) {
        lista.innerHTML = '<p style="text-align:center; color:#999; margin-top:30px">La comanda está vacía</p>';
    } else {
        lista.innerHTML = comandaActual.map(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            totalItems += item.cantidad;
            
            // Icono visual si es para llevar
            const iconLlevar = esParaLlevarGeneral ? '<i class="fa-solid fa-bag-shopping" style="margin-left:5px; color:#888; font-size:0.8rem" title="Para Llevar"></i>' : '';

            return `
                <div class="comanda-item">
                    <div class="comanda-info">
                        <b>${item.cantidad}x</b> ${item.nombre} ${iconLlevar}
                        <div style="font-size:0.8rem; color:#666">$${subtotal.toLocaleString()}</div>
                    </div>
                    <div class="comanda-actions">
                        <button class="btn-mini delete" onclick="eliminarItem(${item.id})" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    document.getElementById('comanda-total').textContent = `$${total.toLocaleString()}`;
    document.getElementById('items-count').textContent = totalItems;
}

async function enviarPedido() {
    if (comandaActual.length === 0) return alert("Agrega productos primero.");
    
    const tipoPedido = esParaLlevarGeneral ? "PARA LLEVAR" : "Mesa " + mesaActual.id;
    
    if(confirm(`¿Enviar pedido (${tipoPedido}) a cocina?`)) {
        console.log("Enviando pedido...", { 
            mesa: mesaActual.id, 
            items: comandaActual, 
            paraLlevar: esParaLlevarGeneral 
        });
        
        alert("✅ ¡Pedido enviado a cocina!");
        cerrarMesaActual();
    }
}