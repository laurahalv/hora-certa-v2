package com.hora.certa.back.service;

import com.hora.certa.back.dto.RegistroConsumoCreateDTO;
import com.hora.certa.back.dto.RegistroConsumoDTO;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.models.Prescricao;
import com.hora.certa.back.repository.PrescricaoRepository;
import com.hora.certa.back.models.RegistroConsumo;
import com.hora.certa.back.repository.RegistroConsumoRepository;
import com.hora.certa.back.enums.StatusConsumo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistroConsumoService {

    @Autowired
    private RegistroConsumoRepository registroConsumoRepository;

    @Autowired
    private PrescricaoRepository prescricaoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public RegistroConsumoDTO create(RegistroConsumoCreateDTO dto) {
        Prescricao prescricao = prescricaoRepository.findById(dto.getPrescricaoId())
            .orElseThrow(() -> new RuntimeException("Prescrição não encontrada"));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        RegistroConsumo registroConsumo = new RegistroConsumo();
        registroConsumo.setDataHoraPrevista(dto.getDataHoraPrevista());
        registroConsumo.setDataHoraConsumida(dto.getDataHoraConsumida());
        registroConsumo.setPrescricao(prescricao);
        registroConsumo.setPaciente(paciente);
        registroConsumo.setObservacoes(dto.getObservacoes());

        if (dto.getDataHoraConsumida() != null) {
            registroConsumo.setStatus(StatusConsumo.NO_HORARIO);
        } else {
            registroConsumo.setStatus(StatusConsumo.NAO_TOMADO);
        }

        RegistroConsumo saved = registroConsumoRepository.save(registroConsumo);
        return new RegistroConsumoDTO(saved.getId(), saved.getDataHoraPrevista(), saved.getDataHoraConsumida(),
            saved.getStatus(), saved.getPrescricao().getId(), saved.getPrescricao().getNomeRemedio(),
            saved.getPaciente().getId(), saved.getPaciente().getNome(), saved.getObservacoes());
    }

    public RegistroConsumoDTO registrarConsumo(Long id) {
        RegistroConsumo registroConsumo = registroConsumoRepository.findById(id).orElseThrow(() -> new RuntimeException("Registro de consumo não encontrado"));

        if (registroConsumo.getStatus() == StatusConsumo.NO_HORARIO) {
            throw new RuntimeException("Este registro já foi marcado como consumido");
        }

        registroConsumo.setDataHoraConsumida(LocalDateTime.now());
        registroConsumo.setStatus(StatusConsumo.NO_HORARIO);

        RegistroConsumo updated = registroConsumoRepository.save(registroConsumo);
        return new RegistroConsumoDTO(updated.getId(), updated.getDataHoraPrevista(), updated.getDataHoraConsumida(),
            updated.getStatus(), updated.getPrescricao().getId(), updated.getPrescricao().getNomeRemedio(),
            updated.getPaciente().getId(), updated.getPaciente().getNome(), updated.getObservacoes());
    }

    public RegistroConsumoDTO marcarComoDesnecessario(Long id) {
        RegistroConsumo registroConsumo = registroConsumoRepository.findById(id).orElseThrow(() -> new RuntimeException("Registro de consumo não encontrado"));

        registroConsumo.setStatus(StatusConsumo.NAO_TOMADO); // Assuming DESNECESSARIO maps to NAO_TOMADO or similar logic
        RegistroConsumo updated = registroConsumoRepository.save(registroConsumo);
        return new RegistroConsumoDTO(updated.getId(), updated.getDataHoraPrevista(), updated.getDataHoraConsumida(),
            updated.getStatus(), updated.getPrescricao().getId(), updated.getPrescricao().getNomeRemedio(),
            updated.getPaciente().getId(), updated.getPaciente().getNome(), updated.getObservacoes());
    }

    public RegistroConsumoDTO update(Long id, RegistroConsumoCreateDTO dto) {
        RegistroConsumo registroConsumo = registroConsumoRepository.findById(id).orElseThrow(() -> new RuntimeException("Registro de consumo não encontrado"));

        registroConsumo.setDataHoraPrevista(dto.getDataHoraPrevista());
        registroConsumo.setDataHoraConsumida(dto.getDataHoraConsumida());
        registroConsumo.setObservacoes(dto.getObservacoes());

        if (dto.getDataHoraConsumida() != null) {
            registroConsumo.setStatus(StatusConsumo.NO_HORARIO);
        } else {
            registroConsumo.setStatus(StatusConsumo.NAO_TOMADO);
        }

        RegistroConsumo updated = registroConsumoRepository.save(registroConsumo);
        return new RegistroConsumoDTO(updated.getId(), updated.getDataHoraPrevista(), updated.getDataHoraConsumida(),
            updated.getStatus(), updated.getPrescricao().getId(), updated.getPrescricao().getNomeRemedio(),
            updated.getPaciente().getId(), updated.getPaciente().getNome(), updated.getObservacoes());
    }

    public long countConsumedByPaciente(Long pacienteId) {
        return registroConsumoRepository.countConsumedByPaciente(pacienteId);
    }

    public void delete(Long id) {
        registroConsumoRepository.deleteById(id);
    }
}
