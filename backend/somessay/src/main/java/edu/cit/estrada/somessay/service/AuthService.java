package edu.cit.estrada.somessay.service;

import edu.cit.estrada.somessay.dto.AuthResponse;
import edu.cit.estrada.somessay.dto.LoginRequest;
import edu.cit.estrada.somessay.dto.RegisterRequest;
import edu.cit.estrada.somessay.entity.Role;
import edu.cit.estrada.somessay.entity.User;
import edu.cit.estrada.somessay.repository.RoleRepository;
import edu.cit.estrada.somessay.repository.UserRepository;
import edu.cit.estrada.somessay.security.JwtUtil;
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

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("error", "Email already exists.", null);
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse("error", "Username already taken.", null);
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

        return new AuthResponse("success", "Registration successful.", Map.of(
                "username", user.getUsername(),
                "email", user.getEmail()
        ));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            return new AuthResponse("error", "Invalid email or password.", null);
        }

        // ✅ Now passing userId, username, role into the token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getUsername(),
                user.getRole().getName()
        );

        return new AuthResponse("success", "Login successful.", Map.of(
                "token", token,
                "userId", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().getName()
        ));
    }
}
