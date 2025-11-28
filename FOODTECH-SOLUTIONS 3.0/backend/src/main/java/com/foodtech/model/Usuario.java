package com.foodtech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// (¡IMPORTANTE! Nos aseguramos de que NO implemente UserDetails aquí)
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;
    
    @Column(name = "nombre_usuario", nullable = false, unique = true)
    private String nombreUsuario;
    
    @Column(nullable = false)
    private String contrasena;
    
    @Column(unique = true) // (Añadí 'unique = true' al email, es una buena práctica)
    private String email;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_rol", nullable = false)
    private Role rol;
    
    @Enumerated(EnumType.STRING)
    private EstadoUsuario estado;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "codigo_2fa")
    private String codigo2fa;
    
    @Column(name = "fecha_expiracion_2fa")
    private LocalDateTime fechaExpiracion2fa;
    
    // ENUM para el Estado
    public enum EstadoUsuario {
        activo , 
        inactivo
    }
    
    // Constructores
    public Usuario() {
        this.fechaCreacion = LocalDateTime.now();
        this.estado = EstadoUsuario.activo; // (Valor por defecto)
    }
    
    // Getters y Setters (No quites ninguno)
    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }
    
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Role getRol() { return rol; }
    public void setRol(Role rol) { this.rol = rol; }
    
    public EstadoUsuario getEstado() { return estado; }
    public void setEstado(EstadoUsuario estado) { this.estado = estado; }
    
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public String getCodigo2fa() { return codigo2fa; }
    public void setCodigo2fa(String codigo2fa) { this.codigo2fa = codigo2fa; }
    
    public LocalDateTime getFechaExpiracion2fa() { return fechaExpiracion2fa; }
    public void setFechaExpiracion2fa(LocalDateTime fechaExpiracion2fa) { this.fechaExpiracion2fa = fechaExpiracion2fa; }
}