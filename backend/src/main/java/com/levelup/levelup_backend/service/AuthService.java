package com.levelup.levelup_backend.service;

import com.levelup.levelup_backend.dto.AuthRequest;
import com.levelup.levelup_backend.dto.AuthResponse;
import com.levelup.levelup_backend.dto.RegistroRequest;

public interface AuthService {

    AuthResponse login(AuthRequest authRequest);

    AuthResponse registrar(RegistroRequest registroRequest);

    AuthResponse getPerfil(String correo);
}
