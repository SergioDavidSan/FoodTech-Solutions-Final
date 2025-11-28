package com.foodtech.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.foodtech.model.Factura;
import com.foodtech.repository.FacturaRepository;

@Service
@SuppressWarnings("java:S6813")
public class FacturaService {
    
    @Autowired
    private FacturaRepository facturaRepository;
    
    public List<Factura> obtenerTodas() {
        return facturaRepository.findAll();
    }
    
    public Optional<Factura> obtenerPorId(Integer id) {
        return facturaRepository.findById(id);
    }
    
    public Optional<Factura> obtenerPorNumero(String numeroFactura) {
        return facturaRepository.findByNumeroFactura(numeroFactura);
    }
    
    public Optional<Factura> obtenerPorPedido(Integer idPedido) {
        return facturaRepository.findByPedidoIdPedido(idPedido);
    }
    
    public List<Factura> obtenerPorCajero(Integer idCajero) {
        return facturaRepository.findByCajeroIdUsuario(idCajero);
    }
    
    public Factura guardar(Factura factura) {
        return facturaRepository.save(factura);
    }
    
    public void eliminar(Integer id) {
        facturaRepository.deleteById(id);
    }
}