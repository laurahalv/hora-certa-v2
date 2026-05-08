package com.hora.certa.back.service;

import com.hora.certa.back.dto.PrescricaoCreateDTO;
import com.hora.certa.back.dto.PrescricaoDTO;
import com.hora.certa.back.models.Medico;
import com.hora.certa.back.repository.MedicoRepository;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.models.Prescricao;
import com.hora.certa.back.repository.PrescricaoRepository;
import com.hora.certa.back.enums.StatusPrescricao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescricaoService {

    @Autowired
    private PrescricaoRepository prescricaoRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public PrescricaoDTO create(PrescricaoCreateDTO dto) {
        Medico medico = medicoRepository.findById(dto.getMedicoId())
            .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        if (dto.getDataTermino().isBefore(dto.getDataInicio())) {
            throw new RuntimeException("Data de término não pode ser anterior à data de início");
        }

        Prescricao prescricao = new Prescricao();
        prescricao.setNomeRemedio(dto.getNomeRemedio());
        prescricao.setDosagem(dto.getDosagem());
        prescricao.setFrequencia(dto.getFrequencia());
        prescricao.setDataInicio(dto.getDataInicio());
        prescricao.setDataTermino(dto.getDataTermino());
        prescricao.setDescricao(dto.getDescricao());
        prescricao.setMedico(medico);
        prescricao.setPaciente(paciente);
        prescricao.setStatus(StatusPrescricao.ATIVA);

        Prescricao saved = prescricaoRepository.save(prescricao);
        return new PrescricaoDTO(saved.getId(), saved.getNomeRemedio(), saved.getDosagem(), saved.getFrequencia(),
            saved.getDataInicio(), saved.getDataTermino(), saved.getDescricao(),
            saved.getMedico().getId(), saved.getMedico().getNome(),
            saved.getPaciente().getId(), saved.getPaciente().getNome(), saved.getStatus());
    }

    public PrescricaoDTO update(Long id, PrescricaoCreateDTO dto) {
        Prescricao prescricao = prescricaoRepository.findById(id).orElseThrow(() -> new RuntimeException("Prescrição não encontrada"));

        if (dto.getDataTermino().isBefore(dto.getDataInicio())) {
            throw new RuntimeException("Data de término não pode ser anterior à data de início");
        }

        prescricao.setNomeRemedio(dto.getNomeRemedio());
        prescricao.setDosagem(dto.getDosagem());
        prescricao.setFrequencia(dto.getFrequencia());
        prescricao.setDataInicio(dto.getDataInicio());
        prescricao.setDataTermino(dto.getDataTermino());
        prescricao.setDescricao(dto.getDescricao());

        Prescricao updated = prescricaoRepository.save(prescricao);
        return new PrescricaoDTO(updated.getId(), updated.getNomeRemedio(), updated.getDosagem(), updated.getFrequencia(),
            updated.getDataInicio(), updated.getDataTermino(), updated.getDescricao(),
            updated.getMedico().getId(), updated.getMedico().getNome(),
            updated.getPaciente().getId(), updated.getPaciente().getNome(), updated.getStatus());
    }

    public PrescricaoDTO cancelar(Long id) {
        Prescricao prescricao = prescricaoRepository.findById(id).orElseThrow(() -> new RuntimeException("Prescrição não encontrada"));
        prescricao.setStatus(StatusPrescricao.CANCELADA);
        Prescricao updated = prescricaoRepository.save(prescricao);
        return new PrescricaoDTO(updated.getId(), updated.getNomeRemedio(), updated.getDosagem(), updated.getFrequencia(),
            updated.getDataInicio(), updated.getDataTermino(), updated.getDescricao(),
            updated.getMedico().getId(), updated.getMedico().getNome(),
            updated.getPaciente().getId(), updated.getPaciente().getNome(), updated.getStatus());
    }

    public void delete(Long id) {
        prescricaoRepository.deleteById(id);
    }
}

