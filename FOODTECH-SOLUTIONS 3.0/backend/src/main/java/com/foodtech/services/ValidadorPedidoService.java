package com.foodtech.services;

import org.springframework.stereotype.Service;

import com.foodtech.model.Mesa;
import com.foodtech.model.Pedido;
import com.foodtech.model.Usuario;

@Service
@SuppressWarnings({"java:S6813", "java:S112"})
public class ValidadorPedidoService {
    
    public void validarCreacionPedido(Usuario mesero, Mesa mesa) {
        // El mesero debe estar activo
        if (!mesero.getEstado().equals(Usuario.EstadoUsuario.activo)) {
            throw new RuntimeException("El mesero no está activo");
        }
        
        // La mesa debe estar disponible
        if (!mesa.getEstado().equals(Mesa.EstadoMesa.DISPONIBLE)) {
            throw new RuntimeException("La mesa no está disponible");
        }
        
        // El mesero debe tener el rol correcto
        if (!mesero.getRol().getNombreRol().equals("MESERO")) {
            throw new RuntimeException("El usuario no tiene permisos de mesero");
        }
    }
    
    public void validarFacturacion(Usuario cajero, Pedido pedido) {
        if (!cajero.getRol().getNombreRol().equals("CAJERO")) {
            throw new RuntimeException("El usuario no tiene permisos de cajero");
        }
        
        if (!pedido.getEstado().equals(Pedido.EstadoPedido.LISTO)) {
            throw new RuntimeException("El pedido no está listo para facturar");
        }
    }
}