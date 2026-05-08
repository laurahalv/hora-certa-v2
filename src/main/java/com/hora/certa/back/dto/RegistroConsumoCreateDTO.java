package com.hora.certa.back.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroConsumoCreateDTO {

    @NotNull(message = "Data e hora prevista é obrigatória")
    private LocalDateTime dataHoraPrevista;

    private LocalDateTime dataHoraConsumida;

    @NotNull(message = "ID da prescrição é obrigatório")
    private Long prescricaoId;

    @NotNull(message = "ID do paciente é obrigatório")
    private Long pacienteId;

    private String observacoes;
}

