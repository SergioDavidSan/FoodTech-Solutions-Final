class AuthService {
    constructor() {
        this.apiService = apiService;
        this.initializeAuth();
    }

    /**
     * INICIALIZAR ESTADO DE AUTENTICACIÓN
     */
    initializeAuth() {
        const token = this.apiService.getToken();
        const loggedIn = localStorage.getItem('loggedIn');
        
        if (token && loggedIn !== 'true') {
            localStorage.setItem('loggedIn', 'true');
        }
        
        if (!token && loggedIn === 'true') {
            this.clearAuthData();
        }
    }

    /**
 * INICIAR SESIÓN
 */
async login(loginData) { 
    try {
        const credentials = {
            username: loginData.usuario,
            password: loginData.password 
        };

        console.log('🔐 Intentando login con credenciales:', credentials);

        const response = await this.apiService.request('/auth/login', {
            method: 'POST',
            body: credentials,
            includeAuth: false
        });

        console.log('📨 Respuesta del backend:', response);
        
        if (response.token) {

            const rolReal = this.determineUserRole(response, loginData.rol);

            await this.saveAuthData(response, rolReal);
            
            console.log('✅ Login exitoso:', {
                usuario: response.username,
                rol: rolReal
            });

            return { 
                success: true, 
                usuario: response,
                rol: rolReal
            };
        } else {
            return { 
                success: false, 
                error: response.message || 'Credenciales inválidas' 
            };
        }

    } catch (error) {
        console.error('❌ Error en login:', error);
        return { 
            success: false, 
            error: this.getFriendlyErrorMessage(error) 
        };
    }
}



    // ==========================================================
    // MÉTODO DE REGISTRO (Asegúrate de tener este)
    // ==========================================================
    /**
     * REGISTRAR UN NUEVO USUARIO
     */
    async register(registroData) {
        // registroData debe ser un objeto: { nombreUsuario, contrasena, email, rol }
        console.log("🔐 Intentando registro con:", registroData);
        try {
            
            const options = {
                method: 'POST',
                body: registroData,
                includeAuth: false
            };

            // ¡OJO! La URL es /auth/register (sin /api/ duplicado)
            const response = await this.apiService.request('/auth/register', options);
            
            console.log("📡 Respuesta de registro de la API:", response);
            
            if (response.idUsuario) {
                return { success: true, data: response };
            } else {
                return { success: false, error: response.message || 'Error desconocido del servidor.' };
            }

        } catch (error) {
            console.error("❌ Error en authService.register:", error);
            return { success: false, error: error.message || 'Error de conexión.' };
        }
    }
    // ==========================================================
    
    
    /**
     * DETERMINAR ROL DEL USUARIO
     */
    determineUserRole(backendResponse, rolSeleccionado) {
        if (backendResponse.role) {
            return backendResponse.role;
        }
        
        if (backendResponse.authorities && backendResponse.authorities.length > 0) {
            const roles = backendResponse.authorities.map(auth => 
                auth.authority.replace('ROLE_', '').toLowerCase()
            );
            return roles[0];
        }
        
        return rolSeleccionado || 'usuario';
    }

    /**
     * GUARDAR DATOS DE AUTENTICACIÓN
     */
    async saveAuthData(backendResponse, rol) {
        this.apiService.setToken(backendResponse.token);
        
        localStorage.setItem('usuario', backendResponse.username || 'Usuario');
        localStorage.setItem('rol', rol);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userId', backendResponse.id || '1');
        
        const userData = {
            username: backendResponse.username,
            role: rol,
            id: backendResponse.id,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
    }

  /**
     * CERRAR SESIÓN
     */
    logout() {
        console.log('👋 Cerrando sesión...');
        this.clearAuthData();
        this.apiService.logout();
        
        setTimeout(() => {
            // Ruta absoluta al login
            window.location.href = '/login.html';
        }, 100);
    }

    /**
     * LIMPIAR DATOS DE AUTENTICACIÓN
     */
    clearAuthData() {
        const keys = [
            'usuario', 
            'rol', 
            'loggedIn', 
            'userId', 
            'userData'
        ];
        
        keys.forEach(key => localStorage.removeItem(key));
        console.log('🧹 Datos de autenticación limpiados');
    }

    /**
     * VERIFICAR SI ESTÁ AUTENTICADO
     */
    isAuthenticated() {
        const hasToken = this.apiService.getToken() !== null;
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        const hasUserData = localStorage.getItem('userData') !== null;
        
        return hasToken && isLoggedIn && hasUserData;
    }

    /**
     * OBTENER USUARIO ACTUAL
     */
    getCurrentUser() {
        try {
            const userData = localStorage.getItem('userData');
            if (!userData) return null;
            
            const parsed = JSON.parse(userData);
            return {
                username: parsed.username,
                rol: parsed.role || parsed.rol,
                id: parsed.id,
                loginTime: parsed.loginTime
            };
        } catch (error) {
            console.error('❌ Error obteniendo usuario:', error);
            return null;
        }
    }

    /**
     * VERIFICAR SI TIENE UN ROL ESPECÍFICO
     */
    hasRole(requiredRole) {
        if (!this.isAuthenticated()) return false;
        
        const userRole = localStorage.getItem('rol');
        const userData = this.getCurrentUser();
        
        if (userRole === requiredRole) return true;
        
        if (userData && userData.authorities) {
            return userData.authorities.some(auth => 
                auth.authority === `ROLE_${requiredRole.toUpperCase()}` ||
                auth.authority === requiredRole.toUpperCase()
            );
        }
        
        return false;
    }

    /**
     * VERIFICAR MÚLTIPLES ROLES
     */
    hasAnyRole(requiredRoles) {
        return requiredRoles.some(role => this.hasRole(role));
    }

    /**
     * OBTENER ID DEL USUARIO
     */
    getUserId() {
        const userData = this.getCurrentUser();
        return userData?.id || localStorage.getItem('userId') || 1;
    }

   /**
     * REDIRIGIR SEGÚN ROL
     */
    redirectByRole() {
        
        // Si no está autenticado, ir al login (ruta absoluta)
        if (!this.isAuthenticated()) {
            window.location.href = '/modules/login.html';
            return;
        }

        const rol = localStorage.getItem('rol');
        
        // Rutas absolutas para cada rol
        const redirectUrls = {
            'administrador': '/modules/admin.html',
            'mesero': '/modules/mesero.html', 
            'cocinero': '/modules/cocinero.html',
            'cajero': '/modules/cajero.html'
        };

        // Si el rol no existe, ir al login
        const redirectUrl = redirectUrls[rol] || '/modules/login.html';
        
        console.log('🔄 Redirigiendo a:', redirectUrl);
        window.location.href = redirectUrl;
    }

    /**
     * MENSAJES DE ERROR AMIGABLES
     */
    getFriendlyErrorMessage(error) {
        const message = error.message || '';
        
        // --- ¡AQUÍ ESTÁ LA MEJORA DE LA OTRA IA! ---
        if (message.includes('401') || message.includes('Unauthorized')) {
            // No digas "Sesión expirada" si estamos en el login
            if (window.location.href.includes('login.html')) {
                return 'Usuario o contraseña incorrectos';
            } else {
                return 'Sesión expirada';
            }
        }
        
        if (message.includes('Network Error') || message.includes('Failed to fetch')) {
            return 'Error de conexión. Verifique su internet';
        }
        
        if (message.includes('500')) {
            return 'Error del servidor. Intente más tarde';
        }
        
        return message || 'Error desconocido. Intente nuevamente';
    }
}

const authService = new AuthService();