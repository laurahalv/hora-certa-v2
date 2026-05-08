package com.hora.certa.back.models;

import com.hora.certa.back.enums.StatusPrescricao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "Prescricao")
public class Prescricao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome_remedio", nullable = false)
    private String nomeRemedio;

    @Column(name = "dosagem", nullable = false)
    private String dosagem;

    @Column(name = "frequencia", nullable = false)
    private String frequencia;

    @Column(name = "data_inicio", nullable = false)
    private LocalDateTime dataInicio;

    @Column(name = "data_termino", nullable = false)
    private LocalDateTime dataTermino;

    @Column(name = "descricao")
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "medico_id", nullable = false)
    private Medico medico;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @OneToMany(mappedBy = "prescricao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegistroConsumo> registrosConsumo;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusPrescricao status = StatusPrescricao.ATIVA;
}

