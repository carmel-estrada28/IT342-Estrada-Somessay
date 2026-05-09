package edu.cit.estrada.somessay.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private String bio;
    private String profilePicUrl;
}