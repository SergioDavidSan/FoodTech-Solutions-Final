// Verificar autenticación (solo admin)
if (localStorage.getItem('loggedIn') !== 'true' || localStorage.getItem('rol') !== 'administrador') {
    window.location.href = '../login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del usuario
    const usuario = localStorage.getItem('usuario');
    const userInfoElement = document.querySelector('.user-info');
    if (userInfoElement && usuario) {
        userInfoElement.textContent = `👤 ${usuario}, Administrador`;
    }
    
    // Event listeners
    document.getElementById('nuevoUsuarioBtn').addEventListener('click', mostrarFormularioUsuario);
    
    // Event listeners para botones de acción
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            editarUsuario(this);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            eliminarUsuario(this);
        });
    });
    
    // Cargar datos iniciales
    cargarUsuarios();
});

function cargarUsuarios() {
    // Simular carga de usuarios desde el backend
    // En producción: fetch('/api/usuarios')
    
    console.log('Cargando lista de usuarios...');
}

function mostrarFormularioUsuario() {
    // En un sistema real, aquí abrirías un modal
    alert('Funcionalidad: Abrir formulario para crear nuevo usuario');
    
    // Ejemplo de modal:
    // const modal = document.createElement('div');
    // modal.innerHTML = `...formulario de usuario...`;
    // document.body.appendChild(modal);
}

function editarUsuario(btn) {
    const fila = btn.closest('tr');
    const celdas = fila.querySelectorAll('td');
    
    const usuario = {
        username: celdas[0].textContent,
        nombre: celdas[1].textContent,
        rol: celdas[2].querySelector('.rol-badge').textContent,
        email: celdas[3].textContent,
        estado: celdas[4].querySelector('.estado-badge').textContent
    };
    
    // Simular edición
    const nuevoRol = prompt(`Cambiar rol para ${usuario.nombre}:`, usuario.rol);
    
    if (nuevoRol && nuevoRol !== usuario.rol) {
        // Actualizar UI
        const badge = celdas[2].querySelector('.rol-badge');
        badge.textContent = nuevoRol;
        badge.className = `rol-badge ${nuevoRol.toLowerCase()}`;
        
        console.log('Usuario actualizado:', { ...usuario, rol: nuevoRol });
        alert('Rol de usuario actualizado exitosamente!');
    }
}

function eliminarUsuario(btn) {
    const fila = btn.closest('tr');
    const nombre = fila.querySelector('td:nth-child(2)').textContent;
    
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${nombre}?`)) {
        // Simular eliminación
        fila.style.opacity = '0.5';
        
        setTimeout(() => {
            fila.remove();
            actualizarEstadisticas();
        }, 1000);
        
        console.log('Usuario eliminado:', nombre);
        alert('Usuario eliminado exitosamente!');
    }
}

function actualizarEstadisticas() {
    // Actualizar contadores
    const totalUsuarios = document.querySelectorAll('.users-table tbody tr').length;
    const usuariosActivos = document.querySelectorAll('.estado-badge.activo').length;
    const usuariosInactivos = totalUsuarios - usuariosActivos;
    
    document.querySelectorAll('.stat-number')[0].textContent = totalUsuarios;
    document.querySelectorAll('.stat-number')[1].textContent = usuariosActivos;
    document.querySelectorAll('.stat-number')[2].textContent = usuariosInactivos;
}