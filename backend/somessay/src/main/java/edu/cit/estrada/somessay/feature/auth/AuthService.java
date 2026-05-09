package edu.cit.estrada.somessay.feature.auth;

import edu.cit.estrada.somessay.feature.auth.dto.LoginRequest;
import edu.cit.estrada.somessay.feature.auth.dto.RegisterRequest;
import edu.cit.estrada.somessay.feature.auth.entity.Role;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import edu.cit.estrada.somessay.feature.auth.repository.RoleRepository;
import edu.cit.estrada.somessay.feature.auth.repository.UserRepository;
import edu.cit.estrada.somessay.feature.user.EmailService;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import edu.cit.estrada.somessay.shared.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse("error", "Email already exists.", null);
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return new ApiResponse("error", "Username already taken.", null);
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setIsVerified(false);

        userRepository.save(user);

        emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());

        return new ApiResponse("success", "Registration successful.", Map.of(
                "username", user.getUsername(),
                "email", user.getEmail()
        ));
    }

    public ApiResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return new ApiResponse("error", "Invalid email or password.", null);
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getUsername(),
                user.getRole().getName()
        );

        return new ApiResponse("success", "Login successful.", Map.of(
                "token", token,
                "userId", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().getName()
        ));
    }
}