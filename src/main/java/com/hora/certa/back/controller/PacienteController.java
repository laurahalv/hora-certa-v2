package com.hora.certa.back.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.hora.certa.back.dto.*;
import com.hora.certa.back.repository.RegistroConsumoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hora.certa.back.models.Medico;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.repository.MedicoRepository;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.repository.PrescricaoRepository;
import com.hora.certa.back.service.PacienteService;

@RestController
@RequestMapping("api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private PrescricaoRepository prescricaoRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private RegistroConsumoRepository registroConsumoRepository;

    @GetMapping
    public List<PacienteComMedicoDTO> findAll() {
        return pacienteRepository.findAll().stream()
                .map(paciente -> new PacienteComMedicoDTO(
                        paciente.getId(),
                        paciente.getNome(),
                        paciente.getEmail(),
                        paciente.getSenha(),
                        paciente.getTelefone(),
                        paciente.getCpf(),
                        paciente.getMedico() != null ? paciente.getMedico().getNome() : "Sem médico",
                        paciente.getMedico() != null ? paciente.getMedico().getId() : null
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/clinica/{clinicaId}")
    public List<PacienteComMedicoDTO> getPacientesByClinica(@PathVariable Long clinicaId) {
        return pacienteRepository.findByClinicaId(clinicaId).stream()
                .map(paciente -> new PacienteComMedicoDTO(
                        paciente.getId(),
                        paciente.getNome(),
                        paciente.getEmail(),
                        paciente.getSenha(),
                        paciente.getTelefone(),
                        paciente.getCpf(),
                        paciente.getMedico() != null ? paciente.getMedico().getNome() : "Sem médico",
                        paciente.getMedico() != null ? paciente.getMedico().getId() : null
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/medico/{medicoId}")
    public List<PacienteComMedicoDTO> getPacientesByMedico(@PathVariable Long medicoId) {
        return pacienteRepository.findByMedicoId(medicoId).stream()
                .map(paciente -> new PacienteComMedicoDTO(
                        paciente.getId(),
                        paciente.getNome(),
                        paciente.getEmail(),
                        paciente.getSenha(),
                        paciente.getTelefone(),
                        paciente.getCpf(),
                        paciente.getMedico() != null ? paciente.getMedico().getNome() : "Sem médico",
                        paciente.getMedico() != null ? paciente.getMedico().getId() : null
                ))
                .collect(Collectors.toList());
    }

    @PostMapping
    public PacienteDTO create(@RequestBody PacienteCreateDTO dto) {
        return pacienteService.create(dto);
    }

    @PutMapping("/{id}")
    public PacienteDTO update(@PathVariable Long id, @RequestBody PacienteCreateDTO dto) {
        return pacienteService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        pacienteService.delete(id);
    }

    @GetMapping("/dashboard/{pacienteId}")
    public ResponseEntity<DashboardPacienteDTO> getDashboardData(@PathVariable Long pacienteId) {
        DashboardPacienteDTO dadosDash = pacienteService.buscarDadosDashboard(pacienteId);
        return ResponseEntity.ok(dadosDash);
    }

    @GetMapping("/{pacienteId}/proximos")
    public List<MedicamentoDTO> getProximosMedicamentos(@PathVariable Long pacienteId) {
        return prescricaoRepository.findValidPrescriptionsByPaciente(pacienteId).stream()
                .map(prescricao -> new MedicamentoDTO(
                        prescricao.getId(),
                        prescricao.getNomeRemedio(),
                        prescricao.getDosagem(),
                        prescricao.getFrequencia(),
                        prescricao.getDataInicio().toLocalDate(),
                        prescricao.getDataTermino().toLocalDate(),
                        prescricao.getDescricao(),
                        0,
                        "",
                        prescricao.getNomeRemedio()
                ))
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/vincular-medico")
    public ResponseEntity<?> vincularMedico(@PathVariable Long id, @RequestBody java.util.Map<String, Long> payload) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Long medicoId = payload.get("medicoId");
        if (medicoId != null) {
            Medico medico = medicoRepository.findById(medicoId)
                    .orElseThrow(() -> new RuntimeException("Médico não encontrado"));
            paciente.setMedico(medico);
        } else {
            paciente.setMedico(null);
        }

        pacienteRepository.save(paciente);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{pacienteId}/medicamentos")
    public ResponseEntity<List<MedicamentoMedViewDTO>> getMedicamentosEmUso(@PathVariable Long pacienteId) {
        java.time.format.DateTimeFormatter fmt = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<com.hora.certa.back.models.Prescricao> prescricoes = prescricaoRepository.findByPacienteId(pacienteId);

        List<MedicamentoMedViewDTO> dtos = prescricoes.stream()
                .map(p -> {
                    Long tomadas = registroConsumoRepository.countDosesTomadasPorPrescricao(p.getId());
                    Long totais = registroConsumoRepository.countTotalDosesPorPrescricao(p.getId());

                    int adesaoReal = 0;
                    if (totais > 0) {
                        int calculo = (int) ((tomadas * 100) / totais);
                        adesaoReal = Math.min(calculo, 100);
                    }

                    return new MedicamentoMedViewDTO(
                            p.getNomeRemedio(),
                            p.getDosagem(),
                            p.getFrequencia(),
                            p.getDataInicio().format(fmt),
                            p.getDataTermino().format(fmt),
                            adesaoReal
                    );
                }).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDTO> findById(@PathVariable Long id) {
        return pacienteRepository.findById(id)
                .map(p -> ResponseEntity.ok(new PacienteDTO(
                        p.getId(),
                        p.getNome(),
                        p.getEmail(),
                        p.getTelefone(),
                        p.getRole()
                )))
                .orElse(ResponseEntity.notFound().build());
    }
}