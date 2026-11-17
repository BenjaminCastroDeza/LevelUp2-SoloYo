package com.levelup.levelup_backend.service;

import com.levelup.levelup_backend.model.Usuario;

import java.util.List;

public interface UsuarioService {

    List<Usuario> listarTodos();

    Usuario obtenerPorId(Long id);

    Usuario obtenerPorCorreo(String correo);

    void cambiarRol(Long id, String nuevoRol);
}
