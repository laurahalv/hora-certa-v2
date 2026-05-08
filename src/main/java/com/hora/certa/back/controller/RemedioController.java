package com.hora.certa.back.controller;

import com.hora.certa.back.dto.RemedioCreateDTO;
import com.hora.certa.back.dto.RemedioDTO;
import com.hora.certa.back.models.Remedio;
import com.hora.certa.back.repository.RemedioRepository;
import com.hora.certa.back.service.RemedioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/remedios")
public class RemedioController {

    @Autowired
    private RemedioService remedioService;

    @Autowired
    private RemedioRepository remedioRepository;

    @GetMapping
    public List<Remedio> findAll() {
        return remedioRepository.findAll();
    }

    @PostMapping
    public RemedioDTO create(@RequestBody RemedioCreateDTO dto) {
        return remedioService.create(dto);
    }

    @PutMapping("/{id}")
    public RemedioDTO update(@PathVariable Long id, @RequestBody RemedioCreateDTO dto) {
        return remedioService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        remedioService.delete(id);
    }
}