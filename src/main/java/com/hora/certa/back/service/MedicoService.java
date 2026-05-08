package com.hora.certa.back.service;

import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.repository.ClinicaRepository;
import com.hora.certa.back.dto.MedicoCreateDTO;
import com.hora.certa.back.dto.MedicoDTO;
import com.hora.certa.back.models.Medico;
import com.hora.certa.back.repository.MedicoRepository;
import com.hora.certa.back.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ClinicaRepository clinicaRepository;

    public MedicoDTO create(MedicoCreateDTO dto) {
        if (medicoRepository.existsByCrm(dto.getCrm())) {
            throw new RuntimeException("CRM já cadastrado");
        }
        if (medicoRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        Clinica clinica = clinicaRepository.findById(dto.getClinicaId())
            .orElseThrow(() -> new RuntimeException("Clínica não encontrada"));

        Medico medico = new Medico();
        medico.setNome(dto.getNome());
        medico.setEmail(dto.getEmail());
        medico.setSenha(dto.getSenha() != null && !dto.getSenha().isEmpty() ? dto.getSenha() : PasswordGenerator.generatePassword());
        medico.setCrm(dto.getCrm());
        medico.setEspecialidade(dto.getEspecialidade());
        medico.setClinica(clinica);
        medico.setRole("MEDICO");

        Medico saved = medicoRepository.save(medico);
        return new MedicoDTO(saved.getId(), saved.getNome(), saved.getEmail(), saved.getCrm(),
            saved.getEspecialidade(), saved.getClinica().getId(), saved.getClinica().getNome(), saved.getRole());
    }

    public MedicoDTO update(Long id, MedicoCreateDTO dto) {
        Medico medico = medicoRepository.findById(id).orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        if (!medico.getCrm().equals(dto.getCrm()) && medicoRepository.existsByCrm(dto.getCrm())) {
            throw new RuntimeException("CRM já cadastrado");
        }
        if (!medico.getEmail().equals(dto.getEmail()) && medicoRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        medico.setNome(dto.getNome());
        medico.setEmail(dto.getEmail());
        medico.setSenha(dto.getSenha());
        medico.setCrm(dto.getCrm());
        medico.setEspecialidade(dto.getEspecialidade());

        Medico updated = medicoRepository.save(medico);
        return new MedicoDTO(updated.getId(), updated.getNome(), updated.getEmail(), updated.getCrm(),
            updated.getEspecialidade(), updated.getClinica().getId(), updated.getClinica().getNome(), updated.getRole());
    }

    public void delete(Long id) {
        medicoRepository.deleteById(id);
    }

    public List<Medico> findAllByClinica(Long clinicaId) {
        List<Medico> medicos = medicoRepository.findByClinicaId(clinicaId);
        return medicos;
    }
}

