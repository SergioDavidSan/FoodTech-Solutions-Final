package com.foodtech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCliente;
    
    @Column(nullable = false)
    private String nombre;
    
    private String telefono;
    
    private String email;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;
    
    // Constructores
    public Cliente() {
        this.fechaRegistro = LocalDateTime.now();
    }
    
    public Cliente(String nombre, String telefono, String email) {
        this();
        this.nombre = nombre;
        this.telefono = telefono;
        this.email = email;
    }
    
    // Getters y Setters
    public Integer getIdCliente() { return idCliente; }
    public void setIdCliente(Integer idCliente) { this.idCliente = idCliente; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}