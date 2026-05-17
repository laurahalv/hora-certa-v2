package com.hora.certa.back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hora.certa.back.enums.StatusConvite;
import com.hora.certa.back.models.Convite;

@Repository
public interface ConviteRepository extends JpaRepository<Convite, Long> {

    // Buscar convites por clínica
    List<Convite> findByClinicaId(Long clinicaId);

    // Buscar convites por clínica e status
    List<Convite> findByClinicaIdAndStatus(Long clinicaId, StatusConvite status);

    // Buscar convite por token
    Optional<Convite> findByToken(String token);

    // Buscar convite por email
    Optional<Convite> findByEmail(String email);

    // Contar convites por clínica
    long countByClinicaId(Long clinicaId);

    // Contar convites por clínica e status
    long countByClinicaIdAndStatus(Long clinicaId, StatusConvite status);
}
