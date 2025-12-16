package com.foodtech.model;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_items")
public class Plato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id") // Mapea a la columna 'id' de la DB
    private Long idPlato; // Clave primaria

    @Column(name = "nombre") // Mapea a la columna 'nombre' de la DB
    private String nombreProducto;
    
    private double precio;
    private String descripcion;
    
    @Column(name = "ingredientes_texto") // Mapeo explícito a snake_case
    private String ingredientesTexto;

    @Column(name = "imagen_url") // Mapeo explícito
    private String imagenUrl;
    
    private boolean disponible = true; // <<-- ¡CORRECCIÓN CLAVE! Inicialización a TRUE por defecto

    // Opcional: Relación con Categoría (Si usas esta parte)
   // En Plato.java
        @ManyToOne
        @JoinColumn(name = "id_categoria", nullable = true) // <<-- ¡AÑADE nullable = true!
        private Categoria categoria;
    // ===============================================
    // CONSTRUCTORES
    // ===============================================
    
    public Plato() {
    }

    public Plato(String nombreProducto, double precio, String descripcion, String ingredientesTexto, String imagenUrl, boolean disponible, Categoria categoria) {
        this.nombreProducto = nombreProducto;
        this.precio = precio;
        this.descripcion = descripcion;
        this.ingredientesTexto = ingredientesTexto;
        this.imagenUrl = imagenUrl;
        this.disponible = disponible;
        this.categoria = categoria;
    }

    // ===============================================
    // GETTERS Y SETTERS
    // ===============================================

    public Long getIdPlato() {
        return idPlato;
    }

    public void setIdPlato(Long idPlato) {
        this.idPlato = idPlato;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getIngredientesTexto() {
        return ingredientesTexto;
    }

    public void setIngredientesTexto(String ingredientesTexto) {
        this.ingredientesTexto = ingredientesTexto;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}