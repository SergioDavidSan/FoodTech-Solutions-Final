// ✅ VERIFICACIÓN DE AUTENTICACIÓN MEJORADA - UNA SOLA VEZ
const rol = localStorage.getItem('rol');
if (!authService.isAuthenticated() || !['administrador', 'gerente'].includes(rol)) {
    authService.logout();
    window.location.href = '../login.html';
}

// ✅ SERVICIO DE PRODUCTOS (si no existe)
const productoService = {
    async getProductos() {
        try {
            return await apiService.getProductos();
        } catch (error) {
            console.error('Error obteniendo productos:', error);
            return [];
        }
    },

    async crearProducto(productoData) {
        return await apiService.request('/productos', {
            method: 'POST',
            body: productoData
        });
    },

    async actualizarProducto(id, productoData) {
        return await apiService.request(`/productos/${id}`, {
            method: 'PUT',
            body: productoData
        });
    },

    async eliminarProducto(id) {
        return await apiService.request(`/productos/${id}`, {
            method: 'DELETE'
        });
    },

    async validarProducto(productoData) {
        const errors = [];
        
        if (!productoData.nombreProducto || productoData.nombreProducto.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        if (!productoData.precio || productoData.precio <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }
        
        if (productoData.stock < 0) {
            errors.push('El stock no puede ser negativo');
        }
        
        if (productoData.stockMinimo < 0) {
            errors.push('El stock mínimo no puede ser negativo');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
};

// ✅ INICIALIZACIÓN PRINCIPAL - UNA SOLA VEZ
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del usuario
    const userInfo = authService.getCurrentUser();
    const userInfoElement = document.querySelector('.user-info');
    if (userInfoElement && userInfo) {
        const rolDisplay = rol === 'administrador' ? 'Administrador' : 'Gerente';
        userInfoElement.textContent = `👤 ${userInfo.username || userInfo.usuario || 'Usuario'}, ${rolDisplay}`;
    }
    
    // Configurar event listeners
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            guardarProducto();
        });
    }
    
    // Configurar logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            authService.logout();
            window.location.href = '../login.html';
        });
    }
    
    // Cargar inventario inicial
    cargarInventarioInicial();
    
    // Configurar event delegation para botones dinámicos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-edit')) {
            editarProducto(e.target.dataset.id);
        }
        if (e.target.classList.contains('btn-delete')) {
            eliminarProducto(e.target.dataset.id);
        }
    });
});

// ✅ CARGAR INVENTARIO DESDE BACKEND
async function cargarInventarioInicial() {
    try {
        console.log('🔄 Cargando inventario...');
        const productos = await productoService.getProductos();
        actualizarTablaInventario(productos);
    } catch (error) {
        console.error('Error cargando inventario:', error);
        // Mostrar datos de ejemplo si hay error
        mostrarInventarioEjemplo();
    }
}

