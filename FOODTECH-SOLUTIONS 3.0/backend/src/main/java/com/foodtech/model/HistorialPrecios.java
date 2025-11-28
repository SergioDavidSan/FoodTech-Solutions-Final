package com.foodtech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_precios")
public class HistorialPrecios {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHistorialPrecio;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;
    
    @Column(name = "precio_anterior", precision = 10, scale = 2)
    private BigDecimal precioAnterior;
    
    @Column(name = "precio_nuevo", precision = 10, scale = 2)
    private BigDecimal precioNuevo;
    
    @Column(name = "fecha_cambio")
    private LocalDateTime fechaCambio;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario_cambio", nullable = false)
    private Usuario usuarioCambio;
    
    private String motivo;
    
    // Constructores
    public HistorialPrecios() {
        this.fechaCambio = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getIdHistorialPrecio() { return idHistorialPrecio; }
    public void setIdHistorialPrecio(Integer idHistorialPrecio) { this.idHistorialPrecio = idHistorialPrecio; }
    
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    
    public BigDecimal getPrecioAnterior() { return precioAnterior; }
    public void setPrecioAnterior(BigDecimal precioAnterior) { this.precioAnterior = precioAnterior; }
    
    public BigDecimal getPrecioNuevo() { return precioNuevo; }
    public void setPrecioNuevo(BigDecimal precioNuevo) { this.precioNuevo = precioNuevo; }
    
    public LocalDateTime getFechaCambio() { return fechaCambio; }
    public void setFechaCambio(LocalDateTime fechaCambio) { this.fechaCambio = fechaCambio; }
    
    public Usuario getUsuarioCambio() { return usuarioCambio; }
    public void setUsuarioCambio(Usuario usuarioCambio) { this.usuarioCambio = usuarioCambio; }
    
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}