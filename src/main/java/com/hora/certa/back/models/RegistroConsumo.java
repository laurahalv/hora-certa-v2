package com.hora.certa.back.models;

import com.hora.certa.back.enums.StatusConsumo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "RegistroConsumo")
public class RegistroConsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "data_hora_prevista", nullable = false)
    private LocalDateTime dataHoraPrevista;

    @Column(name = "data_hora_consumida")
    private LocalDateTime dataHoraConsumida;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusConsumo status;

    @ManyToOne
    @JoinColumn(name = "prescricao_id", nullable = false)
    private Prescricao prescricao;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @Column(name = "observacoes")
    private String observacoes;
}

