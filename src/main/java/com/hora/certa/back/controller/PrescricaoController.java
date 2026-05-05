package com.hora.certa.back.controller;

import com.hora.certa.back.dto.PrescricaoCreateDTO;
import com.hora.certa.back.dto.PrescricaoDTO;
import com.hora.certa.back.models.Prescricao;
import com.hora.certa.back.repository.PrescricaoRepository;
import com.hora.certa.back.service.PrescricaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/prescricoes")
public class PrescricaoController {

    @Autowired
    private PrescricaoService prescricaoService;

    @Autowired
    private PrescricaoRepository prescricaoRepository;

    @GetMapping
    public List<Prescricao> findAll() {
        return prescricaoRepository.findAll();
    }

    @PostMapping
    public PrescricaoDTO create(@RequestBody PrescricaoCreateDTO dto) {
        return prescricaoService.create(dto);
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