package com.foodtech.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "facturas")
public class Factura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFactura;
    
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_pedido", nullable = false, unique = true)
    private Pedido pedido;
    
    @Column(name = "numero_factura", nullable = false, unique = true)
    private String numeroFactura;
    
    @Column(name = "fecha_emision")
    private LocalDateTime fechaEmision;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cajero", nullable = false)
    private Usuario cajero;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal impuestos;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal descuentos;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal total;
    
    @Enumerated(EnumType.STRING)
    private MetodoPago metodoPago;
    
    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago;
    
    public enum MetodoPago {
        EFECTIVO, TARJETA, TRANSFERENCIA, MIXTO
    }
    
    public enum EstadoPago {
        PENDIENTE, PAGADO, CANCELADO
    }
    
    // Constructores
    public Factura() {
        this.fechaEmision = LocalDateTime.now();
        this.subtotal = BigDecimal.ZERO;
        this.impuestos = BigDecimal.ZERO;
        this.descuentos = BigDecimal.ZERO;
        this.total = BigDecimal.ZERO;
        this.estadoPago = EstadoPago.PENDIENTE;
    }
    
    // Getters y Setters
    public Integer getIdFactura() { return idFactura; }
    public void setIdFactura(Integer idFactura) { this.idFactura = idFactura; }
    
    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }
    
    public String getNumeroFactura() { return numeroFactura; }
    public void setNumeroFactura(String numeroFactura) { this.numeroFactura = numeroFactura; }
    
    public LocalDateTime getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDateTime fechaEmision) { this.fechaEmision = fechaEmision; }
    
    public Usuario getCajero() { return cajero; }
    public void setCajero(Usuario cajero) { this.cajero = cajero; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public BigDecimal getImpuestos() { return impuestos; }
    public void setImpuestos(BigDecimal impuestos) { this.impuestos = impuestos; }
    
    public BigDecimal getDescuentos() { return descuentos; }
    public void setDescuentos(BigDecimal descuentos) { this.descuentos = descuentos; }
    
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    
    public MetodoPago getMetodoPago() { return metodoPago; }
    public void setMetodoPago(MetodoPago metodoPago) { this.metodoPago = metodoPago; }
    
    public EstadoPago getEstadoPago() { return estadoPago; }
    public void setEstadoPago(EstadoPago estadoPago) { this.estadoPago = estadoPago; }
}