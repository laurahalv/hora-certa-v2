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
    @Query("SELECT rc FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId AND rc.status = 'NAO_TOMADO'")
    List<RegistroConsumo> findPendingByPaciente(@Param("pacienteId") Long pacienteId);

    // Buscar registros de consumo consumidos
    @Query("SELECT rc FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId AND rc.status IN ('NO_HORARIO', 'ATRASADO')")
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

    /// CORRETO: Busca pelos status reais que existem no seu Enum de consumo
    @Query("SELECT COUNT(rc) FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId AND rc.status IN ('NO_HORARIO', 'ATRASADO') AND rc.dataHoraConsumida BETWEEN :inicioDia AND :fimDia")
    Long countTomadosHoje(@Param("pacienteId") Long pacienteId, @Param("inicioDia") LocalDateTime inicioDia, @Param("fimDia") LocalDateTime fimDia);

    // 2. Conta o TOTAL de registros programados/previstos para o dia de hoje (independentemente de ter tomado ou não)
    @Query("SELECT COUNT(rc) FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId AND rc.dataHoraPrevista BETWEEN :inicioDia AND :fimDia")
    Long countTotalAgendadoHoje(@Param("pacienteId") Long pacienteId, @Param("inicioDia") LocalDateTime inicioDia, @Param("fimDia") LocalDateTime fimDia);

    // 3. Busca o histórico de consumo ordenado por data mais recente para a tabela da esquerda do painel
    @Query("SELECT rc FROM RegistroConsumo rc WHERE rc.paciente.id = :pacienteId ORDER BY rc.dataHoraPrevista DESC")
    List<RegistroConsumo> findHistoricoCompleto(@Param("pacienteId") Long pacienteId);

    // No RegistroConsumoRepository.java:
    @Query("SELECT COUNT(rc) FROM RegistroConsumo rc WHERE rc.prescricao.id = :prescricaoId AND rc.status IN ('NO_HORARIO', 'ATRASADO')")
    Long countDosesTomadasPorPrescricao(@Param("prescricaoId") Long prescricaoId);

    @Query("SELECT COUNT(rc) FROM RegistroConsumo rc WHERE rc.prescricao.id = :prescricaoId")
    Long countTotalDosesPorPrescricao(@Param("prescricaoId") Long prescricaoId);
}

