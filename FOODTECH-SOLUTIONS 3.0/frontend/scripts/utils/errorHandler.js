class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('Error inesperado en la aplicación');
        });

        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('Error crítico en la aplicación');
        });
    }

    handleApiError(error) {
        console.error('API Error:', error);

        let userMessage = 'Error de conexión con el servidor';

        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            userMessage = 'Error de conexión. Verifica tu internet.';
        } else if (error.message.includes('401')) {
            userMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
            this.handleUnauthorized();
        } else if (error.message.includes('403')) {
            userMessage = 'No tienes permisos para realizar esta acción.';
        } else if (error.message.includes('404')) {
            userMessage = 'Recurso no encontrado.';
        } else if (error.message.includes('500')) {
            userMessage = 'Error interno del servidor.';
        }

        this.showError(userMessage);
        return userMessage;
    }

    handleUnauthorized() {
        // Limpiar datos de sesión y redirigir al login
        localStorage.clear();
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 2000);
    }

    showError(message, options = {}) {
        this.showNotification(message, 'error', options);
    }

    showSuccess(message, options = {}) {
        this.showNotification(message, 'success', options);
    }

    showWarning(message, options = {}) {
        this.showNotification(message, 'warning', options);
    }

    showNotification(message, type = 'info', options = {}) {
        const { duration = 5000, position = 'top-right' } = options;

        // Remover notificaciones existentes
        this.removeExistingNotifications();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const typeConfig = {
            error: { bgColor: '#f8d7da', textColor: '#721c24', borderColor: '#f5c6cb', icon: '❌' },
            success: { bgColor: '#d4edda', textColor: '#155724', borderColor: '#c3e6cb', icon: '✅' },
            warning: { bgColor: '#fff3cd', textColor: '#856404', borderColor: '#ffeaa7', icon: '⚠️' },
            info: { bgColor: '#d1ecf1', textColor: '#0c5460', borderColor: '#bee5eb', icon: 'ℹ️' }
        };

        const config = typeConfig[type] || typeConfig.info;

        notification.style.cssText = `
            position: fixed;
            ${this.getPositionStyles(position)};
            background: ${config.bgColor};
            color: ${config.textColor};
            border: 1px solid ${config.borderColor};
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.innerHTML = `
            <span style="font-size: 1.2em;">${config.icon}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" 
                    style="background: none; border: none; font-size: 1.2em; cursor: pointer; margin-left: auto;">
                ✕
            </button>
        `;

        // Agregar estilos de animación
        this.addNotificationStyles();

        document.body.appendChild(notification);

        // Auto-remover después de la duración
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, duration);
        }
    }

    getPositionStyles(position) {
        const positions = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;',
            'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
            'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
        };
        return positions[position] || positions['top-right'];
    }

    addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .notification {
                    animation: slideIn 0.3s ease-out;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    removeExistingNotifications() {
        const existing = document.querySelectorAll('.notification');
        existing.forEach(notification => notification.remove());
    }
}

const errorHandler = new ErrorHandler();