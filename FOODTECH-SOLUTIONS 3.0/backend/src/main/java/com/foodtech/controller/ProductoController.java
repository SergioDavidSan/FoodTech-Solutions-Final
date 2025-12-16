package com.foodtech.controller;

import com.foodtech.model.Categoria; // Importar Modelo Categoria
import com.foodtech.model.Producto;
import com.foodtech.repository.CategoriaRepository; // Importar Repo Categoria
import com.foodtech.services.ProductoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos") // ✅ CORREGIDO: Agregado '/api' para coincidir con el frontend
@CrossOrigin(origins = "*")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;

    // --- INYECCIÓN AÑADIDA ---
    @Autowired
    private CategoriaRepository categoriaRepository;
    
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
    
    // --- MÉTODO POST CORREGIDO (SOLUCIÓN ERROR 500) ---
    @PostMapping
    public ResponseEntity<?> crearProducto(@RequestBody Producto producto) {
        try {
            // 1. Validar y Vincular la Categoría Existente
            if (producto.getCategoria() != null) {
                // Asumimos que el objeto Categoria viene solo con el ID (ej: {idCategoria: 1})
                // Debemos buscar el objeto completo en la BD para que Hibernate no se confunda
                
                // NOTA: Si en tu clase Categoria el ID se llama 'getId()', cambia 'getIdCategoria()' abajo
                Integer idCat = producto.getCategoria().getIdCategoria(); 
                
                if (idCat != null) {
                    Categoria categoriaReal = categoriaRepository.findById(idCat)
                        .orElseThrow(() -> new RuntimeException("Error: La categoría con ID " + idCat + " no existe."));
                    
                    // Asignamos la categoría real encontrada en la BD
                    producto.setCategoria(categoriaReal);
                }
            }

            // 2. Guardar el Producto
            Producto nuevoProducto = productoService.guardar(producto);
            return ResponseEntity.ok(nuevoProducto);

        } catch (Exception e) {
            e.printStackTrace(); // Muestra el error exacto en la consola de VS Code
            return ResponseEntity.internalServerError().body("Error al guardar producto: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable Integer id, @RequestBody Producto producto) {
        if (!productoService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        producto.setIdProducto(id);
        
        // (Opcional: Aquí también deberías buscar la categoría si permites cambiarla)
        
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