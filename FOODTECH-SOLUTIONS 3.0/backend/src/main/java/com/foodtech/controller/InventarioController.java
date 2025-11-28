package com.foodtech.controller;

import com.foodtech.model.Inventario;
import com.foodtech.services.InventarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/inventario")
@CrossOrigin(origins = "*")
@SuppressWarnings({"java:S6813", "java:S1452"})
public class InventarioController {
    
    @Autowired
    private InventarioService inventarioService;
    
    @GetMapping
    public List<Inventario> obtenerTodo() {
        return inventarioService.obtenerTodo();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Inventario> obtenerPorId(@PathVariable Integer id) {
        Optional<Inventario> inventario = inventarioService.obtenerPorId(id);
        return inventario.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/categoria/{idCategoria}")
    public List<Inventario> obtenerPorCategoria(@PathVariable Integer idCategoria) {
        return inventarioService.obtenerPorCategoria(idCategoria);
    }
    
    @GetMapping("/stock-bajo")
    public List<Inventario> obtenerStockBajo() {
        return inventarioService.obtenerStockBajo();
    }
    
    @PostMapping
    public Inventario crearInventario(@RequestBody Inventario inventario) {
        return inventarioService.guardar(inventario);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizarInventario(@PathVariable Integer id, @RequestBody Inventario inventario) {
        if (!inventarioService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        inventario.setIdInventario(id);
        return ResponseEntity.ok(inventarioService.guardar(inventario));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarInventario(@PathVariable Integer id) {
        if (!inventarioService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        inventarioService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}