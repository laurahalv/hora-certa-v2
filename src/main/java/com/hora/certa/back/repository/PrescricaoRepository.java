package com.hora.certa.back.repository;

import com.hora.certa.back.models.Prescricao;
import com.hora.certa.back.enums.StatusPrescricao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PrescricaoRepository extends JpaRepository<Prescricao, Long> {

    // Buscar prescrições por médico
    List<Prescricao> findByMedicoId(Long medicoId);

    // Buscar prescrições por paciente
    List<Prescricao> findByPacienteId(Long pacienteId);

    // Buscar prescrições por status
    List<Prescricao> findByStatus(StatusPrescricao status);

    // Buscar prescrições ativas de um paciente
    @Query("SELECT p FROM Prescricao p WHERE p.paciente.id = :pacienteId AND p.status = 'ATIVA'")
    List<Prescricao> findActivePrescriptionsByPaciente(@Param("pacienteId") Long pacienteId);

    // Buscar prescrições por médico e status
    @Query("SELECT p FROM Prescricao p WHERE p.medico.id = :medicoId AND p.status = :status")
    List<Prescricao> findByMedicoAndStatus(@Param("medicoId") Long medicoId, @Param("status") StatusPrescricao status);

    // Buscar prescrições por data
    List<Prescricao> findByDataInicioBetween(LocalDateTime dataInicio, LocalDateTime dataFim);

    // Buscar prescrições por nome do remédio
    List<Prescricao> findByNomeRemedio(String nomeRemedio);

    // Buscar prescrições ativas de um paciente por data
    @Query("SELECT p FROM Prescricao p WHERE p.paciente.id = :pacienteId AND p.status = 'ATIVA' AND p.dataTermino > CURRENT_TIMESTAMP")
    List<Prescricao> findValidPrescriptionsByPaciente(@Param("pacienteId") Long pacienteId);
}

