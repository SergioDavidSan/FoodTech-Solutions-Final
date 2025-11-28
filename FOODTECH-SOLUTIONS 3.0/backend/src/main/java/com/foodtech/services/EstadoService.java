package com.foodtech.services;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@SuppressWarnings("java:S6813")
public class EstadoService {
    
    public Map<String, String> obtenerEstadosPedido() {
        Map<String, String> estados = new HashMap<>();
        estados.put("PENDIENTE", "Pedido recibido, esperando preparación");
        estados.put("EN_PREPARACION", "En proceso de preparación en cocina");
        estados.put("LISTO", "Pedido listo para servir");
        estados.put("ENTREGADO", "Pedido entregado al cliente");
        estados.put("FACTURADO", "Pedido facturado y pagado");
        estados.put("CANCELADO", "Pedido cancelado");
        return estados;
    }
    
    public Map<String, String> obtenerEstadosMesa() {
        Map<String, String> estados = new HashMap<>();
        estados.put("DISPONIBLE", "Mesa disponible para clientes");
        estados.put("OCUPADA", "Mesa ocupada por clientes");
        estados.put("RESERVADA", "Mesa reservada para futuro");
        estados.put("MANTENIMIENTO", "Mesa en mantenimiento/limpieza");
        return estados;
    }
    
    public Map<String, String> obtenerEstadosUsuario() {
        Map<String, String> estados = new HashMap<>();
        estados.put("ACTIVO", "Usuario activo en el sistema");
        estados.put("INACTIVO", "Usuario inactivo temporalmente");
        estados.put("SUSPENDIDO", "Usuario suspendido por administración");
        return estados;
    }
    
    public Map<String, String> obtenerRolesUsuario() {
        Map<String, String> roles = new HashMap<>();
        roles.put("ADMIN", "Administrador del sistema");
        roles.put("MESERO", "Personal de servicio en mesas");
        roles.put("COCINERO", "Personal de cocina");
        roles.put("CAJERO", "Personal de caja y facturación");
        roles.put("CLIENTE", "Cliente del restaurante");
        return roles;
    }
}