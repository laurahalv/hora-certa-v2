package com.hora.certa.back.enums;

public enum TipoConvite {
    MEDICO("Médico"),
    PACIENTE("Paciente");

    private final String descricao;

    TipoConvite(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
