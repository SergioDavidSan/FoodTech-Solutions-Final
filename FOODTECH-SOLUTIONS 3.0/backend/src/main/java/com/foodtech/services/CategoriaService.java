package com.foodtech.services;

import com.foodtech.model.Categoria;
import com.foodtech.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("java:S6813")
public class CategoriaService {
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }
    
    public Optional<Categoria> obtenerPorId(Integer id) {
        return categoriaRepository.findById(id);
    }
    
    public Optional<Categoria> obtenerPorNombre(String nombreCategoria) {
        return categoriaRepository.findByNombreCategoria(nombreCategoria);
    }
    
    public List<Categoria> obtenerPorTipo(Categoria.TipoCategoria tipo) {
        return categoriaRepository.findByTipo(tipo);
    }
    
    public Categoria guardar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }
    
    public void eliminar(Integer id) {
        categoriaRepository.deleteById(id);
    }
}