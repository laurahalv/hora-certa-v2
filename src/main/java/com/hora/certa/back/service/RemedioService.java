package com.hora.certa.back.service;

import com.hora.certa.back.dto.RemedioCreateDTO;
import com.hora.certa.back.dto.RemedioDTO;
import com.hora.certa.back.models.Remedio;
import com.hora.certa.back.repository.RemedioRepository;
import com.hora.certa.back.enums.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RemedioService {

    @Autowired
    private RemedioRepository remedioRepository;

    public RemedioDTO create(RemedioCreateDTO dto) {
        Remedio exists = remedioRepository.findByNomeAndDosagem(dto.getNome(), dto.getDosagem());
        if (exists != null) {
            throw new RuntimeException("Remédio com este nome e dosagem já existe");
        }

        Remedio remedio = new Remedio();
        remedio.setNome(dto.getNome());
        remedio.setDosagem(dto.getDosagem());
        remedio.setFrequencia(dto.getFrequencia());
        remedio.setStatus(dto.getStatus());

        Remedio saved = remedioRepository.save(remedio);
        return new RemedioDTO(saved.getId(), saved.getNome(), saved.getDosagem(), saved.getFrequencia(), saved.getStatus());
    }

    public RemedioDTO update(Long id, RemedioCreateDTO dto) {
        Remedio remedio = remedioRepository.findById(id).orElseThrow(() -> new RuntimeException("Remédio não encontrado"));

        remedio.setNome(dto.getNome());
        remedio.setDosagem(dto.getDosagem());
        remedio.setFrequencia(dto.getFrequencia());
        remedio.setStatus(dto.getStatus());

        Remedio updated = remedioRepository.save(remedio);
        return new RemedioDTO(updated.getId(), updated.getNome(), updated.getDosagem(), updated.getFrequencia(), updated.getStatus());
    }

    public void delete(Long id) {
        remedioRepository.deleteById(id);
    }
}

