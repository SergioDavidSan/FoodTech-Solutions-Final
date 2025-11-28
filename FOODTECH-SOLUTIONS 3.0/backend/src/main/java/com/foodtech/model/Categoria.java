package com.foodtech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategoria;
    
    @Column(name = "nombre_categoria", nullable = false)
    private String nombreCategoria;
    
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    private TipoCategoria tipo;
    
    public enum TipoCategoria {
        COMIDA, BEBIDA, INSUMO
    }
    
    // Constructores
    public Categoria() {}
    
    public Categoria(String nombreCategoria, String descripcion, TipoCategoria tipo) {
        this.nombreCategoria = nombreCategoria;
        this.descripcion = descripcion;
        this.tipo = tipo;
    }
    
    // Getters y Setters
    public Integer getIdCategoria() { return idCategoria; }
    public void setIdCategoria(Integer idCategoria) { this.idCategoria = idCategoria; }
    
    public String getNombreCategoria() { return nombreCategoria; }
    public void setNombreCategoria(String nombreCategoria) { this.nombreCategoria = nombreCategoria; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public TipoCategoria getTipo() { return tipo; }
    public void setTipo(TipoCategoria tipo) { this.tipo = tipo; }
}