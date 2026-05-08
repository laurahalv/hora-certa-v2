package com.hora.certa.back.controller;

import com.hora.certa.back.dto.PacienteCreateDTO;
import com.hora.certa.back.dto.PacienteDTO;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private PacienteRepository pacienteRepository;

    @GetMapping
    public List<Paciente> findAll() {
        return pacienteRepository.findAll();
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
}