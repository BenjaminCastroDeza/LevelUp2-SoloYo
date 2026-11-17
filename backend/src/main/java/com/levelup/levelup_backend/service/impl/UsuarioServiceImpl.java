package com.levelup.levelup_backend.service.impl;

import com.levelup.levelup_backend.exception.BadRequestException;
import com.levelup.levelup_backend.exception.ResourceNotFoundException;
import com.levelup.levelup_backend.model.Role;
import com.levelup.levelup_backend.model.Usuario;
import com.levelup.levelup_backend.repository.UsuarioRepository;
import com.levelup.levelup_backend.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "ID", id));
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario obtenerPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "correo", correo));
    }

    @Override
    @Transactional
    public void cambiarRol(Long id, String nuevoRol) {
        Usuario usuario = obtenerPorId(id);
        try {
            Role rolEnum = Role.valueOf(nuevoRol.toUpperCase());
            usuario.setRol(rolEnum);
            usuarioRepository.save(usuario);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Rol inválido: " + nuevoRol + ". Debe ser ROLE_CLIENTE o ROLE_ADMIN");
        }
    }
}
