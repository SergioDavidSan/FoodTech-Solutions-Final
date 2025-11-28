package com.foodtech.repository;

import com.foodtech.model.HistorialProductos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialProductosRepository extends JpaRepository<HistorialProductos, Integer> {
    List<HistorialProductos> findByProductoIdProducto(Integer idProducto);
    List<HistorialProductos> findByUsuarioModificacionIdUsuario(Integer idUsuario);
}