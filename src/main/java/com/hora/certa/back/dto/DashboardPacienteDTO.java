package com.hora.certa.back.dto;

import java.util.List;

public record DashboardPacienteDTO(
        Integer adesaoGeral,
        Long medicamentosTomadosHoje,
        Long totalMedicamentosHoje,
        Integer proximosMedicamentos,
        String medicoResponsavel,
        List<HistoricoMedicamentoDTO> historico,
        List<NaoTomadoMedicamentoDTO> naoTomados
) {}