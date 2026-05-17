package com.hora.certa.back.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List; // Novo Record auxiliar de entrada

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hora.certa.back.dto.MedicamentoDTO;
import com.hora.certa.back.dto.PrescricaoCreateDTO;
import com.hora.certa.back.dto.PrescricaoDTO;
import com.hora.certa.back.dto.PrescricaoRequestDTO;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.models.Prescricao;
import com.hora.certa.back.repository.PacienteRepository;
import com.hora.certa.back.repository.PrescricaoRepository;
import com.hora.certa.back.service.PrescricaoService;

@RestController
@RequestMapping("api/prescricoes")
public class PrescricaoController {

    @Autowired
    private PrescricaoService prescricaoService;

    @Autowired
    private PrescricaoRepository prescricaoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @GetMapping
    public List<Prescricao> findAll() {
        return prescricaoRepository.findAll();
    }

    @PostMapping
    public PrescricaoDTO create(@RequestBody PrescricaoCreateDTO dto) {
        return prescricaoService.create(dto);
    }

    @PostMapping("{pacienteId}/medicamentos")
    public ResponseEntity<MedicamentoDTO> adicionarMedicamentoPeloDash(
            @PathVariable Long pacienteId,
            @RequestBody PrescricaoRequestDTO requestBody) {

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        if (paciente.getMedico() == null) {
            throw new RuntimeException("Este paciente não possui um médico responsável vinculado.");
        }

        DateTimeFormatter formatador = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        java.time.LocalDateTime inicioDataHora = LocalDate.parse(requestBody.inicio(), formatador).atStartOfDay();
        java.time.LocalDateTime terminoDataHora = LocalDate.parse(requestBody.termino(), formatador).atTime(23, 59, 59);

        PrescricaoCreateDTO createDTO = new PrescricaoCreateDTO(
                requestBody.nome(),
                requestBody.dose(),
                requestBody.frequencia(),
                inicioDataHora,
                terminoDataHora,
                requestBody.observacoes(),
                paciente.getMedico().getId(),
                pacienteId
        );

        PrescricaoDTO resultado = prescricaoService.create(createDTO);

        MedicamentoDTO medicamentoResponse = new MedicamentoDTO(
                resultado.getId(),
                resultado.getNomeRemedio(), // nome
                resultado.getDosagem(), // dose
                resultado.getFrequencia(),
                resultado.getDataInicio().toLocalDate(), // inicio
                resultado.getDataTermino().toLocalDate(), // termino
                resultado.getDescricao(),
                0, // adesao (padrão 0)
                "", // horario
                resultado.getNomeRemedio() // medicamento (alias)
        );

        return ResponseEntity.ok(medicamentoResponse);
    }

    @PutMapping("/{id}")
    public PrescricaoDTO update(@PathVariable Long id, @RequestBody PrescricaoCreateDTO dto) {
        return prescricaoService.update(id, dto);
    }

    @PatchMapping("/{id}/cancelar")
    public PrescricaoDTO cancelar(@PathVariable Long id) {
        return prescricaoService.cancelar(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        prescricaoService.delete(id);
    }
}
