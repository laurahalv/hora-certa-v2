package com.hora.certa.back.dto;

public record NaoTomadoMedicamentoDTO(
        Long id,
        String nome,
        String dose,
        String horario,
        String data
) {}