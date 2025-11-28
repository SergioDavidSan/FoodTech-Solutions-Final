package com.foodtech.services;

import com.foodtech.model.Usuario;
import com.foodtech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("java:S6813")
public class UsuarioDetailsService implements UserDetailsService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        
        return User.builder()
                .username(usuario.getNombreUsuario())
                .password(usuario.getContrasena()) // ✅ SIN encriptación
                .roles(usuario.getRol().getNombreRol().toUpperCase())
                .build();
    }
}