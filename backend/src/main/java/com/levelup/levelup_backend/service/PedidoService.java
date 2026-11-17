package com.levelup.levelup_backend.service;

import com.levelup.levelup_backend.dto.PedidoRequest;
import com.levelup.levelup_backend.dto.PedidoResponseDTO;

import java.util.List;

public interface PedidoService {

    PedidoResponseDTO procesarPedido(PedidoRequest request, String userEmail);

    List<PedidoResponseDTO> listarTodos();

    List<PedidoResponseDTO> listarPorUsuario(Long usuarioId);

    PedidoResponseDTO obtenerPorId(Long id);
}
