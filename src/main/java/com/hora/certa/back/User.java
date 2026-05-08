package com.hora.certa.back;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nome", nullable = false)
    protected String nome;

    @Column(name = "email", nullable = false, unique = true)
    protected String email;

    @Column(name = "senha", nullable = false)
    protected String senha;

    @Column(name = "role", nullable = false)
    protected String role;
}
