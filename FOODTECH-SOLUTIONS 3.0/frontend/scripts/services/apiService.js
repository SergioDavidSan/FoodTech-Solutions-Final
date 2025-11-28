class ApiService {
    constructor() {
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

        // --- CORRECCIÓN: Usar la ruta correcta 'modules' ---
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
                alert(`❌ ${error.message}`);
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
    // PRODUCTOS
    // ==========================================================
    async getProductos() {
        return this.request('/productos');
    }

    async getProductosDisponibles() {
        const productos = await this.getProductos();
        return productos.filter(p => p.disponible);
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
}

const apiService = new ApiService();
