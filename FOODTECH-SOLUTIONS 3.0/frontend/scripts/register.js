// Espera a que el contenido del DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // Obtenemos los elementos del DOM
    const registerForm = document.getElementById("register-form");
    const spinner = document.getElementById("btn-spinner");
    const btnText = document.getElementById("btn-text");
    const registerBtn = document.getElementById("register-button");

    // Verificamos que los servicios estén disponibles
    if (typeof authService === 'undefined') {
        console.error('Error: authService no está definido.');
    }

    // Añadimos el "escuchador" al formulario
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Evita que la página se recargue

            // 1. ESTADO DE CARGA (UI)
            // Mostramos el spinner y desactivamos el botón
            if (spinner) spinner.style.display = "block";
            if (btnText) btnText.textContent = "Procesando...";
            if (registerBtn) registerBtn.disabled = true;

            try {
                // 2. RECOPILAR DATOS
                const rol = document.getElementById("rol").value;
                const usuario = document.getElementById("usuario").value;
                const email = document.getElementById("email").value;
                const contrasena = document.getElementById("contrasena").value;

                // Creamos el objeto de datos para enviar
                const registroData = {
                    nombreUsuario: usuario,
                    contrasena: contrasena,
                    email: email,
                    rol: rol
                };
                
                console.log("🔄 Intentando registro con:", registroData);

                // 3. LLAMADA AL SERVICIO
                const response = await authService.register(registroData);

                // 4. MANEJO DE RESPUESTA
                if (response.success) {
                    console.log("✅ Registro exitoso:", response.data);
                    alert("¡Usuario registrado con éxito! Ahora puedes iniciar sesión.");
                    window.location.href = "/modules/login.html";
                } else {
                    console.error("❌ Registro fallido:", response.error);
                    alert(`Error al registrar: ${response.error}`);
                }

            } catch (error) {
                console.error("❌ Error fatal en el registro:", error);
                alert("Error de conexión. Verifica que el backend esté corriendo.");
            } finally {
                // 5. RESTAURAR UI (Siempre se ejecuta, haya error o no)
                if (spinner) spinner.style.display = "none";
                if (btnText) btnText.textContent = "Crear Cuenta";
                if (registerBtn) registerBtn.disabled = false;
            }
        });
    }

    console.log("🎯 register.js cargado correctamente");
});