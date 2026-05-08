package com.hora.certa.back.controller;

import com.hora.certa.back.dto.ClinicaCreateDTO;
import com.hora.certa.back.dto.ClinicaDTO;
import com.hora.certa.back.dto.ClinicaUpdateDTO;
import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.repository.ClinicaRepository;
import com.hora.certa.back.service.ClinicaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    private final ClinicaService clinicaService;

    @Autowired
    private ClinicaRepository clinicaRepository;

    public ClinicaController(ClinicaService clinicaService) {
        this.clinicaService = clinicaService;
    }

    @GetMapping
    public ResponseEntity<List<Clinica>> listarClinicas() {
        return ResponseEntity.ok(clinicaRepository.findAll());
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
