package com.foodtech.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodtech.model.Mesa;
import com.foodtech.services.MesaService;

@RestController
@RequestMapping("/mesas")
@CrossOrigin(origins = "*")
@SuppressWarnings({"java:S6813", "java:S1452"})
public class MesaController {
    
    @Autowired
    private MesaService mesaService;
    
    @GetMapping
    public List<Mesa> obtenerTodas() {
        return mesaService.obtenerTodas();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Mesa> obtenerPorId(@PathVariable Integer id) {
        Optional<Mesa> mesa = mesaService.obtenerPorId(id);
        return mesa.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado/{estado}")
    public List<Mesa> obtenerPorEstado(@PathVariable Mesa.EstadoMesa estado) {
        return mesaService.obtenerPorEstado(estado);
    }
    
    @PostMapping
    public Mesa crearMesa(@RequestBody Mesa mesa) {
        return mesaService.guardar(mesa);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Mesa> actualizarMesa(@PathVariable Integer id, @RequestBody Mesa mesa) {
        if (!mesaService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        mesa.setIdMesa(id);
        return ResponseEntity.ok(mesaService.guardar(mesa));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMesa(@PathVariable Integer id) {
        if (!mesaService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        mesaService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}