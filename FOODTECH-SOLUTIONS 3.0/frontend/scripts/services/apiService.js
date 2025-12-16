class ApiService {
    constructor() {
        // Asegúrate de que el puerto sea el correcto (8082 según tu configuración actual)
        this.baseURL = 'http://localhost:8082/api';
        this.token = localStorage.getItem('authToken');
    }

    // ==========================================================
    // CABECERAS
    // ==========================================================
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // ==========================================================
    // TOKEN MANAGEMENT
    // ==========================================================
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    getToken() {
        return this.token;
    }

    logout() {
        console.log('👋 Cerrando sesión por seguridad...');
        this.token = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('usuario');
        localStorage.removeItem('rol');
        localStorage.removeItem('userData');

        // Ruta absoluta al login
        if (!window.location.href.includes('login.html')) {
            window.location.href = '/modules/login.html';
        }
    }

    // ==========================================================
    // PETICIONES HTTP GENERALES
    // ==========================================================
    async request(url, options = {}) {
        try {
            const config = {
                method: options.method || 'GET',
                headers: this.getHeaders(options.includeAuth !== false),
                body: options.body ? JSON.stringify(options.body) : undefined
            };

            console.log(`🔄 Llamando API: ${config.method} ${this.baseURL}${url}`);

            const response = await fetch(`${this.baseURL}${url}`, config);

            console.log(`📡 Respuesta HTTP: ${response.status} ${response.statusText}`);

            if (response.status === 401) {
                if (!url.includes('/auth/login')) {
                    this.logout();
                    throw new Error('Sesión expirada');
                } else {
                    throw new Error('Usuario o contraseña incorrectos');
                }
            }

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Error ${response.status}: ${errorText || response.statusText}`;

                if (response.status === 404) errorMessage = 'Recurso no encontrado';
                else if (response.status === 500) errorMessage = 'Error interno del servidor';
                else if (response.status === 403) errorMessage = 'Acceso denegado';

                throw new Error(errorMessage);
            }

            if (response.status === 204) return null;

            const data = await response.json();
            console.log(`✅ Éxito API:`, data);
            return data;

        } catch (error) {
            console.error(`❌ Error API: ${error.message}`);

            if (error.message.includes('Failed to fetch')) {
                alert('❌ No se puede conectar al servidor. Verifica que el backend esté ejecutándose.');
            } else {
                // Evitamos alertar errores esperados de login para manejarlos en el UI
                if(!url.includes('/auth/login')) {
                    alert(`❌ ${error.message}`);
                }
            }

            throw error;
        }
    }

    // ==========================================================
    // AUTENTICACIÓN
    // ==========================================================
    async login(credentials) {
        const result = await this.request('/auth/login', {
            method: 'POST',
            body: credentials,
            includeAuth: false
        });

        if (result.token) {
            this.setToken(result.token);
        }

        return result;
    }

    async verifyToken() {
        try {
            return await this.request('/auth/verify');
        } catch (error) {
            this.logout();
            return false;
        }
    }

    // ==========================================================
    // USUARIOS
    // ==========================================================
    async getUsuarios() {
        return this.request('/usuarios');
    }

    async crearUsuario(usuarioData) {
        return this.request('/usuarios', {
            method: 'POST',
            body: usuarioData
        });
    }

    // ==========================================================
    // PEDIDOS
    // ==========================================================
    async crearPedido(pedidoData) {
        return this.request('/pedidos', {
            method: 'POST',
            body: pedidoData
        });
    }

    async getPedidos() {
        return this.request('/pedidos');
    }

    async getPedidosActivos() {
        const pedidos = await this.getPedidos();
        return pedidos.filter(pedido =>
            ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION'].includes(pedido.estado?.toUpperCase())
        );
    }

    async updatePedidoEstado(id, estado) {
        return this.request(`/pedidos/${id}/estado`, {
            method: 'PUT',
            body: { estado }
        });
    }

    // ==========================================================
    // GESTIÓN DE MENÚ (PLATOS VENDIBLES) 🍽️
    // ==========================================================
    
    /**
     * @description Obtiene la lista de platos del menú. Usado por el Panel de Mesero.
     * Llama al endpoint /menu.
     */
    async getMenu() {
        return this.request('/menu'); 
    }

    /**
     * @description Crea un nuevo plato en el menú. Usado por el Panel de Administración.
     */
    async crearPlato(platoData) {
        return this.request('/menu', {
            method: 'POST',
            body: platoData
        });
    }

    // Método para eliminar un plato
    async eliminarPlato(id) {
        return this.request(`/menu/${id}`, { // Esta es la linea que llama al cliente 
            method: 'DELETE'
        });
    }
    
    // ==========================================================
    // GESTIÓN DE INVENTARIO (INSUMOS/STOCK) 📦
    // ==========================================================
    
    /**
     * @description Obtiene los ítems del inventario (Stock/Insumos)
     * Utiliza el endpoint /inventario
     */
    async getInventario() {
        return this.request('/inventario'); 
    }

    /**
     * @description Crea un nuevo ítem de inventario (Stock/Insumo).
     * Se mantiene el nombre 'crearProducto' para compatibilidad con inventory.js
     * y apunta al endpoint de inventario.
     */
    async crearProducto(itemData) {
        return this.request('/inventario', {
            method: 'POST',
            body: itemData
        });
    }
    
    /**
     * @description Elimina un ítem de inventario (Stock/Insumo).
     * Se mantiene el nombre 'eliminarProducto' para compatibilidad con inventory.js
     * y apunta al endpoint de inventario.
     */
    async eliminarProducto(id) {
        return this.request(`/inventario/${id}`, {
            method: 'DELETE'
        });
    }

    // ==========================================================
    // MESAS
    // ==========================================================
    async getMesas() {
        return this.request('/mesas');
    }

    async updateMesaEstado(id, estado) {
        return this.request(`/mesas/${id}/estado`, {
            method: 'PUT',
            body: { estado }
        });
    }

    // ==========================================================
    // FACTURAS
    // ==========================================================
    async generarFactura(idPedido, facturaData) {
        return this.request(`/facturas/pedido/${idPedido}`, {
            method: 'POST',
            body: facturaData
        });
    }

    async getFacturas() {
        return this.request('/facturas');
    }

    // ==========================================================
    // REPORTES
    // ==========================================================
    async getReportesVentas() {
        return this.request('/reportes/ventas');
    }

    async getMetricasDelDia() {
        try {
            return await this.request('/reportes/metricas-dia');
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
    
    // NOTA: La antigua función getProductos() y getProductosDisponibles() 
    // se han eliminado para evitar conflictos, ya que el Inventario usa getInventario().

} // FIN DE LA CLASE ApiService

const apiService = new ApiService();