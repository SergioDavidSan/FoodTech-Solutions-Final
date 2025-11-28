package com.foodtech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mesas")
public class Mesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idMesa;
    
    @Column(name = "numero_mesa", nullable = false, unique = true)
    private Integer numeroMesa;
    
    @Column(nullable = false)
    private Integer capacidad;
    
    @Enumerated(EnumType.STRING)
    private EstadoMesa estado;
    
    private String ubicacion;
    
    public enum EstadoMesa {
        DISPONIBLE, OCUPADA, RESERVADA, MANTENIMIENTO
    }
    
    // Constructores
    public Mesa() {
        this.estado = EstadoMesa.DISPONIBLE;
    }
    
    public Mesa(Integer numeroMesa, Integer capacidad, String ubicacion) {
        this();
        this.numeroMesa = numeroMesa;
        this.capacidad = capacidad;
        this.ubicacion = ubicacion;
    }
    
    // Getters y Setters
    public Integer getIdMesa() { return idMesa; }
    public void setIdMesa(Integer idMesa) { this.idMesa = idMesa; }
    
    public Integer getNumeroMesa() { return numeroMesa; }
    public void setNumeroMesa(Integer numeroMesa) { this.numeroMesa = numeroMesa; }
    
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    
    public EstadoMesa getEstado() { return estado; }
    public void setEstado(EstadoMesa estado) { this.estado = estado; }
    
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
}