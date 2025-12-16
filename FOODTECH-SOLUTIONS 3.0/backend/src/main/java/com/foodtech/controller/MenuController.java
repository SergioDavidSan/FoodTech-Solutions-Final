package com.foodtech.controller;

import com.foodtech.model.Plato;
import com.foodtech.services.PlatoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private PlatoService platoService;

    @GetMapping
    public ResponseEntity<List<Plato>> getMenu() {
        try {
            List<Plato> menuItems = platoService.getMenu();
            return ResponseEntity.ok(menuItems);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(500).body(null); 
        }
    }
    
    // ===========================================
    // IMPLEMENTACIÓN DEL POST PARA GUARDAR (AÑADIENDO VERIFICACIÓN Y LOG)
    // ===========================================
    @PostMapping
    public ResponseEntity<Plato> crearPlato(@RequestBody Plato plato) {
        
        // 1. Verificación de objeto nulo/vacío
        if (plato == null || plato.getNombreProducto() == null || plato.getNombreProducto().isEmpty()) {
            System.err.println("❌ ERROR 400: Objeto Plato recibido nulo o sin Nombre.");
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); // Devuelve 400 al cliente
        }
        
        try {
            // 2. Logging antes de guardar
            System.out.println("✅ Recibido para guardar: " + plato.getNombreProducto() + 
                               ", Precio: " + plato.getPrecio());

            Plato nuevoPlato = platoService.guardarPlato(plato);
            
            // 3. Logging de éxito después de guardar
            System.out.println("✨ Plato guardado con éxito. ID asignado: " + nuevoPlato.getIdPlato());
            
            return new ResponseEntity<>(nuevoPlato, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("🔥 Error interno al guardar el plato:");
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}