package com.hora.certa.back.repository;

import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.models.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicaRepository extends JpaRepository<Clinica, Long> {

    // Buscar clínica por CNPJ
    Clinica findByCnpj(String cnpj);

    // Buscar clínica por email
    Clinica findByEmail(String email);

    // Buscar clínica por nome
    Clinica findByNome(String nome);

    // Verificar se existe clínica com CNPJ
    boolean existsByCnpj(String cnpj);

    // Verificar se existe clínica com email
    boolean existsByEmail(String email);
}
