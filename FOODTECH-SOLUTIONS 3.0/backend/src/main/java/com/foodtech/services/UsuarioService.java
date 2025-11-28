package com.foodtech.services;

import com.foodtech.model.Usuario;
import com.foodtech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@SuppressWarnings("java:S6813")
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }
    
    public Optional<Usuario> obtenerPorId(Integer id) {
        return usuarioRepository.findById(id);
    }
    
    public Optional<Usuario> obtenerPorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.findByNombreUsuario(nombreUsuario);
    }
    
    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }
    
    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }
    
    public boolean existePorNombreUsuario(String nombreUsuario) {
        return usuarioRepository.existsByNombreUsuario(nombreUsuario);
    }
    
    public boolean existePorEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}