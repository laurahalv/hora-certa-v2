package com.hora.certa.back.repository;

import com.hora.certa.back.enums.Especialidade;
import com.hora.certa.back.models.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {

    // Buscar médico por CRM
    Medico findByCrm(String crm);

    // Buscar médico por email
    Medico findByEmail(String email);

    // Buscar médicos por especialidade
    List<Medico> findByEspecialidade(Especialidade especialidade);

    // Buscar médicos por clínica
    List<Medico> findByClinicaId(Long clinicaId);

    // Buscar médicos por especialidade e clínica
    @Query("SELECT m FROM Medico m WHERE m.especialidade = :especialidade AND m.clinica.id = :clinicaId")
    List<Medico> findByEspecialidadeAndClinica(@Param("especialidade") Especialidade especialidade, @Param("clinicaId") Long clinicaId);

    // Verificar se existe médico com CRM
    boolean existsByCrm(String crm);

    // Verificar se existe médico com email
    boolean existsByEmail(String email);
}

