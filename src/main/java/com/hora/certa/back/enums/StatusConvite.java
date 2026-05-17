package com.hora.certa.back.enums;

public enum StatusConvite {
    PENDENTE("Pendente"),
    ACEITO("Aceito"),
    RECUSADO("Recusado"),
    EXPIRADO("Expirado");

    private final String descricao;

    StatusConvite(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
