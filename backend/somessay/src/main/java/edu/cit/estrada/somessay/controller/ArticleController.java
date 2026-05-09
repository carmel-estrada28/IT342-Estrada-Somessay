package edu.cit.estrada.somessay.controller;

import edu.cit.estrada.somessay.dto.ArticleRequest;
import edu.cit.estrada.somessay.dto.AuthResponse;
import edu.cit.estrada.somessay.dto.CommentRequest;
import edu.cit.estrada.somessay.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ArticleController {

    private final ArticleService articleService;

    // ── Articles ──────────────────────────────────────────

    @PostMapping("/article")
    public ResponseEntity<AuthResponse> createArticle(
            @RequestBody ArticleRequest request,
            Authentication auth) {
        return ResponseEntity.ok(articleService.createArticle(request, auth.getName()));
    }

    @GetMapping("/article")
    public ResponseEntity<AuthResponse> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @GetMapping("/article/{id}")
    public ResponseEntity<AuthResponse> getArticleById(@PathVariable Integer id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    @GetMapping("/article/user/{userId}")
    public ResponseEntity<AuthResponse> getMyArticles(@PathVariable Integer userId) {
        return ResponseEntity.ok(articleService.getMyArticles(userId));
    }

    @PutMapping("/article/{id}")
    public ResponseEntity<AuthResponse> updateArticle(
            @PathVariable Integer id,
            @RequestBody ArticleRequest request,
            Authentication auth) {
        return ResponseEntity.ok(articleService.updateArticle(id, request, auth.getName()));
    }

    @DeleteMapping("/article/{id}")
    public ResponseEntity<AuthResponse> deleteArticle(
            @PathVariable Integer id,
            Authentication auth) {
        return ResponseEntity.ok(articleService.deleteArticle(id, auth.getName()));
    }

    // ── Search ────────────────────────────────────────────

    @GetMapping("/article/search")
    public ResponseEntity<AuthResponse> searchArticles(@RequestParam String keyword) {
        return ResponseEntity.ok(articleService.searchArticles(keyword));
    }

    // ── Likes ─────────────────────────────────────────────

    @PostMapping("/article/{id}/like")
    public ResponseEntity<AuthResponse> likeArticle(
            @PathVariable Integer id,
            Authentication auth) {
        return ResponseEntity.ok(articleService.likeArticle(id, auth.getName()));
    }

    @DeleteMapping("/article/{id}/like")
    public ResponseEntity<AuthResponse> unlikeArticle(
            @PathVariable Integer id,
            Authentication auth) {
        return ResponseEntity.ok(articleService.unlikeArticle(id, auth.getName()));
    }

    // ── Comments ──────────────────────────────────────────

    @PostMapping("/article/{id}/comments")
    public ResponseEntity<AuthResponse> addComment(
            @PathVariable Integer id,
            @RequestBody CommentRequest request,
            Authentication auth) {
        return ResponseEntity.ok(articleService.addComment(id, request, auth.getName()));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<AuthResponse> deleteComment(
            @PathVariable Integer commentId,
            Authentication auth) {
        return ResponseEntity.ok(articleService.deleteComment(commentId, auth.getName()));
    }
}