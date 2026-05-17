package com.hora.certa.back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDataDTO {
    private int totalPacientes;
    private int totalMedicos;
    private int totalConvites;
}
