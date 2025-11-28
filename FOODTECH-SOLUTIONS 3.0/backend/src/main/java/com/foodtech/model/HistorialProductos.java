package com.foodtech.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_productos")
public class HistorialProductos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idHistorialProducto;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;
    
    @Column(name = "campo_modificado", nullable = false)
    private String campoModificado;
    
    @Column(name = "valor_anterior")
    private String valorAnterior;
    
    @Column(name = "valor_nuevo")
    private String valorNuevo;
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario_modificacion", nullable = false)
    private Usuario usuarioModificacion;
    
    // Constructores
    public HistorialProductos() {
        this.fechaModificacion = LocalDateTime.now();
    }
    
    // Getters y Setters
    public Integer getIdHistorialProducto() { return idHistorialProducto; }
    public void setIdHistorialProducto(Integer idHistorialProducto) { this.idHistorialProducto = idHistorialProducto; }
    
    public Producto getProducto() { return producto; }
    public void setProducto(Producto producto) { this.producto = producto; }
    
    public String getCampoModificado() { return campoModificado; }
    public void setCampoModificado(String campoModificado) { this.campoModificado = campoModificado; }
    
    public String getValorAnterior() { return valorAnterior; }
    public void setValorAnterior(String valorAnterior) { this.valorAnterior = valorAnterior; }
    
    public String getValorNuevo() { return valorNuevo; }
    public void setValorNuevo(String valorNuevo) { this.valorNuevo = valorNuevo; }
    
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
    
    public Usuario getUsuarioModificacion() { return usuarioModificacion; }
    public void setUsuarioModificacion(Usuario usuarioModificacion) { this.usuarioModificacion = usuarioModificacion; }
}