package com.hora.certa.back.controller;

import java.util.List;
import java.util.Optional;

import com.hora.certa.back.dto.MedicoLoginResponseDTO;
import com.hora.certa.back.dto.MedicoUpdateDTO;
import com.hora.certa.back.models.Paciente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hora.certa.back.dto.MedicoCreateDTO;
import com.hora.certa.back.dto.MedicoDTO;
import com.hora.certa.back.models.Medico;
import com.hora.certa.back.repository.MedicoRepository;
import com.hora.certa.back.service.MedicoService;

@RestController
@RequestMapping("/api/medicos")
public class MedicoController {

    private final MedicoService medicoService;

    @Autowired
    private MedicoRepository medicoRepository;

    public MedicoController(MedicoService medicoService) {
        this.medicoService = medicoService;
    }

    @PostMapping
    public ResponseEntity<MedicoDTO> cadastrar(@RequestBody MedicoCreateDTO dto) {
        return new ResponseEntity<>(medicoService.create(dto), HttpStatus.CREATED);
    }

    @GetMapping("/clinica/{clinicaId}")
    public ResponseEntity<List<Medico>> listarPorClinica(@PathVariable Long clinicaId) {
        return ResponseEntity.ok(medicoService.findAllByClinica(clinicaId));
    }

    @GetMapping
    public ResponseEntity<List<MedicoLoginResponseDTO>> findAll() {
        List<Medico> medicos = medicoRepository.findAll();

        List<MedicoLoginResponseDTO> dtos = medicos.stream()
                .map(m -> new MedicoLoginResponseDTO(
                        m.getId(),
                        m.getEmail(),
                        m.getNome(),
                        m.getClinica() != null ? m.getClinica().getId() : null,
                        m.getSenha()
                ))
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{medicoId}/pacientes")
    public ResponseEntity<List<Paciente>> pacientesPorMedico(@RequestParam Long medicoId) {
        List<Paciente> pacientes = medicoService.findPacientesByMedicoId(medicoId);
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicoDTO> findById(@PathVariable Long id) {
        return medicoRepository.findById(id)
                .map(m -> ResponseEntity.ok(new MedicoDTO(
                        m.getId(),
                        m.getNome(),
                        m.getEspecialidade(),
                        m.getCpf(),
                        m.getEmail(),
                        m.getTelefone(),
                        m.getEndereco()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<MedicoDTO> atualizar(
            @PathVariable Long id,
            @RequestBody MedicoUpdateDTO dto) {

        Medico medico = medicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médico não encontrado"));

        medico.setEndereco(dto.endereco());
        medico.setNome(dto.nome());

        medico.setCpf(dto.cpf());
        medico.setTelefone(dto.telefone());

        Medico atualizado = medicoRepository.save(medico);

        MedicoDTO responseDTO = new MedicoDTO(
                atualizado.getId(),
                atualizado.getNome(),
                atualizado.getEspecialidade(),
                atualizado.getCpf(),
                atualizado.getEmail(),
                atualizado.getTelefone(),
                atualizado.getEndereco()
        );

        return ResponseEntity.ok(responseDTO);
    }
}