package com.hora.certa.back.dto;

import com.hora.certa.back.enums.StatusPrescricao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrescricaoDTO {
    private Long id;
    private String nomeRemedio;
    private String dosagem;
    private String frequencia;
    private LocalDateTime dataInicio;
    private LocalDateTime dataTermino;
    private String descricao;
    private Long medicoId;
    private String medicoNome;
    private Long pacienteId;
    private String pacienteNome;
    private StatusPrescricao status;
}

