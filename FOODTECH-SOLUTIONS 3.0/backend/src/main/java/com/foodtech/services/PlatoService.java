package com.foodtech.services;

import com.foodtech.model.Plato;
import com.foodtech.repository.PlatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <<-- ¡NUEVA IMPORTACIÓN!

import java.util.List;

@Service
public class PlatoService {

    @Autowired
    private PlatoRepository platoRepository;

    public List<Plato> getMenu() {
        return platoRepository.findAll();
    }
    
    
    // <<-- ¡NUEVA ANOTACIÓN! Asegura que la operación .save() se complete
    @Transactional 
    public Plato guardarPlato(Plato plato) {
        // Usa el método .save() del JpaRepository para persistir el objeto.
        return platoRepository.save(plato);
    }
}