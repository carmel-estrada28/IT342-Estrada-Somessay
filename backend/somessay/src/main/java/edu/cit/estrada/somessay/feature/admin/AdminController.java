package edu.cit.estrada.somessay.feature.admin;

import edu.cit.estrada.somessay.feature.user.UserService;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserService userService;
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers(Authentication auth) {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(
            @PathVariable Integer id, Authentication auth) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @GetMapping("/article")
    public ResponseEntity<ApiResponse> getAllArticles(Authentication auth) {
        return ResponseEntity.ok(adminService.getAllArticles());
    }

    @DeleteMapping("/article/{id}")
    public ResponseEntity<ApiResponse> deleteArticle(
            @PathVariable Integer id, Authentication auth) {
        return ResponseEntity.ok(adminService.deleteArticle(id));
    }
}