package com.foodtech.services;

import com.foodtech.model.Usuario;
import com.foodtech.model.LogAcceso;
import com.foodtech.repository.LogAccesoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import java.time.LocalDateTime;

@Service
@SuppressWarnings({"java:S6813", "java:S1192"})
public class AuditoriaService {
    
    private static final String UNKNOWN_IP = "unknown";
    
    @Autowired
    private LogAccesoRepository logAccesoRepository;
    
    public void registrarAccion(Usuario usuario, String accion, String detalles) {
        LogAcceso log = new LogAcceso();
        log.setUsuario(usuario);
        log.setAccion(accion);
        log.setDetalles("Rol: " + usuario.getRol().getNombreRol() + " - " + detalles);
        log.setFechaHora(LocalDateTime.now());
        log.setIpAddress(obtenerIpUsuario());
        logAccesoRepository.save(log);
    }
    
    private String obtenerIpUsuario() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            var request = attributes.getRequest();
            
            String ipAddress = request.getHeader("X-Forwarded-For");
            if (ipAddress == null || ipAddress.isEmpty() || UNKNOWN_IP.equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.isEmpty() || UNKNOWN_IP.equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getHeader("WL-Proxy-Client-IP");
            }
            if (ipAddress == null || ipAddress.isEmpty() || UNKNOWN_IP.equalsIgnoreCase(ipAddress)) {
                ipAddress = request.getRemoteAddr();
            }
            return ipAddress;
        } catch (IllegalStateException | IllegalArgumentException e) {
            return "127.0.0.1";
        }
    }
}