// ✅ ACTUALIZAR TABLA DE INVENTARIO
function actualizarTablaInventario(productos) {
    const tbody = document.querySelector('.inventory-table tbody');
    if (!tbody) return;

    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No hay productos en el inventario</td></tr>';
        return;
    }

    tbody.innerHTML = productos.map(producto => `
        <tr data-product-id="${producto.idProducto}">
            <td>${producto.nombreProducto || 'N/A'}</td>
            <td>${producto.categoria?.nombreCategoria || producto.idCategoria || 'N/A'}</td>
            <td class="${producto.stock <= (producto.stockMinimo || 5) ? 'low-stock' : ''}">
                ${producto.stock || 0}
            </td>
            <td>${producto.stockMinimo || 5}</td>
            <td>${producto.proveedor || 'N/A'}</td>
            <td>
                <button class="btn-edit" data-id="${producto.idProducto}">Editar</button>
                <button class="btn-delete" data-id="${producto.idProducto}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// ✅ MOSTRAR INVENTARIO DE EJEMPLO (fallback)
function mostrarInventarioEjemplo() {
    const inventarioEjemplo = [
        { 
            idProducto: 1, 
            nombreProducto: 'Tomate Chonto', 
            categoria: { nombreCategoria: 'Verduras' }, 
            stock: 25, 
            stockMinimo: 5, 
            proveedor: 'Proveedor A' 
        },
        { 
            idProducto: 2, 
            nombreProducto: 'Carne de Res Molida', 
            categoria: { nombreCategoria: 'Cárnicos' }, 
            stock: 15, 
            stockMinimo: 3, 
            proveedor: 'Proveedor B' 
        },
        { 
            idProducto: 3, 
            nombreProducto: 'Queso Mozzarella', 
            categoria: { nombreCategoria: 'Lácteos' }, 
            stock: 10, 
            stockMinimo: 2, 
            proveedor: 'Proveedor A' 
        }
    ];
    
    actualizarTablaInventario(inventarioEjemplo);
    console.log('📋 Mostrando inventario de ejemplo');
}

// ✅ GUARDAR NUEVO PRODUCTO
async function guardarProducto() {
    const form = document.getElementById('productForm');
    if (!form) {
        mostrarError('No se encontró el formulario');
        return;
    }

    const formData = new FormData(form);
    
    const productoData = {
        nombreProducto: formData.get('productName')?.trim(),
        descripcion: formData.get('productDescription')?.trim(),
        precio: parseFloat(formData.get('productPrice')) || 0,
        idCategoria: parseInt(formData.get('productCategory')) || 1,
        stock: parseInt(formData.get('productStock')) || 0,
        stockMinimo: parseInt(formData.get('minStock')) || 5,
        proveedor: formData.get('productSupplier')?.trim(),
        disponible: formData.get('productAvailable') === 'on'
    };
    
    try {
        // Validar producto
        const validacion = await productoService.validarProducto(productoData);
        if (!validacion.isValid) {
            mostrarError('Errores en el formulario: ' + validacion.errors.join(', '));
            return;
        }
        
        // Guardar en backend
        const resultado = await productoService.crearProducto(productoData);
        mostrarExito('✅ Producto agregado exitosamente al inventario!');
        form.reset();
        
        // Recargar inventario
        await cargarInventarioInicial();
        
    } catch (error) {
        console.error('Error guardando producto:', error);
        mostrarError('❌ Error al guardar el producto: ' + error.message);
    }
}

// ✅ EDITAR PRODUCTO
async function editarProducto(productoId) {
    if (!productoId) {
        mostrarError('ID de producto no válido');
        return;
    }

    try {
        // Obtener datos actuales del producto
        const productos = await productoService.getProductos();
        const producto = productos.find(p => p.idProducto == productoId);
        
        if (!producto) {
            mostrarError('Producto no encontrado');
            return;
        }
        
        // En un sistema real, aquí abrirías un modal de edición
        const nuevoStock = prompt(`Editar stock para "${producto.nombreProducto}":`, producto.stock);
        
        if (nuevoStock !== null && nuevoStock !== producto.stock.toString()) {
            const stockNum = parseInt(nuevoStock);
            if (isNaN(stockNum) || stockNum < 0) {
                mostrarError('El stock debe ser un número positivo');
                return;
            }
            
            await productoService.actualizarProducto(productoId, {
                ...producto,
                stock: stockNum
            });
            
            mostrarExito('✅ Stock actualizado exitosamente!');
            await cargarInventarioInicial();
        }
        
    } catch (error) {
        console.error('Error editando producto:', error);
        mostrarError('❌ Error al editar el producto');
    }
}

// ✅ ELIMINAR PRODUCTO
async function eliminarProducto(productoId) {
    if (!productoId) {
        mostrarError('ID de producto no válido');
        return;
    }

    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }

    try {
        await productoService.eliminarProducto(productoId);
        mostrarExito('✅ Producto eliminado exitosamente!');
        await cargarInventarioInicial();
        
    } catch (error) {
        console.error('Error eliminando producto:', error);
        mostrarError('❌ Error al eliminar el producto');
    }
}

// ✅ FUNCIONES DE UTILIDAD
function mostrarError(mensaje) {
    console.error(mensaje);
    // Puedes implementar un sistema de notificaciones más elegante
    alert(mensaje);
}

function mostrarExito(mensaje) {
    console.log(mensaje);
    alert(mensaje);
}