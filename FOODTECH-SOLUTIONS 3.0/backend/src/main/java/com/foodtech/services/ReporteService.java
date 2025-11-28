package com.foodtech.services;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class ReporteService {

    public Map<String, Object> generarReporteVentas(LocalDate fechaInicio, LocalDate fechaFin) {
        Map<String, Object> reporte = new HashMap<>();

        // Ejemplo
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("totalVentas", BigDecimal.valueOf(1500000));
        reporte.put("totalPedidos", 45);
        reporte.put("productoMasVendido", "Chuleta Valluna");

        return reporte;
    }

    public Map<String, Object> obtenerEstadisticasDiarias() {
        Map<String, Object> estadisticas = new HashMap<>();

        estadisticas.put("fecha", LocalDate.now());
        estadisticas.put("ventasHoy", BigDecimal.valueOf(350000));
        estadisticas.put("pedidosHoy", 12);
        estadisticas.put("mesasOcupadas", 8);

        return estadisticas;
    }

    // NUEVO MÉTODO
    public Map<String, Object> obtenerMetricasDelDia() {
        Map<String, Object> metricas = new HashMap<>();

        metricas.put("usuariosActivos", 5);
        metricas.put("ventasHoy", BigDecimal.valueOf(350000));
        metricas.put("pedidosActivos", 8);
        metricas.put("mesasOcupadas", "8/15");

        return metricas;
    }
}
