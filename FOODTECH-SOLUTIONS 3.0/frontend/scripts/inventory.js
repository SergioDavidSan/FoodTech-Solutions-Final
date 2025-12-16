// ============================================================
//  CONFIGURACIÓN Y ESTADO
// ============================================================
const LOGIN_PAGE = "../../modules/login.html";
let productosInventario = [];

// ============================================================
//  INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    console.log("📦 Iniciando Módulo de Inventario (MODO REAL)...");

    // 1. Seguridad
    if (typeof authService === 'undefined') {
        window.location.href = LOGIN_PAGE;
        return;
    }
    if (!authService.isAuthenticated()) {
        authService.logout();
        return;
    }

    // 2. Info Usuario
    const userInfo = authService.getCurrentUser();
    const userSpan = document.getElementById('userName');
    if(userSpan) userSpan.textContent = userInfo?.username || 'Gerente';
    
    document.getElementById("logout-button")?.addEventListener("click", () => authService.logout());

    // 3. Configurar Botones
    const btnAdd = document.getElementById('addProductBtn');
    const btnReset = document.getElementById('btnResetForm');
    const btnCancel = document.getElementById('cancelForm');
    const form = document.getElementById('productForm');

    if (btnAdd) btnAdd.addEventListener('click', () => limpiarYMostrarFormulario());
    if (btnReset) btnReset.addEventListener('click', () => limpiarFormulario());
    if (btnCancel) btnCancel.addEventListener('click', () => limpiarFormulario());

    // 4. Evento Submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarProducto();
        });
    }

    // 5. Cargar datos REALES de la base de datos
    cargarInventario();
});

// ============================================================
//  LÓGICA DE NEGOCIO
// ============================================================

async function cargarInventario() {
    const tbody = document.getElementById('inventoryTableBody');
    if(tbody) tbody.innerHTML = '<tr><td colspan="7" class="text-center">Cargando datos de la BD...</td></tr>';

    try {
        const productos = await apiService.getInventario(); 
        
        if (!productos || productos.length === 0) {
             productosInventario = [];
             renderizarTabla([]);
             actualizarMetricas([]);
             // Corrección visual segura
             const emptyState = document.getElementById('emptyInventory');
             const table = document.querySelector('.inventory-table');
             
             if (emptyState) emptyState.style.display = 'flex';
             if (table) table.style.display = 'none';
             return;
        }

        const emptyState = document.getElementById('emptyInventory');
        const table = document.querySelector('.inventory-table');
        if (emptyState) emptyState.style.display = 'none';
        if (table) table.style.display = 'table';

        productosInventario = productos;
        renderizarTabla(productos);
        actualizarMetricas(productos);
        console.log("✅ Inventario cargado desde BD:", productos);

    } catch (error) {
        console.error("Error cargando inventario:", error);
        if(tbody) tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error de conexión: ${error.message}</td></tr>`;
    }
}

async function guardarProducto() {
    // 1. Leer valores del DOM directamente
    const nombre = document.getElementById('productName').value.trim();
    const categoriaValor = document.getElementById('productCategory').value;
    const precio = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const minimo = parseInt(document.getElementById('minStock').value);
    const proveedor = document.getElementById('productSupplier').value.trim();
    
    // ⬇️ ¡NUEVO CAMPO! Necesitas un campo de entrada con id="productUnit" en tu HTML
    const unidadMedida = document.getElementById('productUnit').value.trim(); 
    // ⬆️ ¡NUEVO CAMPO!

    // 2. Validación
    if (nombre.length < 2) return alert("El nombre es muy corto");
    if (isNaN(precio) || precio <= 0) return alert("Precio inválido");
    if (isNaN(stock) || stock < 0) return alert("Stock inválido");
    if (!categoriaValor) return alert("Selecciona una categoría");
    if (!unidadMedida) return alert("La unidad de medida es obligatoria"); // ⬅️ NUEVA VALIDACIÓN

    // 3. Construir objeto
    const nuevoProducto = {
        nombreProducto: nombre,
        precio: precio,
        // stockActual: stock, // ❌ Esto está mal. Debe ser 'cantidad'.
        cantidad: stock,      // ✅ CORRECCIÓN APLICADA
        stockMinimo: minimo,
        proveedor: proveedor,
        disponible: true,
        unidadMedida: unidadMedida, // ✅ CAMPO AGREGADO
        categoria: { idCategoria: parseInt(categoriaValor) }
    };

    console.log("Enviando al backend:", nuevoProducto);

    // 4. ENVIAR
    const btnSave = document.getElementById('saveProduct');
    // Aseguramos que el botón exista antes de modificarlo
    if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    }

    try {
        const respuesta = await apiService.crearProducto(nuevoProducto);
        
        console.log("Respuesta del server:", respuesta);
        alert("✅ Producto guardado en la Base de Datos");
        
        limpiarFormulario();
        await cargarInventario(); 

    } catch (error) {
        console.error("Error al guardar:", error);
        alert("❌ Error al guardar: " + error.message);
    } finally {
        if (btnSave) {
            btnSave.disabled = false;
            btnSave.innerHTML = '<i class="fa-solid fa-save"></i> Guardar Producto';
        }
    }
}

// ============================================================
//  UI & UTILIDADES
// ============================================================

function renderizarTabla(productos) {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    if(productos.length === 0) {
        tbody.innerHTML = '';
        return;
    }

    tbody.innerHTML = productos.map(p => {
        let estadoClass = 'ok';
        let estadoTexto = 'OK';
        const stock = p.stockActual || 0;
        const min = p.stockMinimo || 0;

        if (stock === 0) { estadoClass = 'out'; estadoTexto = 'Agotado'; }
        else if (stock <= min) { estadoClass = 'low'; estadoTexto = 'Bajo'; }

        const catNombre = p.categoria ? (p.categoria.nombreCategoria || 'General') : 'General';

        return `
            <tr>
                <td>${p.nombreProducto}</td>
                <td>${catNombre}</td>
                <td>${stock}</td>
                <td>${min}</td>
                <td>$${(p.precio || 0).toLocaleString()}</td>
                <td><span class="status-badge ${estadoClass}">${estadoTexto}</span></td>
                <td class="text-center">
                    <button class="action-btn delete" onclick="borrarProducto(${p.idProducto})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

async function borrarProducto(id) {
    if(confirm("¿Eliminar este producto de la base de datos?")) {
        try {
            await apiService.eliminarProducto(id);
            alert("🗑️ Producto eliminado");
            cargarInventario();
        } catch (error) {
            alert("Error al eliminar: " + error.message);
        }
    }
}

function actualizarMetricas(productos) {
    const total = productos.length;
    const bajos = productos.filter(p => (p.stockActual || 0) <= (p.stockMinimo || 0) && (p.stockActual || 0) > 0).length;
    const agotados = productos.filter(p => (p.stockActual || 0) === 0).length;

    document.getElementById('totalProducts').textContent = total;
    document.getElementById('lowStockCount').textContent = bajos;
    document.getElementById('outOfStockCount').textContent = agotados;
}

function limpiarYMostrarFormulario() {
    limpiarFormulario();
    document.getElementById('productName').focus();
}

function limpiarFormulario() {
    const form = document.getElementById('productForm');
    if (form) form.reset();
    document.getElementById('productId').value = '';
}