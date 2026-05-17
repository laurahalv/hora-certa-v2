package com.hora.certa.back.dto;

public record PacienteHomeDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        String medico,
        Integer tratamentos,
        Integer adesao,
        String proximaConsulta,
        String ultimaConsulta
) {}