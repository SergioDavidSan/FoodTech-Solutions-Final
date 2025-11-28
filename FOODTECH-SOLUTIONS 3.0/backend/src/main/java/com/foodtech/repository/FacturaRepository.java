package com.foodtech.repository;

import com.foodtech.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {
    Optional<Factura> findByNumeroFactura(String numeroFactura);
    Optional<Factura> findByPedidoIdPedido(Integer idPedido);
    List<Factura> findByCajeroIdUsuario(Integer idCajero);
}