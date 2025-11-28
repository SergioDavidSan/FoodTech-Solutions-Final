package com.foodtech.repository;

import com.foodtech.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    Optional<Inventario> findByNombreProducto(String nombreProducto);
    List<Inventario> findByCategoriaIdCategoria(Integer idCategoria);
    List<Inventario> findByCantidadLessThanEqual(Object stockMinimo);
}