package com.foodtech.services;

import com.foodtech.model.Pedido;
import com.foodtech.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("java:S6813")
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }
    
    public Optional<Pedido> obtenerPorId(Integer id) {
        return pedidoRepository.findById(id);
    }
    
    public List<Pedido> obtenerPorEstado(Pedido.EstadoPedido estado) {
        return pedidoRepository.findByEstado(estado);
    }
    
    public List<Pedido> obtenerPorMesa(Integer idMesa) {
        return pedidoRepository.findByMesaIdMesa(idMesa);
    }
    
    public List<Pedido> obtenerPorMesero(Integer idMesero) {
        return pedidoRepository.findByMeseroIdUsuario(idMesero);
    }
    
    public List<Pedido> obtenerParaCocina() {
        return pedidoRepository.findByEstadoIn(Arrays.asList(Pedido.EstadoPedido.PENDIENTE, Pedido.EstadoPedido.EN_PREPARACION));
    }
    
    public List<Pedido> obtenerParaFacturar() {
        return pedidoRepository.findByEstado(Pedido.EstadoPedido.LISTO);
    }
    
    public Pedido guardar(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }
    
    public void eliminar(Integer id) {
        pedidoRepository.deleteById(id);
    }
}