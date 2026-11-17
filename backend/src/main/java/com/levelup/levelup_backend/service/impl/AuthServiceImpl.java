package com.levelup.levelup_backend.service.impl;

import com.levelup.levelup_backend.dto.AuthRequest;
import com.levelup.levelup_backend.dto.AuthResponse;
import com.levelup.levelup_backend.dto.RegistroRequest;
import com.levelup.levelup_backend.exception.BadRequestException;
import com.levelup.levelup_backend.exception.ResourceNotFoundException;
import com.levelup.levelup_backend.model.Role;
import com.levelup.levelup_backend.model.Usuario;
import com.levelup.levelup_backend.repository.UsuarioRepository;
import com.levelup.levelup_backend.security.JwtTokenProvider;
import com.levelup.levelup_backend.security.UserPrincipal;
import com.levelup.levelup_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        String correoLimpio = authRequest.getCorreo().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        correoLimpio,
                        authRequest.getContrasena()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Usuario usuario = usuarioRepository.findByCorreo(userPrincipal.getCorreo())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "correo", userPrincipal.getCorreo()));

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol().name())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse registrar(RegistroRequest request) {
        String correoLimpio = request.getCorreo().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correoLimpio)) {
            throw new BadRequestException("Este correo ya se encuentra registrado.");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre().trim())
                .correo(correoLimpio)
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .telefono(request.getTelefono() != null ? request.getTelefono().trim() : null)
                .region(request.getRegion().trim())
                .comuna(request.getComuna().trim())
                .rol(Role.ROLE_CLIENTE)
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        // Generar token para autologin o retornar AuthResponse
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correoLimpio, request.getContrasena())
        );

        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(guardado.getId())
                .nombre(guardado.getNombre())
                .correo(guardado.getCorreo())
                .rol(guardado.getRol().name())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse getPerfil(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "correo", correo));

        return AuthResponse.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .rol(usuario.getRol().name())
                .build();
    }
}
