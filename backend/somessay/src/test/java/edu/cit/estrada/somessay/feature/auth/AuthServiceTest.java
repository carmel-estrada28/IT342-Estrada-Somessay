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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private EmailService emailService;

    @InjectMocks private AuthService authService;

    private Role userRole;
    private User testUser;

    @BeforeEach
    void setUp() {
        userRole = new Role();
        userRole.setId(1);
        userRole.setName("USER");

        testUser = new User();
        testUser.setId(1);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPasswordHash("hashedpassword");
        testUser.setRole(userRole);
    }

    // ── Register Tests ────────────────────────────────────

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode(anyString())).thenReturn("hashedpassword");
        when(userRepository.save(any())).thenReturn(testUser);

        ApiResponse response = authService.register(request);

        assertEquals("success", response.getStatus());
        verify(emailService, times(1)).sendWelcomeEmail(anyString(), anyString());
    }

    @Test
    void register_EmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        request.setUsername("newuser");
        request.setPassword("password123");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        ApiResponse response = authService.register(request);

        assertEquals("error", response.getStatus());
        assertEquals("Email already exists.", response.getMessage());
    }

    @Test
    void register_UsernameAlreadyTaken() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("new@example.com");
        request.setUsername("existinguser");
        request.setPassword("password123");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        ApiResponse response = authService.register(request);

        assertEquals("error", response.getStatus());
        assertEquals("Username already taken.", response.getMessage());
    }

    // ── Login Tests ───────────────────────────────────────

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
        when(jwtUtil.generateToken(anyString(), any(), anyString(), anyString()))
                .thenReturn("mock-jwt-token");

        ApiResponse response = authService.login(request);

        assertEquals("success", response.getStatus());
        assertNotNull(response.getData());
    }

    @Test
    void login_InvalidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        ApiResponse response = authService.login(request);

        assertEquals("error", response.getStatus());
        assertEquals("Invalid email or password.", response.getMessage());
    }

    @Test
    void login_UserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("notfound@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        ApiResponse response = authService.login(request);

        assertEquals("error", response.getStatus());
    }
}