// Servicios para admin - DECLARACIÓN ÚNICA
const usuarioService = {
    async getUsuarios() {
        return await apiService.getUsuarios(); // ✅ CORREGIDO: usar método existente
    }
};

const reporteService = {
    async getMetricasDelDia() {
        try {
            return await apiService.getMetricasDelDia(); // ✅ CORREGIDO
        } catch (error) {
            console.error('Error obteniendo métricas:', error);
            return {
                usuariosActivos: 1,
                ventasHoy: 0,
                pedidosActivos: 0,
                mesasOcupadas: '0/0'
            };
        }
    }
};

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

// Inicialización CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    // ✅ VERIFICAR AUTENTICACIÓN Y ROL
    if (!authService.isAuthenticated() || !authService.hasRole('administrador')) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre de usuario
    const userInfo = authService.getCurrentUser();
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userInfo) {
        userNameElement.textContent = userInfo.username || userInfo.usuario || 'Administrador';
    }

    // Cargar datos del dashboard
    cargarDashboard();

    // Event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            authService.logout();
        });
    }

    // Botones de acción
    document.getElementById('viewUserLogs').addEventListener('click', function() {
        alert('Funcionalidad en desarrollo: Ver Logs de Acceso');
    });

    document.getElementById('lowStockAlert').addEventListener('click', function() {
        alert('Funcionalidad en desarrollo: Alertas de Stock');
    });

    document.getElementById('viewTodaySales').addEventListener('click', function() {
        alert('Funcionalidad en desarrollo: Ventas de Hoy');
    });

    document.getElementById('generateReports').addEventListener('click', function() {
        alert('Funcionalidad en desarrollo: Generar Reportes');
    });

    document.getElementById('viewBusinessMetrics').addEventListener('click', function() {
        alert('Funcionalidad en desarrollo: Métricas del Negocio');
    });

    document.getElementById('systemSettings').addEventListener('click', function() {
        alert('Funcionalidad en desarrollo: Configuración Sistema');
    });

    document.getElementById('backupSystem').addEventListener('click', function() {
        alert('Funcionalidad en desarrollo: Backup del Sistema');
    });

    // Buscador global
    document.getElementById('globalSearch').addEventListener('input', function(e) {
        console.log('Buscando:', e.target.value);
    });

    // --- CÓDIGO PARA EL BOTÓN DE LOGOUT ---

// Espera a que la página cargue
document.addEventListener("DOMContentLoaded", () => {

    // Busca el botón que acabamos de crear
    const logoutButton = document.getElementById("logout-button");

    // Si el botón existe...
    if (logoutButton) {
        // ...añade un "escuchador" de clics
        logoutButton.addEventListener("click", () => {
            // Llama a la función de logout que ya existe en authService
            authService.logout();
        });
    }

    // (Aquí puede ir el resto de tu código de admin.js)

});
});