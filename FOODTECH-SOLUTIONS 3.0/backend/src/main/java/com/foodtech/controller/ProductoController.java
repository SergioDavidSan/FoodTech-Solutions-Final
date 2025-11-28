package com.foodtech.controller;

import com.foodtech.model.Producto;
import com.foodtech.services.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*")
@SuppressWarnings({"java:S6813", "java:S1452"})
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    @GetMapping
    public List<Producto> obtenerTodos() {
        return productoService.obtenerTodos();
    }
    
    @GetMapping("/disponibles")
    public List<Producto> obtenerDisponibles() {
        return productoService.obtenerDisponibles();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Integer id) {
        Optional<Producto> producto = productoService.obtenerPorId(id);
        return producto.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/buscar")
    public List<Producto> buscarPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }
    
    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.guardar(producto);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Integer id, @RequestBody Producto producto) {
        if (!productoService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        producto.setIdProducto(id);
        return ResponseEntity.ok(productoService.guardar(producto));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Integer id) {
        if (!productoService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        productoService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}