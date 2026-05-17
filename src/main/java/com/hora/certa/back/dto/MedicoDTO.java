package com.hora.certa.back.dto;

import com.hora.certa.back.enums.Especialidade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicoDTO {
    private Long id;
    private String nome;
    private String email;
    private String crm;
    private Especialidade especialidade;
    private Long clinicaId;
    private String clinicaNome;
    private String role;

    public MedicoDTO(Long id, String nome, Especialidade especialidade, String cpf, String email, String telefone, String endereco) {
    }
}

