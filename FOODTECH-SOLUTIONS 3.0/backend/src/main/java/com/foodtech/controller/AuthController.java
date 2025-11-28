package com.foodtech.controller;

import com.foodtech.model.Role; 
import com.foodtech.model.Usuario; 
import com.foodtech.model.Usuario.EstadoUsuario; 
import com.foodtech.repository.RoleRepository;
import com.foodtech.services.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;

// --- 1. IMPORTACIONES AÑADIDAS ---
import com.foodtech.security.JwtUtil; // Para crear el token
import org.springframework.security.core.userdetails.UserDetails; // Para crear el token
import com.foodtech.services.UsuarioDetailsService; // Para buscar el usuario
// --- FIN DE IMPORTACIONES ---

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
// (Asegúrate de que tu puerto 5501 o 5500 esté en la lista)
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500", "http://127.0.0.1:5501", "http://127.0.0.1:63476"}) 
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository; 
    
    // --- 2. SERVICIOS AÑADIDOS PARA EL TOKEN ---
    private final JwtUtil jwtUtil;
    private final UsuarioDetailsService usuarioDetailsService;

    // --- 3. CONSTRUCTOR ACTUALIZADO ---
    public AuthController(AuthenticationManager authenticationManager, 
                          UsuarioService usuarioService, 
                          PasswordEncoder passwordEncoder,
                          RoleRepository roleRepository,
                          JwtUtil jwtUtil, // <-- Añadido
                          UsuarioDetailsService usuarioDetailsService) { // <-- Añadido
        this.authenticationManager = authenticationManager;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository; 
        this.jwtUtil = jwtUtil; // <-- Añadido
        this.usuarioDetailsService = usuarioDetailsService; // <-- Añadido
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // (Autenticación - esto funciona)
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );
            User user = (User) authentication.getPrincipal();
            String role = user.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("USER")
                .replace("ROLE_", "");
            
            // --- 4. CREAR TOKEN REAL (LA CORRECCIÓN) ---
            // Buscamos los detalles del usuario para pasárselos al generador de token
            final UserDetails userDetails = usuarioDetailsService.loadUserByUsername(loginRequest.getUsername());
            // Generamos el token real
            final String token = jwtUtil.generateToken(userDetails);
            // --- FIN DE LA CORRECCIÓN ---
            
            return ResponseEntity.ok(Map.of(
                "token", token, // <-- Ahora es un token real
                "username", user.getUsername(),
                "role", role.toLowerCase(),
                "message", "Login exitoso"
            ));
            
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Credenciales inválidas",
                "message", "Usuario o contraseña incorrectos"
            ));
        }
    }

    // --- MÉTODO DE REGISTRO (SIN CAMBIOS) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistroRequest registroRequest) {
        
        System.out.println("=========================================");
        System.out.println("AUTH_CONTROLLER: ¡Petición de registro RECIBIDA!");
        System.out.println("Usuario: " + registroRequest.getNombreUsuario());
        System.out.println("=========================================");

        try {
            // --- VALIDACIÓN ---
            if (usuarioService.existePorNombreUsuario(registroRequest.getNombreUsuario())) {
                return ResponseEntity.status(400).body(Map.of("message", "Error: El nombre de usuario ya existe."));
            }
            if (usuarioService.existePorEmail(registroRequest.getEmail())) {
                return ResponseEntity.status(400).body(Map.of("message", "Error: El email ya está registrado."));
            }
            
            // --- BUSCAR EL ROL ---
            String nombreRolBuscado = registroRequest.getRol().toUpperCase(); 
            
            Role rolObjeto = roleRepository.findByNombreRol(nombreRolBuscado) 
                .orElseThrow(() -> new RuntimeException("Error: El Rol '" + nombreRolBuscado + "' no se encontró en la base de datos."));

            // --- CREACIÓN DE USUARIO ---
            Usuario nuevoUsuario = new Usuario();
            nuevoUsuario.setNombreUsuario(registroRequest.getNombreUsuario());
            nuevoUsuario.setEmail(registroRequest.getEmail());
            nuevoUsuario.setContrasena(passwordEncoder.encode(registroRequest.getContrasena()));
            nuevoUsuario.setEstado(EstadoUsuario.activo); 
            nuevoUsuario.setRol(rolObjeto); 
            
            Usuario usuarioGuardado = usuarioService.guardar(nuevoUsuario);

            return ResponseEntity.ok(Map.of(
                "idUsuario", usuarioGuardado.getIdUsuario(),
                "username", usuarioGuardado.getNombreUsuario(),
                "message", "Usuario registrado exitosamente"
            ));

        } catch (Exception e) {
            System.err.println("Error en /register: " + e.getMessage());
            return ResponseEntity.status(400).body(Map.of(
                "error", "Error en el registro",
                "message", e.getMessage() 
            ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "service", "FoodTech Auth Service",
            "timestamp", System.currentTimeMillis()
        ));
    }
}

// --- CLASES DTO (Sin cambios) ---
class LoginRequest {
    private String username;
    private String password;
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class RegistroRequest {
    private String nombreUsuario;
    private String contrasena;
    private String email;
    private String rol;
    
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}