package com.hora.certa.back.dto;

import com.hora.certa.back.enums.StatusConsumo;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroConsumoDTO {
    private Long id;
    private LocalDateTime dataHoraPrevista;
    private LocalDateTime dataHoraConsumida;
    private StatusConsumo status;
    private Long prescricaoId;
    private String nomeRemedio;
    private Long pacienteId;
    private String pacienteNome;
    private String observacoes;
}

