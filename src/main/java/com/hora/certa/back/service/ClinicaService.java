package com.hora.certa.back.service;

import com.hora.certa.back.dto.ClinicaUpdateDTO;
import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.repository.ClinicaRepository;
import com.hora.certa.back.dto.ClinicaCreateDTO;
import com.hora.certa.back.dto.ClinicaDTO;
import com.hora.certa.back.util.PasswordGenerator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClinicaService {

    @Autowired
    private ClinicaRepository clinicaRepository;

    public ClinicaDTO create(ClinicaCreateDTO dto) {
        if (clinicaRepository.existsByCnpj(dto.getCnpj())) {
            throw new RuntimeException("CNPJ já cadastrado");
        }
        if (clinicaRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Clinica clinica = new Clinica();
        clinica.setNome(dto.getNome());
        clinica.setEmail(dto.getEmail());
        clinica.setSenha(dto.getSenha() != null && !dto.getSenha().isEmpty() ? dto.getSenha() : PasswordGenerator.generatePassword());
        clinica.setCnpj(dto.getCnpj());
        clinica.setEndereco(dto.getEndereco());
        clinica.setRole("CLINICA");

        return new ClinicaDTO(clinicaRepository.save(clinica));
    }

    public ClinicaDTO findById(Long id) {
        return clinicaRepository.findById(id)
                .map(ClinicaDTO::new)
                .orElseThrow(() -> new RuntimeException("Clínica não encontrada"));
    }

    @Transactional
    public ClinicaDTO update(Long id, ClinicaUpdateDTO dto) {
        Clinica clinica = clinicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clínica não encontrada com o ID: " + id));

        if (dto.getNome() != null) clinica.setNome(dto.getNome());
        if (dto.getEmail() != null) clinica.setEmail(dto.getEmail());
        if (dto.getEndereco() != null) clinica.setEndereco(dto.getEndereco());

        // Ao salvar, passamos a entidade atualizada para o DTO
        return new ClinicaDTO(clinicaRepository.save(clinica));
    }
}