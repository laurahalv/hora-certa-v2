package com.hora.certa.back.controller;

import com.hora.certa.back.dto.RegistroConsumoCreateDTO;
import com.hora.certa.back.dto.RegistroConsumoDTO;
import com.hora.certa.back.models.RegistroConsumo;
import com.hora.certa.back.repository.RegistroConsumoRepository;
import com.hora.certa.back.service.RegistroConsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/registro-consumo")
public class RegistroConsumoController {

    @Autowired
    private RegistroConsumoService registroConsumoService;

    @Autowired
    private RegistroConsumoRepository registroConsumoRepository;

    @GetMapping
    public List<RegistroConsumo> findAll() {
        return registroConsumoRepository.findAll();
    }

    @PostMapping
    public RegistroConsumoDTO create(@RequestBody RegistroConsumoCreateDTO dto) {
        return registroConsumoService.create(dto);
    }

    @PatchMapping("/{id}/registrar")
    public RegistroConsumoDTO registrar(@PathVariable Long id) {
        return registroConsumoService.registrarConsumo(id);
    }

    @PatchMapping("/{id}/desnecessario")
    public RegistroConsumoDTO marcarDesnecessario(@PathVariable Long id) {
        return registroConsumoService.marcarComoDesnecessario(id);
    }

    @PutMapping("/{id}")
    public RegistroConsumoDTO update(@PathVariable Long id, @RequestBody RegistroConsumoCreateDTO dto) {
        return registroConsumoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        registroConsumoService.delete(id);
    }
}