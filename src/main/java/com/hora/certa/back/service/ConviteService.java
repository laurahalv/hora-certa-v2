package com.hora.certa.back.service;

import com.hora.certa.back.dto.ConviteDTO;
import com.hora.certa.back.enums.Especialidade;
import com.hora.certa.back.enums.StatusConvite;
import com.hora.certa.back.enums.TipoConvite;
import com.hora.certa.back.models.Clinica;
import com.hora.certa.back.models.Convite;
import com.hora.certa.back.models.Medico;
import com.hora.certa.back.models.Paciente;
import com.hora.certa.back.repository.ClinicaRepository;
import com.hora.certa.back.repository.ConviteRepository;
import com.hora.certa.back.repository.MedicoRepository;
import com.hora.certa.back.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ConviteService {

    @Autowired
    private ConviteRepository conviteRepository;

    @Autowired
    private ClinicaRepository clinicaRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public ConviteDTO enviarConvite(Long clinicaId, String email, TipoConvite tipo, String enviadoPor, String especialidade, Long medicoId) {
        Clinica clinica = clinicaRepository.findById(clinicaId)
                .orElseThrow(() -> new RuntimeException("Clínica não encontrada"));

        if (tipo == TipoConvite.MEDICO) {
            Medico medico = new Medico();
            medico.setNome(email.split("@")[0]);
            medico.setEmail(email);
            medico.setSenha("123");
            medico.setRole("MEDICO");
            medico.setClinica(clinica);

            if (especialidade != null && !especialidade.isEmpty()) {
                try {
                    medico.setEspecialidade(Especialidade.valueOf(especialidade.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    medico.setEspecialidade(Especialidade.CLINICA_GERAL);
                }
            } else {
                medico.setEspecialidade(Especialidade.CLINICA_GERAL);
            }

            medico.setCrm("CRM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

            medicoRepository.save(medico);
        } else if (tipo == TipoConvite.PACIENTE) {
            // Cria conta de Paciente
            Paciente paciente = new Paciente();
            paciente.setNome(email.split("@")[0]);
            paciente.setEmail(email);
            paciente.setSenha("123");
            paciente.setRole("PACIENTE");
            paciente.setClinica(clinica);

            String uuidNumerico = UUID.randomUUID().toString().replaceAll("[^0-8]", "");
            if (uuidNumerico.length() < 11) {
                uuidNumerico = (uuidNumerico + "00000000000").substring(0, 11);
            } else {
                uuidNumerico = uuidNumerico.substring(0, 11);
            }

            if (medicoId != null) {
                medicoRepository.findById(medicoId).ifPresent(medico -> {
                    paciente.setMedico(medico);
                });
            }

            paciente.setCpf(uuidNumerico);
            paciente.setTelefone("");

            pacienteRepository.save(paciente);
        }

        // Cria o convite
        Convite convite = new Convite();
        convite.setEmail(email);
        convite.setStatus(StatusConvite.ACEITO);
        convite.setTipo(tipo);
        convite.setDataEnvio(LocalDateTime.now());
        convite.setDataExpiracao(LocalDateTime.now().plusDays(7));
        convite.setEnviadoPor(enviadoPor);
        convite.setClinica(clinica);
        convite.setToken(UUID.randomUUID().toString());

        Convite saved = conviteRepository.save(convite);
        return new ConviteDTO(saved.getId(), saved.getEmail(), saved.getStatus(), saved.getTipo(), saved.getDataEnvio(), saved.getEnviadoPor());
    }

    public List<ConviteDTO> obterConvitesPorClinica(Long clinicaId) {
        return conviteRepository.findByClinicaId(clinicaId).stream()
                .map(convite -> new ConviteDTO(convite.getId(), convite.getEmail(), convite.getStatus(), convite.getTipo(), convite.getDataEnvio(), convite.getEnviadoPor()))
                .collect(Collectors.toList());
    }

    public ConviteDTO atualizarStatus(Long conviteId, StatusConvite novoStatus) {
        Convite convite = conviteRepository.findById(conviteId)
                .orElseThrow(() -> new RuntimeException("Convite não encontrado"));

        convite.setStatus(novoStatus);
        Convite updated = conviteRepository.save(convite);
        return new ConviteDTO(updated.getId(), updated.getEmail(), updated.getStatus(), updated.getTipo(), updated.getDataEnvio(), updated.getEnviadoPor());
    }

    public void deletarConvite(Long conviteId) {
        conviteRepository.deleteById(conviteId);
    }
}
