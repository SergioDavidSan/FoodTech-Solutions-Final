package com.foodtech.services;

import com.foodtech.model.Producto;
import com.foodtech.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("java:S6813")
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> obtenerTodos() {
        return productoRepository.findAll();
    }
    
    public List<Producto> obtenerDisponibles() {
        return productoRepository.findByDisponibleTrue();
    }
    
    public Optional<Producto> obtenerPorId(Integer id) {
        return productoRepository.findById(id);
    }
    
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreProductoContainingIgnoreCase(nombre);
    }
    
    public List<Producto> obtenerPorCategoria(Integer idCategoria) {
        return productoRepository.findByCategoriaIdCategoria(idCategoria);
    }
    
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public void eliminar(Integer id) {
        productoRepository.deleteById(id);
    }
}