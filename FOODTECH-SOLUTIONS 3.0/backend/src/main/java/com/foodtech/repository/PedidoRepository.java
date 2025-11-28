package com.foodtech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.foodtech.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    
    List<Pedido> findByEstado(Pedido.EstadoPedido estado);
    
    List<Pedido> findByMeseroIdUsuario(Integer idMesero);
    
    List<Pedido> findByMesaIdMesa(Integer idMesa);
    
    List<Pedido> findByEstadoIn(List<Pedido.EstadoPedido> estados);
}