package com.foodtech.controller;

import com.foodtech.model.Pedido;
import com.foodtech.services.PedidoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
@SuppressWarnings({"java:S6813", "java:S1452"})
public class PedidoController {
    
    @Autowired
    private PedidoService pedidoService;
    
    @GetMapping
    public List<Pedido> obtenerTodos() {
        return pedidoService.obtenerTodos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoService.obtenerPorId(id);
        return pedido.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/estado/{estado}")
    public List<Pedido> obtenerPorEstado(@PathVariable Pedido.EstadoPedido estado) {
        return pedidoService.obtenerPorEstado(estado);
    }
    
    @GetMapping("/mesero/{idMesero}")
    public List<Pedido> obtenerPorMesero(@PathVariable Integer idMesero) {
        return pedidoService.obtenerPorMesero(idMesero);
    }
    
    @GetMapping("/mesa/{idMesa}")
    public List<Pedido> obtenerPorMesa(@PathVariable Integer idMesa) {
        return pedidoService.obtenerPorMesa(idMesa);
    }
    
    @GetMapping("/cocina")
    public List<Pedido> obtenerParaCocina() {
        return pedidoService.obtenerParaCocina();
    }
    
    @GetMapping("/facturar")
    public List<Pedido> obtenerParaFacturar() {
        return pedidoService.obtenerParaFacturar();
    }
    
    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        return pedidoService.guardar(pedido);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Pedido> actualizarPedido(@PathVariable Integer id, @RequestBody Pedido pedido) {
        if (!pedidoService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        pedido.setIdPedido(id);
        return ResponseEntity.ok(pedidoService.guardar(pedido));
    }
    
    @PutMapping("/{id}/estado/{estado}")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Integer id, @PathVariable Pedido.EstadoPedido estado) {
        Optional<Pedido> pedidoOpt = pedidoService.obtenerPorId(id);
        if (!pedidoOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Pedido pedido = pedidoOpt.get();
        pedido.setEstado(estado);
        return ResponseEntity.ok(pedidoService.guardar(pedido));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Integer id) {
        if (!pedidoService.obtenerPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        pedidoService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
