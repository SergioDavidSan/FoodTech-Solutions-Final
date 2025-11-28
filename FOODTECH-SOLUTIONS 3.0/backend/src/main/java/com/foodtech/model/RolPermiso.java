package com.foodtech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rol_permisos")
public class RolPermiso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id")
    private Role rol;

    @Column(name = "permiso_nombre", length = 100)
    private String permisoNombre;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Constructores
    public RolPermiso() {}

    public RolPermiso(Role rol, String permisoNombre) {
        this.rol = rol;
        this.permisoNombre = permisoNombre;
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Role getRol() { return rol; }
    public void setRol(Role rol) { this.rol = rol; }

    public String getPermisoNombre() { return permisoNombre; }
    public void setPermisoNombre(String permisoNombre) { this.permisoNombre = permisoNombre; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}