package com.hora.certa.back.clinica;

import com.hora.certa.back.medico.Especialidade;
import com.hora.certa.back.medico.Medico;
import com.hora.certa.back.paciente.Paciente;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "Clinica")
public class Clinica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "cnpj", nullable = false, unique = true)
    private String cnpj;

    @Column(name = "email", nullable = false, unique = true)
    @Email
    private String email;

    public Medico cadastrarMedico() {;
        Medico medico = new Medico();
        medico.setNome(this.nome);
        medico.setEspecialidade(Especialidade.CLINICA_GERAL);
        medico.setCrm(this.cnpj);
        medico.setEmail(this.email);
        medico.setSenha("senha123");
        return medico;
    }

    public Paciente cadastrarPaciente() {
        Paciente paciente = new Paciente();
        paciente.setNome(this.nome);
        paciente.setCpf(this.cnpj);
        paciente.setEmail(this.email);
        paciente.setSenha("senha123");
        return paciente;
    }
}
