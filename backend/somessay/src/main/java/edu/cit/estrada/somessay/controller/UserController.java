package edu.cit.estrada.somessay.controller;

import edu.cit.estrada.somessay.dto.AuthResponse;
import edu.cit.estrada.somessay.dto.UpdateProfileRequest;
import edu.cit.estrada.somessay.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    // GET /api/v1/users/me
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(Authentication auth) {
        return ResponseEntity.ok(userService.getMe(auth.getName()));
    }

    // PUT /api/v1/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<AuthResponse> updateProfile(
            @PathVariable Integer id,
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), request));
    }

    // GET /api/v1/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AuthResponse> getUserById(
            @PathVariable Integer id,
            Authentication auth) {
        return ResponseEntity.ok(userService.getMe(auth.getName()));
    }

    // GET /api/v1/users/{userId}/activity
    @GetMapping("/{userId}/activity")
    public ResponseEntity<AuthResponse> getUserActivity(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.getUserActivity(userId));
    }
}