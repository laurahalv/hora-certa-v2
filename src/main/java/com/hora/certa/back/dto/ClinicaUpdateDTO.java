package com.hora.certa.back.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class ClinicaUpdateDTO {
    @Email(message = "Email deve ser válido")
    private String email;

    private String nome;

    private String endereco;
}
