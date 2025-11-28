package com.foodtech.repository;

import com.foodtech.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {
    List<DetallePedido> findByPedidoIdPedido(Integer idPedido);
    List<DetallePedido> findByProductoIdProducto(Integer idProducto);
}