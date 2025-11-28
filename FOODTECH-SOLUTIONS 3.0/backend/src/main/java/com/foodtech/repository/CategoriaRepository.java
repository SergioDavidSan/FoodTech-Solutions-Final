package com.foodtech.repository;

import com.foodtech.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    Optional<Categoria> findByNombreCategoria(String nombreCategoria);
    List<Categoria> findByTipo(Categoria.TipoCategoria tipo);
}