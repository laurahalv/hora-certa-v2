package com.hora.certa.back.models;

import com.hora.certa.back.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "Remedio")
public class Remedio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "dosagem", nullable = false)
    private String dosagem;

    @Column(name = "frequencia", nullable = false)
    private String frequencia;

    @Column(name = "status", nullable = false)
    private Status status;
}
