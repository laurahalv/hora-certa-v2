package com.hora.certa.back.service;

import com.hora.certa.back.dto.DashboardPacienteDTO;
import com.hora.certa.back.dto.HistoricoMedicamentoDTO;
import com.hora.certa.back.dto.NaoTomadoMedicamentoDTO;
import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.repository.ClinicaRepository;
import com.hora.certa.back.dto.PacienteCreateDTO;
import com.hora.certa.back.dto.PacienteDTO;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.repository.PrescricaoRepository;
import com.hora.certa.back.repository.RegistroConsumoRepository;
import com.hora.certa.back.util.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private ClinicaRepository clinicaRepository;

    @Autowired
    private PrescricaoRepository prescricaoRepository;

    @Autowired
    private RegistroConsumoRepository registroConsumoRepository;

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

    public DashboardPacienteDTO buscarDadosDashboard(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        String medicoResponsavel = (paciente.getMedico() != null)
                ? paciente.getMedico().getNome()
                : "Sem médico atribuído";

        java.time.LocalDateTime inicioDia = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime fimDia = java.time.LocalDate.now().atTime(23, 59, 59);

        Long medicamentosTomadosHoje = registroConsumoRepository.countTomadosHoje(pacienteId, inicioDia, fimDia);
        Long totalMedicamentosHoje = registroConsumoRepository.countTotalAgendadoHoje(pacienteId, inicioDia, fimDia);
        Integer proximosMedicamentos = prescricaoRepository.countProximosMedicamentos(pacienteId);

        Integer adesaoGeral = 0;
        if (totalMedicamentosHoje > 0) {
            int calculoPercentual = (int) ((medicamentosTomadosHoje * 100) / totalMedicamentosHoje);
            adesaoGeral = Math.min(calculoPercentual, 100);
        }

        java.time.format.DateTimeFormatter formatadorData = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
        java.time.format.DateTimeFormatter formatadorHora = java.time.format.DateTimeFormatter.ofPattern("HH:mm");

        List<HistoricoMedicamentoDTO> historico = registroConsumoRepository.findHistoricoCompleto(pacienteId).stream()
                .map(rc -> new HistoricoMedicamentoDTO(
                        rc.getPrescricao() != null ? rc.getPrescricao().getNomeRemedio() : "Medicamento",
                        rc.getPrescricao() != null ? rc.getPrescricao().getDosagem() : "—",
                        rc.getDataHoraPrevista().format(formatadorData),
                        rc.getDataHoraPrevista().format(formatadorHora),
                        rc.getStatus().toString()
                ))
                .collect(Collectors.toList());

        List<NaoTomadoMedicamentoDTO> naoTomados = registroConsumoRepository.findPendingByPaciente(pacienteId).stream()
                .map(rc -> new NaoTomadoMedicamentoDTO(
                        rc.getId(),
                        rc.getPrescricao() != null ? rc.getPrescricao().getNomeRemedio() : "Medicamento",
                        rc.getPrescricao() != null ? rc.getPrescricao().getDosagem() : "—",
                        rc.getDataHoraPrevista().format(formatadorHora),
                        rc.getDataHoraPrevista().format(formatadorData)
                ))
                .collect(Collectors.toList());

        return new DashboardPacienteDTO(
                adesaoGeral,
                medicamentosTomadosHoje,
                totalMedicamentosHoje,
                proximosMedicamentos,
                medicoResponsavel,
                historico,
                naoTomados
        );
    }
}