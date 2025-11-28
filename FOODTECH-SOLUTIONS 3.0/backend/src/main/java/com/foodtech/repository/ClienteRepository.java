package com.foodtech.repository;

import com.foodtech.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByEmail(String email);
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
    boolean existsByEmail(String email);
}