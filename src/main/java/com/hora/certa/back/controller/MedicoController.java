package com.hora.certa.back.controller;

import com.hora.certa.back.dto.MedicoCreateDTO;
import com.hora.certa.back.dto.MedicoDTO;
import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.models.Medico;
import com.hora.certa.back.repository.MedicoRepository;
import com.hora.certa.back.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Endpoint para a clínica ver quem são seus médicos
    @GetMapping("/clinica/{clinicaId}")
    public ResponseEntity<List<Medico>> listarPorClinica(@PathVariable Long clinicaId) {
        return ResponseEntity.ok(medicoService.findAllByClinica(clinicaId));
    }

    @GetMapping
    public ResponseEntity<List<Medico>> listarMedicos() {
        List<Medico> todosMedicos = medicoRepository.findAll();
        return ResponseEntity.ok(todosMedicos);
    }
}