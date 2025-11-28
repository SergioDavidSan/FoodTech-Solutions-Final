package com.foodtech.repository;

import com.foodtech.model.HistorialPrecios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialPreciosRepository extends JpaRepository<HistorialPrecios, Integer> {
    List<HistorialPrecios> findByProductoIdProducto(Integer idProducto);
    List<HistorialPrecios> findByUsuarioCambioIdUsuario(Integer idUsuario);
}