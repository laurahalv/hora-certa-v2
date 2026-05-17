package com.hora.certa.back.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hora.certa.back.dto.ClinicaCreateDTO;
import com.hora.certa.back.dto.ClinicaDTO;
import com.hora.certa.back.dto.ClinicaUpdateDTO;
import com.hora.certa.back.dto.DashboardDataDTO;
import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.repository.ClinicaRepository;
import com.hora.certa.back.repository.ConviteRepository;
import com.hora.certa.back.repository.MedicoRepository;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.service.ClinicaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    private final ClinicaService clinicaService;

    @Autowired
    private ClinicaRepository clinicaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private ConviteRepository conviteRepository;

    public ClinicaController(ClinicaService clinicaService) {
        this.clinicaService = clinicaService;
    }

    @GetMapping
    public ResponseEntity<List<Clinica>> listarClinicas() {
        return ResponseEntity.ok(clinicaRepository.findAll());
    }

    @GetMapping("/{clinicaId}")
    public ResponseEntity<Clinica> obterClinica(@PathVariable Long clinicaId) {
        return clinicaRepository.findById(clinicaId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{clinicaId}/dashboard")
    public ResponseEntity<DashboardDataDTO> getDashboardData(@PathVariable Long clinicaId) {
        long totalPacientes = pacienteRepository.countByClinicaId(clinicaId);
        long totalMedicos = medicoRepository.countByClinicaId(clinicaId);
        long totalConvites = conviteRepository.countByClinicaId(clinicaId);

        DashboardDataDTO dashboardData = new DashboardDataDTO((int) totalPacientes, (int) totalMedicos, (int) totalConvites);
        return ResponseEntity.ok(dashboardData);
    }

    @PostMapping
    public ResponseEntity<ClinicaDTO> criarClinica(@RequestBody ClinicaCreateDTO dto) {
        ClinicaDTO createdClinica = clinicaService.create(dto);
        return new ResponseEntity<>(createdClinica, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ClinicaDTO> atualizarClinica(@RequestBody @Valid ClinicaUpdateDTO dto,
            @PathVariable Long id) {
        ClinicaDTO updatedClinica = clinicaService.update(id, dto);
        return new ResponseEntity<>(updatedClinica, HttpStatus.OK);
    }
}
