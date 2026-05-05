package com.hora.certa.back.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescricaoCreateDTO {

    @NotBlank(message = "Nome do remédio é obrigatório")
    private String nomeRemedio;

    @NotBlank(message = "Dosagem é obrigatória")
    private String dosagem;

    @NotBlank(message = "Frequência é obrigatória")
    private String frequencia;

    @NotNull(message = "Data de início é obrigatória")
    private LocalDateTime dataInicio;

    @NotNull(message = "Data de término é obrigatória")
    private LocalDateTime dataTermino;

    private String descricao;

    @NotNull(message = "ID do médico é obrigatório")
    private Long medicoId;

    @NotNull(message = "ID do paciente é obrigatório")
    private Long pacienteId;
}

