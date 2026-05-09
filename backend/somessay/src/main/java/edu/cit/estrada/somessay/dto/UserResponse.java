package edu.cit.estrada.somessay.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Integer userId;
    private String username;
    private String email;
    private String role;
    private String bio;
    private String profilePicUrl;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}