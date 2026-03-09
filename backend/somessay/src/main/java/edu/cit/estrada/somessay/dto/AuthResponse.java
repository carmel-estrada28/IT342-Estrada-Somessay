package edu.cit.estrada.somessay.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String status;
    private String message;
    private Object data;
}
