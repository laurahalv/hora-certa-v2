package com.hora.certa.back.dto;

public record PrescricaoRequestDTO(
        String nome,
        String dose,
        String frequencia,
        String inicio,
        String termino,
        String observacoes
) {}