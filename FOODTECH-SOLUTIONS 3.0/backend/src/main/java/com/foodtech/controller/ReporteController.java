package com.foodtech.controller;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foodtech.services.ReporteService;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
@SuppressWarnings({ "java:S6813", "java:S1452" })
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    // ============================
    // 🔹 Reporte por rango de fechas
    // ============================
    @GetMapping("/ventas")
    public ResponseEntity<?> generarReporteVentas(
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin) {

        LocalDate inicio;
        LocalDate fin;

        try {
            inicio = (fechaInicio != null && !fechaInicio.isBlank())
                    ? LocalDate.parse(fechaInicio)
                    : LocalDate.now().minusDays(30);

            fin = (fechaFin != null && !fechaFin.isBlank())
                    ? LocalDate.parse(fechaFin)
                    : LocalDate.now();

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Formato de fecha inválido. Usa YYYY-MM-DD"));
        }

        if (inicio.isAfter(fin)) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "La fecha de inicio no puede ser mayor que la fecha final."));
        }

        Map<String, Object> reporte = reporteService.generarReporteVentas(inicio, fin);
        return ResponseEntity.ok(reporte);
    }

    // ============================
    // 🔹 Estadísticas diarias simples
    // ============================
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasDiarias() {
        Map<String, Object> estadisticas = reporteService.obtenerEstadisticasDiarias();
        return ResponseEntity.ok(estadisticas);
    }

    // ============================
    // 🔹 Métricas del día (dashboard)
    // ============================
    @GetMapping("/metricas-dia")
    public ResponseEntity<?> obtenerMetricasDia() {
        Map<String, Object> metricas = reporteService.obtenerMetricasDelDia();
        return ResponseEntity.ok(metricas);
    }
}
