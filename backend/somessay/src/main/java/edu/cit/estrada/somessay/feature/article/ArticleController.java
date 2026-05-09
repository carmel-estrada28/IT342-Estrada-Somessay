package edu.cit.estrada.somessay.feature.article;

import edu.cit.estrada.somessay.feature.article.dto.ArticleRequest;
import edu.cit.estrada.somessay.feature.comment.dto.CommentRequest;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
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

    @PostMapping("/article")
    public ResponseEntity<ApiResponse> createArticle(
            @RequestBody ArticleRequest request, Authentication auth) {
        return ResponseEntity.ok(articleService.createArticle(request, auth.getName()));
    }

    @GetMapping("/article")
    public ResponseEntity<ApiResponse> getAllArticles() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @GetMapping("/article/{id}")
    public ResponseEntity<ApiResponse> getArticleById(@PathVariable Integer id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }

    @GetMapping("/article/user/{userId}")
    public ResponseEntity<ApiResponse> getMyArticles(@PathVariable Integer userId) {
        return ResponseEntity.ok(articleService.getMyArticles(userId));
    }

    @PutMapping("/article/{id}")
    public ResponseEntity<ApiResponse> updateArticle(
            @PathVariable Integer id,
            @RequestBody ArticleRequest request,
            Authentication auth) {
        return ResponseEntity.ok(articleService.updateArticle(id, request, auth.getName()));
    }

    @DeleteMapping("/article/{id}")
    public ResponseEntity<ApiResponse> deleteArticle(
            @PathVariable Integer id, Authentication auth) {
        return ResponseEntity.ok(articleService.deleteArticle(id, auth.getName()));
    }

    @GetMapping("/article/search")
    public ResponseEntity<ApiResponse> searchArticles(@RequestParam String keyword) {
        return ResponseEntity.ok(articleService.searchArticles(keyword));
    }

    @PostMapping("/article/{id}/like")
    public ResponseEntity<ApiResponse> likeArticle(
            @PathVariable Integer id, Authentication auth) {
        return ResponseEntity.ok(articleService.likeArticle(id, auth.getName()));
    }

    @DeleteMapping("/article/{id}/like")
    public ResponseEntity<ApiResponse> unlikeArticle(
            @PathVariable Integer id, Authentication auth) {
        return ResponseEntity.ok(articleService.unlikeArticle(id, auth.getName()));
    }

    @PostMapping("/article/{id}/comments")
    public ResponseEntity<ApiResponse> addComment(
            @PathVariable Integer id,
            @RequestBody CommentRequest request,
            Authentication auth) {
        return ResponseEntity.ok(articleService.addComment(id, request, auth.getName()));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse> deleteComment(
            @PathVariable Integer commentId, Authentication auth) {
        return ResponseEntity.ok(articleService.deleteComment(commentId, auth.getName()));
    }
}