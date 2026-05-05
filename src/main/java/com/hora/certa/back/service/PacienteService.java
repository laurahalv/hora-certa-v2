package com.hora.certa.back.service;

import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.repository.ClinicaRepository;
import com.hora.certa.back.dto.PacienteCreateDTO;
import com.hora.certa.back.dto.PacienteDTO;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ClinicaRepository clinicaRepository;

    public PacienteDTO create(PacienteCreateDTO dto) {
        if (pacienteRepository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        if (pacienteRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Clinica clinica = clinicaRepository.findById(dto.getClinicaId())
            .orElseThrow(() -> new RuntimeException("Clínica não encontrada"));

        Paciente paciente = new Paciente();
        paciente.setNome(dto.getNome());
        paciente.setEmail(dto.getEmail());
        paciente.setSenha(dto.getSenha() != null && !dto.getSenha().isEmpty() ? dto.getSenha() : PasswordGenerator.generatePassword());
        paciente.setCpf(dto.getCpf());
        paciente.setTelefone(dto.getTelefone());
        paciente.setClinica(clinica);
        paciente.setRole("PACIENTE");

        Paciente saved = pacienteRepository.save(paciente);
        return new PacienteDTO(saved.getId(), saved.getNome(), saved.getEmail(), saved.getTelefone(), saved.getRole());
    }

    public PacienteDTO update(Long id, PacienteCreateDTO dto) {
        Paciente paciente = pacienteRepository.findById(id).orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        if (!paciente.getCpf().equals(dto.getCpf()) && pacienteRepository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        if (!paciente.getEmail().equals(dto.getEmail()) && pacienteRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        paciente.setNome(dto.getNome());
        paciente.setEmail(dto.getEmail());
        paciente.setSenha(dto.getSenha());
        paciente.setTelefone(dto.getTelefone());

        Paciente updated = pacienteRepository.save(paciente);
        return new PacienteDTO(updated.getId(), updated.getNome(), updated.getEmail(),
            updated.getTelefone(), updated.getRole());
    }

    public void delete(Long id) {
        pacienteRepository.deleteById(id);
    }
}

