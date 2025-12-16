package com.foodtech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categorias")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer idCategoria;
    
    @Column(name = "nombre_categoria", nullable = false)
    private String nombreCategoria;
    
    @Column(name = "descripcion") // Aseguramos el nombre de la columna
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_categoria") // Asegúrate de que esta columna exista en tu DB
    private TipoCategoria tipo;
    
    // --- SOLUCIÓN: Usamos minúsculas para coincidir con la Base de Datos ---
    public enum TipoCategoria {
        comida, 
        bebida, 
        insumo,
        postre,   // Añadí postre y entrada por si acaso
        entrada
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