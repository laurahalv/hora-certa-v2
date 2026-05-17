package com.hora.certa.back.dto;

public record MedicamentoMedViewDTO(
        String nome,
        String dose,
        String frequencia,
        String inicio,
        String termino,
        Integer adesao
) {}