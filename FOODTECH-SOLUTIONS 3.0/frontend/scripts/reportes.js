// =========================
// 🚨 Verificar autenticación
// =========================
const rol = localStorage.getItem('rol');
const logged = localStorage.getItem('loggedIn') === 'true';

if (!logged || !['administrador', 'gerente'].includes(rol)) {
    window.location.href = '../login.html';
}

// =========================
// 📌 Inicialización
// =========================
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarioUI();
    inicializarEventos();
    cargarDatosReportes();
});

// =========================
// 👤 Mostrar datos del usuario
// =========================
function cargarUsuarioUI() {
    const usuario = localStorage.getItem('usuario');
    const userInfoElement = document.querySelector('.user-info');

    if (userInfoElement && usuario) {
        const rolTexto = rol === 'administrador' ? 'Administrador' : 'Gerente';
        userInfoElement.textContent = `👤 ${usuario}, ${rolTexto}`;
    }
}

// =========================
// 🎛 Registrar eventos
// =========================
function inicializarEventos() {
    const exportarBtn = document.getElementById('exportarBtn');
    const selectorRango = document.getElementById('rangoFecha');
    const botonesRapidos = document.querySelectorAll('.report-btn');

    if (exportarBtn) {
        exportarBtn.addEventListener('click', exportarReporte);
    }

    if (selectorRango) {
        selectorRango.addEventListener('change', cargarDatosReportes);
    }

    botonesRapidos.forEach(btn => {
        btn.addEventListener('click', () => generarReporteRapido(btn.textContent.trim()));
    });
}

// =========================
// 📊 Cargar datos de reportes
// =========================
function cargarDatosReportes() {
    const selectorRango = document.getElementById('rangoFecha');
    if (!selectorRango) return;

    const rango = selectorRango.value;
    console.log(`📌 Cargando reportes para: ${rango}`);

    // Simulación de backend
    const metricas = {
        hoy:     { ventas: '2,450,000', pedidos: '156',  producto: 'Chuleta Valluna' },
        semana:  { ventas: '8,750,000', pedidos: '420',  producto: 'Sancocho de Gallina' },
        mes:     { ventas: '32,100,000', pedidos: '1,250', producto: 'Hamburguesa Clásica' }
    };

    const data = metricas[rango] || metricas.hoy;

    setTimeout(() => {
        const metricValues = document.querySelectorAll('.metric-value');
        if (metricValues.length >= 3) {
            metricValues[0].textContent = `$${data.ventas}`;
            metricValues[1].textContent = data.pedidos;
            metricValues[2].textContent = data.producto;
        }
    }, 800);
}

// =========================
// 📤 Exportar reporte
// =========================
function exportarReporte() {
    const rango = document.getElementById('rangoFecha')?.value ?? 'hoy';
    console.log(`📤 Exportando reporte (${rango}) ...`);

    // Simulación
    alert(`Reporte de "${rango}" exportado exitosamente.`);
}

// =========================
// ⚡ Reportes rápidos
// =========================
function generarReporteRapido(tipo) {
    console.log(`⚡ Generando reporte rápido: ${tipo}`);
    alert(`Generando reporte: ${tipo}`);
    // Aquí podrías abrir modal o redirigir a otra vista
}
