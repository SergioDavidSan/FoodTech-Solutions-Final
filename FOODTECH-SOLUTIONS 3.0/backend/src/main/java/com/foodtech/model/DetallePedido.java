package com.foodtech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalles_pedido")
public class DetallePedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idDetalle;
    
    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;
    
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;
    
    private Integer cantidad;
    
    private String notas;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal precioUnitario;
    
    // Getters y Setters
    public Integer getIdDetalle() { return idDetalle; }
    public void setIdDetalle(Integer idDetalle) { this.idDetalle = idDetalle; }
    
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    
    public BigDecimal getSubtotal() {
        return precioUnitario.multiply(BigDecimal.valueOf(cantidad));
    }
}