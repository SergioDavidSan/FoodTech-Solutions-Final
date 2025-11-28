package com.foodtech.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodtech.model.Inventario;
import com.foodtech.repository.InventarioRepository;

@Service
@SuppressWarnings("java:S6813")
public class InventarioService {
    
    @Autowired
    private InventarioRepository inventarioRepository;
    
    public List<Inventario> obtenerTodo() {
        return inventarioRepository.findAll();
    }
    
    public Optional<Inventario> obtenerPorId(Integer id) {
        return inventarioRepository.findById(id);
    }
    
    public Optional<Inventario> obtenerPorNombre(String nombreProducto) {
        return inventarioRepository.findByNombreProducto(nombreProducto);
    }
    
    public List<Inventario> obtenerPorCategoria(Integer idCategoria) {
        return inventarioRepository.findByCategoriaIdCategoria(idCategoria);
    }
    
    public List<Inventario> obtenerStockBajo() {
        // Nota: Esta consulta puede necesitar ajustes según la lógica específica
        return inventarioRepository.findAll();
    }
    
    public Inventario guardar(Inventario inventario) {
        return inventarioRepository.save(inventario);
    }
    
    public void eliminar(Integer id) {
        inventarioRepository.deleteById(id);
    }
}