package com.hora.certa.back.repository;

import com.hora.certa.back.models.RegistroConsumo;
import com.hora.certa.back.enums.StatusConsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RegistroConsumoRepository extends JpaRepository<RegistroConsumo, Long> {

    // Buscar registros de consumo por paciente
    List<RegistroConsumo> findByPacienteId(Long pacienteId);

    // Buscar registros de consumo por prescrição
    List<RegistroConsumo> findByPrescricaoId(Long prescricaoId);

    // Buscar registros de consumo por status
    List<RegistroConsumo> findByStatus(StatusConsumo status);

    // Buscar registros de consumo pendentes de um paciente
    @Query("SELECT rc FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId AND rc.status = 'PENDENTE'")
    List<RegistroConsumo> findPendingByPaciente(@Param("pacienteId") Long pacienteId);

    // Buscar registros de consumo consumidos
    @Query("SELECT rc FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId AND rc.status = 'CONSUMIDO'")
    List<RegistroConsumo> findConsumedByPaciente(@Param("pacienteId") Long pacienteId);

    // Buscar registros de consumo por data prevista
    List<RegistroConsumo> findByDataHoraPrevista(LocalDateTime data);

    // Buscar registros não consumidos
    @Query("SELECT rc FROM RegistroConsumo rc WHERE rc.dataHoraConsumida IS NULL AND rc.status = 'PENDENTE'")
    List<RegistroConsumo> findNotConsumedRecords();

    // Buscar registros de consumo por prescrição e status
    @Query("SELECT rc FROM RegistroConsumo rc WHERE rc.prescricao.id = :prescricaoId AND rc.status = :status")
    List<RegistroConsumo> findByPrescricaoAndStatus(@Param("prescricaoId") Long prescricaoId, @Param("status") StatusConsumo status);

    // Contar registros consumidos por paciente
    @Query("SELECT COUNT(rc) FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId AND rc.status = 'CONSUMIDO'")
    long countConsumedByPaciente(@Param("pacienteId") Long pacienteId);
}

