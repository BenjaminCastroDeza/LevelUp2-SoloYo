package com.levelup.levelup_backend.controller;

import com.levelup.levelup_backend.dto.ProductoDTO;
import com.levelup.levelup_backend.service.ProductoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductoControllerIntegrationTest {

    private MockMvc mockMvc;

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoController productoController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productoController).build();
    }

    @Test
    @DisplayName("GET /api/productos debe retornar HTTP 200 con la lista de productos")
    void testListarProductosPublico() throws Exception {
        ProductoDTO p1 = ProductoDTO.builder()
                .id("JM001")
                .nombre("Catan")
                .categoria("Juegos de Mesa")
                .precio(29990.0)
                .img("/imagenes/catan.jpg")
                .build();

        when(productoService.listarTodos()).thenReturn(List.of(p1));

        mockMvc.perform(get("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("JM001"))
                .andExpect(jsonPath("$[0].nombre").value("Catan"))
                .andExpect(jsonPath("$[0].precio").value(29990.0));
    }

    @Test
    @DisplayName("GET /api/productos/{id} debe retornar HTTP 200 con el producto solicitado")
    void testObtenerProductoPorId() throws Exception {
        ProductoDTO p1 = ProductoDTO.builder()
                .id("JM001")
                .nombre("Catan")
                .categoria("Juegos de Mesa")
                .precio(29990.0)
                .img("/imagenes/catan.jpg")
                .build();

        when(productoService.obtenerPorId("JM001")).thenReturn(p1);

        mockMvc.perform(get("/api/productos/JM001")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("JM001"))
                .andExpect(jsonPath("$.nombre").value("Catan"));
    }
}
