package com.foodtech.repository;

import com.foodtech.model.Plato;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlatoRepository extends JpaRepository<Plato, Long> {
    // Método para obtener solo los platos disponibles, si aplica.
    List<Plato> findByDisponibleTrue();
}