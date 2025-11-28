package com.foodtech.repository;

import com.foodtech.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Integer> {
    Optional<Mesa> findByNumeroMesa(Integer numeroMesa);
    List<Mesa> findByEstado(Mesa.EstadoMesa estado);
    boolean existsByNumeroMesa(Integer numeroMesa);
}