package com.hora.certa.back.dto;

import com.hora.certa.back.models.Clinica;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClinicaDTO {
    private Long id;
    private String nome;
    private String email;
    private String cnpj;
    private String endereco;
    private String role;

    public ClinicaDTO(Clinica clinica) {
        this.id = clinica.getId();
        this.nome = clinica.getNome();
        this.email = clinica.getEmail();
        this.cnpj = clinica.getCnpj(); // Adicionado
        this.endereco = clinica.getEndereco(); // Adicionado
        this.role = clinica.getRole(); // Geralmente o Role é um Enum, usamos .name()
    }
}

