package com.hora.certa.back.models;

import com.hora.certa.back.User;
import com.hora.certa.back.enums.Especialidade;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "Clinica")
public class Clinica extends User {

    @Column(name = "cnpj", nullable = false, unique = true)
    private String cnpj;

    @Column(name = "endereco")
    private String endereco;

    public Medico cadastrarMedico(String crm, Especialidade especialidade) {
        Medico medico = new Medico();
        medico.setNome(this.nome);
        medico.setEspecialidade(especialidade);
        medico.setCrm(crm);
        medico.setEmail(this.email);
        medico.setSenha(this.senha);
        medico.setClinica(this);
        medico.setRole("MEDICO");
        return medico;
    }

    public Paciente cadastrarPaciente(String cpf, String telefone) {
        Paciente paciente = new Paciente();
        paciente.setNome(this.nome);
        paciente.setCpf(cpf);
        paciente.setEmail(this.email);
        paciente.setSenha(this.senha);
        paciente.setClinica(this);
        paciente.setTelefone(telefone);
        paciente.setRole("PACIENTE");
        return paciente;
    }
}
