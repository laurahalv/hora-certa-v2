package com.hora.certa.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.hora.certa.back.enums.StatusConvite;
import com.hora.certa.back.enums.TipoConvite;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConviteDTO {

    private Long id;
    private String email;
    private String status;
    private String tipo;
    private String data;
    private String enviadoPor;

    public ConviteDTO(Long id, String email, StatusConvite status, TipoConvite tipo, LocalDateTime dataEnvio, String enviadoPor) {
        this.id = id;
        this.email = email;
        this.status = status.getDescricao();
        this.tipo = tipo.getDescricao();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        this.data = dataEnvio.format(formatter);
        this.enviadoPor = enviadoPor;
    }
}
