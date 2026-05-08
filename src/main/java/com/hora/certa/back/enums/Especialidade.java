package com.hora.certa.back.enums;

public enum Especialidade {
    CLINICA_GERAL("Clínica Geral"),
    CARDIOLOGIA("Cardiologia"),
    DERMATOLOGIA("Dermatologia"),
    GINECOLOGIA("Ginecologia"),
    ORTOPEDIA("Ortopedia"),
    PEDIATRIA("Pediatria"),
    PSIQUIATRIA("Psiquiatria"),
    RADIOLOGIA("Radiologia");

    private final String descricao;

    Especialidade(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
