package com.hora.certa.back.dto;

public record HistoricoMedicamentoDTO(
        String medicamento,
        String dose,
        String data,
        String horario,
        String status
) {}