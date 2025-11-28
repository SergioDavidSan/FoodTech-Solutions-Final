package com.foodtech.controller;

import com.foodtech.model.Cliente;
import com.foodtech.services.ClienteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clientes")
@CrossOrigin(origins = "*")
@SuppressWarnings({"java:S6813", "java:S1452"})
public class ClienteController {
    
    @Autowired
    private ClienteService clienteService;
    
    @GetMapping
    public List<Cliente> obtenerTodos() {
        return clienteService.obtenerTodos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerPorId(@PathVariable Integer id) {
        Optional<Cliente> cliente = clienteService.obtenerPorId(id);
        return cliente.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/buscar")
    public List<Cliente> buscarPorNombre(@RequestParam String nombre) {
        return clienteService.buscarPorNombre(nombre);
    }
    
    @PostMapping
    public Cliente crearCliente(@RequestBody Cliente cliente) {
        return clienteService.guardar(cliente);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Integer id, @RequestBody Cliente cliente) {
        if (!clienteService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cliente.setIdCliente(id);
        return ResponseEntity.ok(clienteService.guardar(cliente));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Integer id) {
        if (!clienteService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        clienteService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}