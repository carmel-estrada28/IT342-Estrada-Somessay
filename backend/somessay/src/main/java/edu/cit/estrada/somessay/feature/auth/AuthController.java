package edu.cit.estrada.somessay.feature.auth;

import edu.cit.estrada.somessay.feature.auth.dto.LoginRequest;
import edu.cit.estrada.somessay.feature.auth.dto.RegisterRequest;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final TokenBlacklistService tokenBlacklistService; // ← add this

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        tokenBlacklistService.blacklist(token); // ← lowercase, instance call
        return ResponseEntity.ok(new ApiResponse("success", "Logged out successfully.", null));
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }
}