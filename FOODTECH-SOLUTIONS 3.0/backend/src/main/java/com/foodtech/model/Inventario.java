package com.foodtech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario")
public class Inventario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idInventario;
    
    @Column(name = "nombre_producto", nullable = false)
    private String nombreProducto;
    
    @Column(precision = 10, scale = 3)
    private BigDecimal cantidad;
    
    @Column(name = "unidad_medida", nullable = false)
    private String unidadMedida;
    
    @Column(name = "stock_minimo", precision = 10, scale = 3)
    private BigDecimal stockMinimo;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_categoria")
    private Categoria categoria;
    
    private String proveedor;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    // Constructores
    public Inventario() {
        this.cantidad = BigDecimal.ZERO;
        this.stockMinimo = BigDecimal.ZERO;
        this.fechaActualizacion = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getIdInventario() { return idInventario; }
    public void setIdInventario(Integer idInventario) { this.idInventario = idInventario; }
    
    public String getNombreProducto() { return nombreProducto; }
    public void setNombreProducto(String nombreProducto) { this.nombreProducto = nombreProducto; }
    
    public BigDecimal getCantidad() { return cantidad; }
    public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }
    
    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }
    
    public BigDecimal getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(BigDecimal stockMinimo) { this.stockMinimo = stockMinimo; }
    
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }
    
    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }
    
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}