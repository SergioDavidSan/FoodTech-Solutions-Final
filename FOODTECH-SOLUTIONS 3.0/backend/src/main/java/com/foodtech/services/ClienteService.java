package com.foodtech.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodtech.model.Cliente;
import com.foodtech.repository.ClienteRepository;

@Service
@SuppressWarnings("java:S6813")
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }
    
    public Optional<Cliente> obtenerPorId(Integer id) {
        return clienteRepository.findById(id);
    }
    
    public Optional<Cliente> obtenerPorEmail(String email) {
        return clienteRepository.findByEmail(email);
    }
    
    public List<Cliente> buscarPorNombre(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCase(nombre);
    }
    
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    public void eliminar(Integer id) {
        clienteRepository.deleteById(id);
    }
    
    public boolean existePorEmail(String email) {
        return clienteRepository.existsByEmail(email);
    }
}