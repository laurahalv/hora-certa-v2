package com.hora.certa.back.controller;

import com.hora.certa.back.dto.ConviteDTO;
import com.hora.certa.back.enums.StatusConvite;
import com.hora.certa.back.enums.TipoConvite;
import com.hora.certa.back.service.ConviteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/convites")
public class ConviteController {

    @Autowired
    private ConviteService conviteService;

    @GetMapping("/clinica/{clinicaId}")
    public ResponseEntity<List<ConviteDTO>> obterConvitesPorClinica(@PathVariable Long clinicaId) {
        return ResponseEntity.ok(conviteService.obterConvitesPorClinica(clinicaId));
    }

    @PostMapping
    public ResponseEntity<ConviteDTO> enviarConvite(
            @RequestParam Long clinicaId,
            @RequestParam String email,
            @RequestParam TipoConvite tipo,
            @RequestParam String enviadoPor,
            @RequestParam(required = false) String especialidade,
            @RequestParam(required = false) Long medicoId) {
        ConviteDTO convite = conviteService.enviarConvite(clinicaId, email, tipo, enviadoPor, especialidade, medicoId);
        return new ResponseEntity<>(convite, HttpStatus.CREATED);
    }

    @PatchMapping("/{conviteId}/status")
    public ResponseEntity<ConviteDTO> atualizarStatus(
            @PathVariable Long conviteId,
            @RequestBody Map<String, String> request) {
        StatusConvite novoStatus = StatusConvite.valueOf(request.get("status").toUpperCase());
        ConviteDTO convite = conviteService.atualizarStatus(conviteId, novoStatus);
        return ResponseEntity.ok(convite);
    }

    @DeleteMapping("/{conviteId}")
    public ResponseEntity<Void> deletarConvite(@PathVariable Long conviteId) {
        conviteService.deletarConvite(conviteId);
        return ResponseEntity.noContent().build();
    }
}
