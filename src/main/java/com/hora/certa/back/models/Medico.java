package com.hora.certa.back.models;

import com.hora.certa.back.User;
import com.hora.certa.back.enums.Especialidade;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "Medico")
public class Medico extends User {

    @Column(name = "especialidade", nullable = false)
    private Especialidade especialidade;

    @Column(name = "crm", nullable = false, unique = true)
    private String crm;

    @ManyToOne
    @JoinColumn(name = "clinica_id", nullable = false)
    private Clinica clinica;

    @OneToMany(mappedBy = "medico", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Prescricao> prescricoes;

    public Prescricao prescreverRemedio(String nomeRemedio, String dosagem, String frequencia) {
        Prescricao prescricao = new Prescricao();
        prescricao.setNomeRemedio(nomeRemedio);
        prescricao.setDosagem(dosagem);
        prescricao.setFrequencia(frequencia);
        prescricao.setMedico(this);
        return prescricao;
    }
}
