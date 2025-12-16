// Servicios para admin - DECLARACIÓN ÚNICA
const usuarioService = {
    async getUsuarios() {
        return await apiService.getUsuarios();
    }
};

const reporteService = {
    async getMetricasDelDia() {
        try {
            // Asumiendo que 'apiService' tiene este método
            return await apiService.getMetricasDelDia(); 
        } catch (error) {
            console.error('Error obteniendo métricas:', error);
            // Valores de fallback
            return {
                usuariosActivos: 1,
                ventasHoy: 0,
                pedidosActivos: 0,
                mesasOcupadas: '0/0'
            };
        }
    }
};

// ===============================================
// DASHBOARD
// ===============================================

// Cargar datos del dashboard
async function cargarDashboard() {
    try {
        const metricas = await reporteService.getMetricasDelDia();
        actualizarMetricasDashboard(metricas);
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        actualizarMetricasDashboard({
            usuariosActivos: 1,
            ventasHoy: 0,
            pedidosActivos: 0,
            mesasOcupadas: '0/0'
        });
    }
}

function actualizarMetricasDashboard(metricas) {
    const usersCount = document.getElementById('usersCount');
    const salesToday = document.getElementById('salesToday');
    const activeOrders = document.getElementById('activeOrders');
    const occupiedTables = document.getElementById('occupiedTables');
    
    if (usersCount) usersCount.textContent = metricas.usuariosActivos || 0;
    if (salesToday) salesToday.textContent = '$' + (metricas.ventasHoy || 0);
    if (activeOrders) activeOrders.textContent = metricas.pedidosActivos || 0;
    if (occupiedTables) occupiedTables.textContent = metricas.mesasOcupadas || '0/0';
}

// ===============================================
// GESTIÓN DE MENÚ (PLATOS)
// ===============================================

// Función auxiliar para limpiar el formulario (Asume id="platoFormulario" en el form)
function limpiarFormularioPlato() {
    document.getElementById('platoFormulario')?.reset(); 
    // Si usas el ID 'productForm', cámbialo aquí: document.getElementById('productForm')?.reset(); 
}

// 🚨 NUEVA FUNCIÓN: Cargar platos para mostrar en la tabla
async function cargarPlatos() {
    console.log("Cargando platos del menú...");
    try {
        const platos = await apiService.getMenu(); // Llama a GET /api/menu
        // ➡️ IMPLEMENTAR AQUÍ la lógica para dibujar 'platos' en la tabla HTML (renderPlatosEnTabla)
        console.log("Menú cargado:", platos);
        // Ejemplo: renderPlatosEnTabla(platos);
    } catch (error) {
        console.error("Error al cargar el menú:", error);
    }
}

// EN admin.js - Función guardarPlato (SOLUCIONA EL ERROR 'null')
async function guardarPlato() {
    // 1. Lectura de valores: USANDO LOS IDs REALES DEL admin_menu.html
    // 🚨 AHORA USAMOS: platoNombre, platoPrecio, platoDescripcion, etc.
    const nombre = document.getElementById('platoNombre')?.value.trim();
    const precio = parseFloat(document.getElementById('platoPrecio')?.value);
    const descripcion = document.getElementById('platoDescripcion')?.value.trim();
    const ingredientesTexto = document.getElementById('platoIngredientes')?.value.trim();
    const imagenUrl = document.getElementById('platoImagenUrl')?.value.trim();
    
    // 🚨 CAMPO OBLIGATORIO: CATEGORÍA (Necesitas agregar este ID en tu HTML)
    const categoriaId = document.getElementById('platoCategory')?.value; 

    // Validación
    // Usamos el operador ternario (?) para evitar el error 'Cannot read properties of null'
    // Si el elemento es null, la expresión se detiene y la validación salta.

    if (!nombre || isNaN(precio) || !descripcion || !categoriaId) {
        alert('Por favor, completa Nombre, Precio, Descripción y CATEGORÍA. (La categoría es obligatoria)');
        return;
    }

    // 2. Construir objeto (COINCIDE con Plato.java)
    const nuevoPlato = {
        nombreProducto: nombre, 
        precio: precio,
        descripcion: descripcion,
        ingredientesTexto: ingredientesTexto, 
        imagenUrl: imagenUrl,                 
        disponible: true, 
        categoria: { 
            idCategoria: parseInt(categoriaId) 
        } 
    };
    
    const btnGuardar = document.getElementById('guardarPlatoBtn'); 

    if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    }

    try {
        // 🚀 USAR apiService.crearPlato() (Esto ya está corregido)
        const response = await apiService.crearPlato(nuevoPlato); 

        alert(`✅ Plato "${response.nombreProducto}" creado con éxito.`);
        
        limpiarFormularioPlato();
        await cargarPlatos(); 

    } catch (error) {
        console.error('Error al guardar el plato:', error);
        alert('❌ ERROR AL GUARDAR: ' + error.message);
    } finally {
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = 'Guardar Plato';
        }
    }
}


// ===============================================
// INICIALIZACIÓN
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    // ... (Login y autenticación) ...
    if (typeof authService !== 'undefined' && (!authService.isAuthenticated() || !authService.hasRole('administrador'))) {
        window.location.href = 'login.html';
        return;
    }

    const userInfo = typeof authService !== 'undefined' ? authService.getCurrentUser() : null;
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userInfo) {
        userNameElement.textContent = userInfo.username || userInfo.usuario || 'Administrador';
    }

    // Cargar datos del dashboard y los platos al iniciar
    cargarDashboard();
    cargarPlatos(); // ⬅️ Carga inicial de la tabla

    // ... (Event listeners de logout y otros) ...
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutButton = document.getElementById("logout-button");

    const handleLogout = () => {
        if (typeof authService !== 'undefined') {
            authService.logout();
        } else {
            console.error('authService no está definido.');
            window.location.href = 'login.html';
        }
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Event listeners para botones del dashboard (ejemplo)
    // ... (Mantener tus listeners de alerts) ...

    // ===============================================
    // ¡EL LISTENER DE GUARDADO DE PLATO!
    // ===============================================
    const guardarBtn = document.getElementById('guardarPlatoBtn'); 
    if (guardarBtn) {
        guardarBtn.addEventListener('click', guardarPlato);
    }
});