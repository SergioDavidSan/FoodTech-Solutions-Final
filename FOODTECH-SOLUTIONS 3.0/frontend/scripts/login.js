// ============================================================
// LOGIN.JS — RUTAS CORREGIDAS
// ============================================================

console.log('✅ login.js cargado correctamente');
console.log('✅ authService disponible:', typeof authService !== 'undefined');
console.log('✅ apiService disponible:', typeof apiService !== 'undefined');

// CORRECCIÓN: verificar sesión sin redirección infinita
if (typeof authService !== 'undefined' && authService.isAuthenticated()) {
    console.log('🔄 Usuario ya autenticado, redirigiendo...');
    authService.redirectByRole();
} else {
    console.log('🔒 Usuario no autenticado, mostrando login');
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    await handleLogin();
});

// ============================================================
// LOGIN
// ============================================================

async function handleLogin() {
    const rol = document.getElementById('rol').value;
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value;

    console.log('🔄 Intentando login con:', { usuario, password, rol });

    const validation = validateLoginForm(usuario, password, rol);
    if (!validation.isValid) {
        showError(validation.errors.join(', '));
        return;
    }

    const loginBtn = document.querySelector('.btn-login');
    const originalText = loginBtn.textContent;
    setLoadingState(loginBtn, true);

    try {
        console.log('🔐 Llamando authService.login()...');
        const result = await authService.login({ usuario, password, rol });

        console.log('📨 Respuesta de authService:', result);

        if (result.success) {
            showSuccess('¡Login exitoso! Redirigiendo...');
            setTimeout(() => authService.redirectByRole(), 1300);
        } else {
            handleLoginFailure(result, loginBtn, originalText);
        }

    } catch (error) {
        handleLoginError(error, loginBtn, originalText);
    }
}

// ... (el resto del archivo queda igual)
// No se modifica nada más porque no genera errores.

/**
 * VALIDAR FORMULARIO DE LOGIN
 */
function validateLoginForm(usuario, password, rol) {
    const errors = [];

    if (!rol) {
        errors.push('Selecciona un rol');
    }

    if (!usuario) {
        errors.push('El usuario es requerido');
    } else if (usuario.length < 3) {
        errors.push('El usuario debe tener al menos 3 caracteres');
    }

    if (!password) {
        errors.push('La contraseña es requerida');
    } else if (password.length < 4) {
        errors.push('La contraseña debe tener al menos 4 caracteres');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * MANEJAR LOGIN EXITOSO
 */
async function handleLoginSuccess(result) {
    showSuccess('¡Login exitoso! Redirigiendo...');
    console.log('✅ Login exitoso, redirigiendo...');
    
    // Pequeña pausa para que el usuario vea el mensaje de éxito
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirigir según el rol
    authService.redirectByRole();
}

/**
 * MANEJAR FALLO DE LOGIN
 */
function handleLoginFailure(result, loginBtn, originalText) {
    const errorMessage = result.error || 'Error en el login. Verifica tus credenciales.';
    showError(errorMessage);
    console.log('❌ Login fallido:', result.error);
    resetLoginButton(loginBtn, originalText);
    
    // Enfocar el campo de contraseña para nuevo intento
    document.getElementById('password').focus();
}

/**
 * MANEJAR ERROR DE LOGIN
 */
function handleLoginError(error, loginBtn, originalText) {
    console.error('💥 ERROR en login:', error);
    
    let errorMessage = 'Error de conexión con el servidor';
    
    if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de conexión. Verifica tu internet y intenta nuevamente.';
    } else if (error.message.includes('401')) {
        errorMessage = 'Usuario o contraseña incorrectos';
    } else if (error.message.includes('500')) {
        errorMessage = 'Error del servidor. Intenta más tarde.';
    } else {
        errorMessage = `Error: ${error.message}`;
    }
    
    showError(errorMessage);
    resetLoginButton(loginBtn, originalText);
}

/**
 * ESTADO DE LOADING DEL BOTÓN
 */
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.textContent = '⏳ Autenticando...';
        button.disabled = true;
        button.style.opacity = '0.7';
    } else {
        button.textContent = 'Iniciar Sesión';
        button.disabled = false;
        button.style.opacity = '1';
    }
}

/**
 * RESTABLECER BOTÓN DE LOGIN
 */
function resetLoginButton(button, originalText) {
    button.textContent = originalText;
    button.disabled = false;
    button.style.opacity = '1';
}

/**
 * MOSTRAR MENSAJE DE ERROR
 */
function showError(message) {
    console.log('🛑 Mostrando error:', message);
    removeExistingMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 12px;
        border-radius: 6px;
        margin: 15px 0;
        border: 1px solid #f5c6cb;
        font-size: 14px;
        animation: fadeIn 0.3s ease-in;
    `;
    errorDiv.textContent = message;
    
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.prepend(errorDiv);
    }
    
    // Agregar animación CSS si no existe
    addFadeInAnimation();
}

/**
 * MOSTRAR MENSAJE DE ÉXITO
 */
function showSuccess(message) {
    console.log('✅ Mostrando éxito:', message);
    removeExistingMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #d4edda;
        color: #155724;
        padding: 12px;
        border-radius: 6px;
        margin: 15px 0;
        border: 1px solid #c3e6cb;
        font-size: 14px;
        animation: fadeIn 0.3s ease-in;
    `;
    successDiv.textContent = message;
    
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.prepend(successDiv);
    }
    
    // Agregar animación CSS si no existe
    addFadeInAnimation();
}

/**
 * AGREGAR ANIMACIÓN CSS
 */
function addFadeInAnimation() {
    if (!document.getElementById('loginAnimations')) {
        const style = document.createElement('style');
        style.id = 'loginAnimations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * ELIMINAR MENSAJES EXISTENTES
 */
function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => {
        msg.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => msg.remove(), 300);
    });
}

/**
 * AGREGAR EVENT LISTENER PARA ENTER
 */
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && document.activeElement.id === 'password') {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
});

/**
 * MEJORAR UX DEL FORMULARIO
 */
document.addEventListener('DOMContentLoaded', function() {
    // Focus en el primer campo
    const usuarioField = document.getElementById('usuario');
    if (usuarioField) {
        setTimeout(() => usuarioField.focus(), 100);
    }
    
    // Limpiar mensajes al cambiar campos
    const formFields = document.querySelectorAll('#usuario, #password, #rol');
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            removeExistingMessages();
        });
    });
    
    // Mostrar/ocultar contraseña (opcional)
    const togglePassword = document.createElement('button');
    togglePassword.type = 'button';
    togglePassword.textContent = '👁️';
    togglePassword.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
    `;
    
    const passwordField = document.getElementById('password');
    if (passwordField && passwordField.parentElement) {
        passwordField.parentElement.style.position = 'relative';
        passwordField.style.paddingRight = '40px';
        togglePassword.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
        passwordField.parentElement.appendChild(togglePassword);
    }
});

console.log('🎯 Login.js configurado correctamente');