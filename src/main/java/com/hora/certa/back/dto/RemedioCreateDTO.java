package com.hora.certa.back.dto;

import com.hora.certa.back.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RemedioCreateDTO {

    @NotBlank(message = "Nome do remédio é obrigatório")
    private String nome;

    @NotBlank(message = "Dosagem é obrigatória")
    private String dosagem;

    @NotBlank(message = "Frequência é obrigatória")
    private String frequencia;

    @NotNull(message = "Status é obrigatório")
    private Status status;
}

