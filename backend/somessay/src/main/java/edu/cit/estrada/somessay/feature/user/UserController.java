package edu.cit.estrada.somessay.feature.user;

import edu.cit.estrada.somessay.feature.user.dto.UpdateProfileRequest;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
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

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getMe(Authentication auth) {
        return ResponseEntity.ok(userService.getMe(auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProfile(
            @PathVariable Integer id,
            @RequestBody UpdateProfileRequest request,
            Authentication auth) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(
            @PathVariable Integer id,
            Authentication auth) {
        return ResponseEntity.ok(userService.getMe(auth.getName()));
    }

    @GetMapping("/{userId}/activity")
    public ResponseEntity<ApiResponse> getUserActivity(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.getUserActivity(userId));
    }
}