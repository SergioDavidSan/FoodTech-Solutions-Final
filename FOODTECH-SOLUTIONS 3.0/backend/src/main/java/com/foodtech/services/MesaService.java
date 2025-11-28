package com.foodtech.services;

import com.foodtech.model.Mesa;
import com.foodtech.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("java:S6813")
public class MesaService {
    
    @Autowired
    private MesaRepository mesaRepository;
    
    public List<Mesa> obtenerTodas() {
        return mesaRepository.findAll();
    }
    
    public Optional<Mesa> obtenerPorId(Integer id) {
        return mesaRepository.findById(id);
    }
    
    public Optional<Mesa> obtenerPorNumero(Integer numeroMesa) {
        return mesaRepository.findByNumeroMesa(numeroMesa);
    }
    
    public List<Mesa> obtenerPorEstado(Mesa.EstadoMesa estado) {
        return mesaRepository.findByEstado(estado);
    }
    
    public Mesa guardar(Mesa mesa) {
        return mesaRepository.save(mesa);
    }
    
    public void eliminar(Integer id) {
        mesaRepository.deleteById(id);
    }
    
    public boolean existePorNumero(Integer numeroMesa) {
        return mesaRepository.existsByNumeroMesa(numeroMesa);
    }
}