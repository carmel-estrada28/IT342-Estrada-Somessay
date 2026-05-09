package edu.cit.estrada.somessay.feature.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}