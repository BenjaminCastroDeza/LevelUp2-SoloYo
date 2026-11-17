package com.levelup.levelup_backend.service.impl;

import com.levelup.levelup_backend.dto.PedidoItemDTO;
import com.levelup.levelup_backend.dto.PedidoRequest;
import com.levelup.levelup_backend.dto.PedidoResponseDTO;
import com.levelup.levelup_backend.exception.BadRequestException;
import com.levelup.levelup_backend.exception.ResourceNotFoundException;
import com.levelup.levelup_backend.model.DetallePedido;
import com.levelup.levelup_backend.model.Pedido;
import com.levelup.levelup_backend.model.Producto;
import com.levelup.levelup_backend.model.Usuario;
import com.levelup.levelup_backend.repository.PedidoRepository;
import com.levelup.levelup_backend.repository.ProductoRepository;
import com.levelup.levelup_backend.repository.UsuarioRepository;
import com.levelup.levelup_backend.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public PedidoResponseDTO procesarPedido(PedidoRequest request, String userEmail) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("El pedido no contiene productos.");
        }

        Usuario usuario = null;
        if (userEmail != null && !userEmail.isBlank() && !"anonymousUser".equals(userEmail)) {
            usuario = usuarioRepository.findByCorreo(userEmail).orElse(null);
        }

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .nombreCliente(usuario != null ? usuario.getNombre() : "Cliente Invitado")
                .correoCliente(usuario != null ? usuario.getCorreo() : "invitado@levelup.cl")
                .fecha(LocalDateTime.now())
                .cupon(request.getCupon())
                .items(new ArrayList<>())
                .build();

        double subtotal = 0.0;

        for (PedidoItemDTO itemDto : request.getItems()) {
            Producto producto = productoRepository.findById(itemDto.getProductoId().toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", "ID", itemDto.getProductoId()));

            double itemTotal = producto.getPrecio() * itemDto.getCantidad();
            subtotal += itemTotal;

            DetallePedido detalle = DetallePedido.builder()
                    .pedido(pedido)
                    .productoId(producto.getId())
                    .nombreProducto(producto.getNombre())
                    .precioUnitario(producto.getPrecio())
                    .cantidad(itemDto.getCantidad())
                    .subtotal(itemTotal)
                    .build();

            pedido.getItems().add(detalle);
        }

        // Aplicación de lógica de negocio del cupón (DUOC20 -> 20% descuento)
        double descuento = 0.0;
        if (request.getCupon() != null && "DUOC20".equalsIgnoreCase(request.getCupon().trim())) {
            descuento = subtotal * 0.20;
        }

        double total = Math.max(0.0, subtotal - descuento);
        pedido.setDescuento(descuento);
        pedido.setTotal(total);

        Pedido guardado = pedidoRepository.save(pedido);

        return convertirADTO(guardado, subtotal);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarTodos() {
        return pedidoRepository.findAllByOrderByFechaDesc().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> listarPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioIdOrderByFechaDesc(usuarioId).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoResponseDTO obtenerPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", "ID", id));
        return convertirADTO(pedido);
    }

    private PedidoResponseDTO convertirADTO(Pedido pedido) {
        double subtotal = pedido.getItems().stream().mapToDouble(DetallePedido::getSubtotal).sum();
        return convertirADTO(pedido, subtotal);
    }

    private PedidoResponseDTO convertirADTO(Pedido pedido, double subtotal) {
        List<PedidoItemDTO> itemsDTO = pedido.getItems().stream()
                .map(item -> PedidoItemDTO.builder()
                        .productoId(item.getProductoId())
                        .nombreProducto(item.getNombreProducto())
                        .precioUnitario(item.getPrecioUnitario())
                        .cantidad(item.getCantidad())
                        .build())
                .collect(Collectors.toList());

        return PedidoResponseDTO.builder()
                .id(pedido.getId())
                .usuarioId(pedido.getUsuario() != null ? pedido.getUsuario().getId() : null)
                .nombreCliente(pedido.getNombreCliente())
                .correoCliente(pedido.getCorreoCliente())
                .fecha(pedido.getFecha())
                .subtotal(subtotal)
                .descuento(pedido.getDescuento())
                .total(pedido.getTotal())
                .cupon(pedido.getCupon())
                .items(itemsDTO)
                .build();
    }
}
