package edu.cit.estrada.somessay.controller;

import edu.cit.estrada.somessay.dto.AuthResponse;
import edu.cit.estrada.somessay.service.AdminService;
import edu.cit.estrada.somessay.service.UserService;
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

    // GET /api/v1/admin/users
    @GetMapping("/users")
    public ResponseEntity<AuthResponse> getAllUsers(Authentication auth) {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // DELETE /api/v1/admin/users/{id}
    @DeleteMapping("/users/{id}")
    public ResponseEntity<AuthResponse> deleteUser(
            @PathVariable Integer id,
            Authentication auth) {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    // GET /api/v1/admin/article
    @GetMapping("/article")
    public ResponseEntity<AuthResponse> getAllArticles(Authentication auth) {
        return ResponseEntity.ok(adminService.getAllArticles());
    }

    // DELETE /api/v1/admin/article/{id}
    @DeleteMapping("/article/{id}")
    public ResponseEntity<AuthResponse> deleteArticle(
            @PathVariable Integer id,
            Authentication auth) {
        return ResponseEntity.ok(adminService.deleteArticle(id));
    }
}