package com.hora.certa.back.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicamentoDTO {

    private Long id;
    private String nome;           // Mapeado de nomeRemedio
    private String dose;           // Mapeado de dosagem
    private String frequencia;
    private LocalDate inicio;      // Mapeado de dataInicio
    private LocalDate termino;     // Mapeado de dataTermino
    private String descricao;
    private Integer adesao;        // Percentual de adesão
    private String horario;        // Horário da próxima dose
    private String medicamento;    // Alias para compatibilidade
}
