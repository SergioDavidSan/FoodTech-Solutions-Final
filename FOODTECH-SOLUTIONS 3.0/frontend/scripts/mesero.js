// ============================================================
//  CONFIGURACIÓN Y ESTADO
// ============================================================
const LOGIN_PAGE = "../../modules/login.html";
let mesaActual = null;
let comandaActual = [];
let esParaLlevarGeneral = false;

// CAMBIO 1: Ahora menuData es una variable vacía, no una constante fija
let menuData = []; 

// MOCK DATA MESAS (Esto se mantiene igual)
const mesasData = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    estado: 'free' 
}));
mesasData[1].estado = 'busy'; 
mesasData[4].estado = 'my-table'; 

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("💁 Iniciando Panel de Mesero...");

    // 1. Verificación de Auth
    if (typeof authService === 'undefined') { window.location.href = LOGIN_PAGE; return; }
    if (!authService.isAuthenticated()) {
        authService.logout();
        return;
    }

    // 2. Info de Usuario
    const userInfo = authService.getCurrentUser();
    document.getElementById('nombre-usuario').textContent = userInfo?.username || 'Mesero';
    document.getElementById("logout-button")?.addEventListener("click", () => authService.logout());

    // 3. Lógica de Notificaciones (Del código A - Agregado aquí)
    const btnNotif = document.querySelector('.icon-btn[title="Notificaciones"]');
    if (btnNotif) {
        const menuNotif = document.createElement('div');
        menuNotif.className = 'notifications-dropdown';
        menuNotif.innerHTML = `
            <div class="notif-header"><span>Notificaciones</span> <a href="#" style="font-size:0.8rem">Borrar</a></div>
            <ul class="notif-list">
                <li class="notif-item unread">🔔 Sistema listo</li>
            </ul>
        `;
        document.querySelector('.header-icons')?.appendChild(menuNotif);
        
        btnNotif.addEventListener('click', (e) => {
            e.stopPropagation();
            menuNotif.classList.toggle('active');
            const badge = document.getElementById('notif-count');
            if(badge) badge.style.display = 'none';
        });
        document.addEventListener('click', () => menuNotif.classList.remove('active'));
    }

    // 4. Switch "Para Llevar"
    const switchTogo = document.getElementById('order-togo-check');
    if(switchTogo) {
        switchTogo.addEventListener('change', (e) => {
            esParaLlevarGeneral = e.target.checked;
            actualizarComandaUI(); 
        });
    }

    // 5. RENDERIZADO INICIAL
    renderizarMesas();
    
    // CAMBIO 2: Llamamos a la función asíncrona para cargar datos reales
    await cargarMenuReal(); 
});

// ============================================================
//  CONEXIÓN CON BACKEND 
// ============================================================
async function cargarMenuReal() {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = '<p style="padding:20px; color:#666; width:100%">Cargando menú...</p>';

    try {
        // Intentamos obtener productos del servicio
        // Si apiService no existe (aún no lo importas), usará un array vacío para no romper todo
        const productosRaw = await apiService.getMenu();
                             
        
        if (!productosRaw || productosRaw.length === 0) {
            grid.innerHTML = '<p style="padding:20px; width:100%">No hay productos o no hay conexión.</p>';
            return;
        }
       
        menuData = productosRaw.map(p => ({
            id: p.idPlato || p.id,
            nombre: p.nombreProducto || p.nombre,
            precio: p.precio || 0,
            desc: p.descripcion || "Sin descripción disponible.",
            // Si ingredientes es string "Pan,Carne", lo convertimos a array. Si no, array default.
            ingredientes: p.ingredientes ? (typeof p.ingredientes === 'string' ? p.ingredientes.split(',') : p.ingredientes) : ["Estándar"],
            img: p.imagen || '../assets/logo.png' // Imagen por defecto si falla
        }));

        renderizarMenu(); // Llamamos al render original

    } catch (error) {
        console.error("Error cargando menú:", error);
        grid.innerHTML = '<p style="padding:20px; color:red">Error de conexión con cocina.</p>';
    }
}

// ============================================================
//  RENDERIZADO (UI)
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
    // Usamos menuData que ya fue llenado por cargarMenuReal
    grid.innerHTML = menuData.map(prod => `
        <div class="menu-item" onclick="agregarAComanda(${prod.id})">
            <button class="btn-info" onclick="event.stopPropagation(); verDetalleProducto(${prod.id})">
                <i class="fa-solid fa-info"></i>
            </button>
            <div style="font-size:2rem; margin-bottom:5px; text-align:center">🍽️</div>
            <span class="item-name">${prod.nombre}</span>
            <span class="item-price">$${prod.precio.toLocaleString()}</span>
        </div>
    `).join('');
}

// ============================================================
//  INTERACCIÓN Y LÓGICA DE MESA
// ============================================================

function crearPedidoParaLlevar() {
    const mesaVirtual = { id: 999, estado: 'busy' };
    abrirMesa(mesaVirtual);
    document.getElementById('mesa-titulo').textContent = "🛍️ Para Llevar";
    
    const switchCheck = document.getElementById('order-togo-check');
    if(switchCheck) switchCheck.checked = true;
    esParaLlevarGeneral = true;
}

