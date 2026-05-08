package com.hora.certa.back.repository;

import com.hora.certa.back.models.Remedio;
import com.hora.certa.back.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RemedioRepository extends JpaRepository<Remedio, Long> {

    // Buscar remédio por nome
    Remedio findByNome(String nome);

    // Buscar remédios por dosagem
    List<Remedio> findByDosagem(String dosagem);

    // Buscar remédios por status
    List<Remedio> findByStatus(Status status);

    // Buscar remédios por frequência
    List<Remedio> findByFrequencia(String frequencia);

    // Buscar remédios por nome e dosagem
    Remedio findByNomeAndDosagem(String nome, String dosagem);

    // Verificar se existe remédio com nome
    boolean existsByNome(String nome);
}

