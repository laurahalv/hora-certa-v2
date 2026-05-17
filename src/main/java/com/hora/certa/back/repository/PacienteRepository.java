package com.hora.certa.back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hora.certa.back.models.Paciente;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Buscar paciente por CPF
    Optional<Paciente> findByCpf(String cpf);

    Optional<Paciente> findById(Long id);

    // Buscar paciente por email
    Optional<Paciente> findByEmail(String email);

    // Buscar pacientes por clínica
    long countByClinicaId(Long clinicaId);


    List<Paciente> findByClinicaId(Long clinicaId);

    // Buscar pacientes por médico
    List<Paciente> findByMedicoId(Long medicoId);

    // Buscar pacientes por clínica e médico
    @Query("SELECT p FROM Paciente p WHERE p.clinica.id = :clinicaId AND p.medico.id = :medicoId")
    List<Paciente> findByClinicaAndMedico(@Param("clinicaId") Long clinicaId, @Param("medicoId") Long medicoId);

    // Verificar se existe paciente com CPF
    boolean existsByCpf(String cpf);

    // Verificar se existe paciente com email
    boolean existsByEmail(String email);
}
