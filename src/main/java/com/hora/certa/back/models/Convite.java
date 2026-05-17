package com.hora.certa.back.models;

import com.hora.certa.back.enums.StatusConvite;
import com.hora.certa.back.enums.TipoConvite;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "Convite")
public class Convite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusConvite status;

    @Column(name = "tipo", nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoConvite tipo;

    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio;

    @Column(name = "data_expiracao")
    private LocalDateTime dataExpiracao;

    @Column(name = "enviado_por")
    private String enviadoPor;

    @ManyToOne
    @JoinColumn(name = "clinica_id", nullable = false)
    private Clinica clinica;

    @Column(name = "token", unique = true)
    private String token;
}
