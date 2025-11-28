package com.foodtech.controller;

import com.foodtech.model.Factura;
import com.foodtech.services.FacturaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/facturas")
@CrossOrigin(origins = "*")
@SuppressWarnings({"java:S6813", "java:S1452"})
public class FacturaController {
    
    @Autowired
    private FacturaService facturaService;
    
    @GetMapping
    public List<Factura> obtenerTodas() {
        return facturaService.obtenerTodas();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Factura> obtenerPorId(@PathVariable Integer id) {
        Optional<Factura> factura = facturaService.obtenerPorId(id);
        return factura.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/numero/{numeroFactura}")
    public ResponseEntity<Factura> obtenerPorNumero(@PathVariable String numeroFactura) {
        Optional<Factura> factura = facturaService.obtenerPorNumero(numeroFactura);
        return factura.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/pedido/{idPedido}")
    public ResponseEntity<Factura> obtenerPorPedido(@PathVariable Integer idPedido) {
        Optional<Factura> factura = facturaService.obtenerPorPedido(idPedido);
        return factura.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/cajero/{idCajero}")
    public List<Factura> obtenerPorCajero(@PathVariable Integer idCajero) {
        return facturaService.obtenerPorCajero(idCajero);
    }
    
    @PostMapping
    public Factura crearFactura(@RequestBody Factura factura) {
        return facturaService.guardar(factura);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Factura> actualizarFactura(@PathVariable Integer id, @RequestBody Factura factura) {
        if (!facturaService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        factura.setIdFactura(id);
        return ResponseEntity.ok(facturaService.guardar(factura));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarFactura(@PathVariable Integer id) {
        if (!facturaService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        facturaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}