function abrirMesa(mesa) {
    mesaActual = mesa;
    esParaLlevarGeneral = false;
    
    const switchCheck = document.getElementById('order-togo-check');
    if(switchCheck) switchCheck.checked = false;
    
    document.getElementById('empty-state-order').style.display = 'none';
    document.getElementById('active-order-panel').style.display = 'flex';
    
    const titulo = mesa.id === 999 ? "🛍️ Para Llevar" : `Mesa ${mesa.id}`;
    document.getElementById('mesa-titulo').textContent = titulo;
    
    document.querySelectorAll('.table-card').forEach(c => c.style.border = '2px solid transparent');
    
    comandaActual = [];
    actualizarComandaUI();
    switchTab('menu');
    
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
    // Busca en menuData (que ahora viene del backend)
    const prod = menuData.find(p => p.id === idProd);
    if (!prod) return;

    document.getElementById('inspector-empty').style.display = 'none';
    document.getElementById('inspector-content').style.display = 'flex';

    // Usamos una imagen genérica si la URL falla o no existe
    document.getElementById('insp-img').src = prod.img || '../assets/logo.png'; 
    document.getElementById('insp-title').textContent = prod.nombre;
    document.getElementById('insp-price').textContent = `$${prod.precio.toLocaleString()}`;
    document.getElementById('insp-desc').textContent = prod.desc;
    
    const listaIng = document.getElementById('insp-list');
    if (prod.ingredientes && Array.isArray(prod.ingredientes)) {
        listaIng.innerHTML = prod.ingredientes.map(ing => `<li>${ing}</li>`).join('');
    } else {
        listaIng.innerHTML = '<li>Información no disponible</li>';
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`view-${tabName}`).classList.add('active');
    const btnIndex = tabName === 'menu' ? 0 : 1;
    const btns = document.querySelectorAll('.tab-btn');
    if(btns[btnIndex]) btns[btnIndex].classList.add('active');
}

// ============================================================
//  COMANDA
// ============================================================
function agregarAComanda(idProd) {
    const producto = menuData.find(p => p.id == idProd);
    if (!producto) return; 

    const existe = comandaActual.find(i => i.id === idProd);
    
    if (existe) {
        existe.cantidad++;
    } else {
        // Clonamos el objeto para no modificar el menuData original
        comandaActual.push({ ...producto, cantidad: 1 });
    }
    
    actualizarComandaUI();
}

function eliminarItem(idProd) {
    const index = comandaActual.findIndex(i => i.id === idProd);
    if (index !== -1) {
        const item = comandaActual[index];
        if (item.cantidad > 1) {
            item.cantidad--;
        } else {
            comandaActual.splice(index, 1);
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

// ============================================================
//  ENVÍO DE PEDIDO 
// ============================================================
async function enviarPedido() {
    if (comandaActual.length === 0) return alert("Agrega productos primero.");

    const tipoPedido = esParaLlevarGeneral ? "PARA LLEVAR" : "Mesa " + mesaActual.id;
    
    // 🚨 SOLUCIÓN 2 (TEMPORAL): FORZAR ID DEL MESERO
    // Esto demuestra que el fallo es la lectura de authService o la BD.
    // Una vez que la prueba sea exitosa, DEBES REVERTIR ESTA LÍNEA
    // Y corregir la función getCurrentUser() en authService.js
    const idMesero = 17; 
    
    // Líneas originales comentadas para depuración:
    // const userInfo = authService.getCurrentUser();
    // const idMesero = userInfo?.id || authService.getUserId(); 

    // console.log("ID Mesero forzado:", idMesero); // Debugging

    if (!idMesero) { 
        alert("Error: No se encontró el ID del mesero. Por favor, inicia sesión.");
        authService.logout();
        return;
    }

    if (confirm(`¿Enviar pedido (${tipoPedido}) a cocina?`)) {
        
        // 2. CONSTRUCCIÓN DE DETALLES (Mapeo correcto a la estructura del backend)
        const detallesPayload = comandaActual.map(item => ({
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            producto: { idProducto: item.id } 
        }));
        
        // 3. CONSTRUCCIÓN DEL OBJETO COMPLETO Pedido
        const pedidoPayload = {
            // Asignar el mesero autenticado con el ID forzado
            mesero: { idUsuario: idMesero }, 
            
            // Asignar mesa o null si es para llevar
            mesa: esParaLlevarGeneral ? null : { idMesa: mesaActual.id }, 
            
            detalles: detallesPayload,
        };

        console.log("Enviando pedido a /api/pedidos...", pedidoPayload);

        try {
            const respuesta = await apiService.crearPedido(pedidoPayload); 
            
            console.log("Respuesta del Backend (Pedido creado):", respuesta);

            alert("✅ ¡Pedido enviado a cocina!");
            comandaActual = []; 
            actualizarComandaUI();
            cerrarMesaActual();
        } catch (error) {
            console.error("Error al enviar el pedido:", error);
            alert("❌ Error: No se pudo enviar el pedido al servidor. Revisa la consola."); 
        }
    }
}