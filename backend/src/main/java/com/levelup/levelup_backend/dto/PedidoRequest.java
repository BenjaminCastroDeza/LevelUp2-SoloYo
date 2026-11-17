package com.levelup.levelup_backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoRequest {

    private String cupon;

    @NotEmpty(message = "El pedido debe contener al menos un producto")
    @Valid
    private List<PedidoItemDTO> items;
}
