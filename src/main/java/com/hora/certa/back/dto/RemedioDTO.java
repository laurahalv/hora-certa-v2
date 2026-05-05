package com.hora.certa.back.dto;

import com.hora.certa.back.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RemedioDTO {
    private Long id;
    private String nome;
    private String dosagem;
    private String frequencia;
    private Status status;
}

