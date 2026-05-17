package com.hora.certa.back.dto;

public record MedicoLoginResponseDTO(
        Long id,
        String email,
        String nome,
        Long clinicaId,
        String senha
) {}