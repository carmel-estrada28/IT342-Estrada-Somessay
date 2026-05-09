package edu.cit.estrada.somessay.service;

import edu.cit.estrada.somessay.dto.ArticleResponse;
import edu.cit.estrada.somessay.dto.AuthResponse;
import edu.cit.estrada.somessay.entity.Article;
import edu.cit.estrada.somessay.repository.ArticleRepository;
import edu.cit.estrada.somessay.repository.CommentRepository;
import edu.cit.estrada.somessay.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    public AuthResponse getAllArticles() {
        List<Article> articles = articleRepository.findAll();
        List<Map<String, String>> result = articles.stream()
                .map(a -> {
                    Map<String, String> map = new java.util.HashMap<>();
                    map.put("articleId", String.valueOf(a.getId()));
                    map.put("title", a.getTitle());
                    map.put("author", a.getAuthor().getUsername());
                    map.put("category", a.getCategory() != null ? a.getCategory() : "");
                    map.put("status", a.getStatus() != null ? a.getStatus() : "");
                    map.put("createdAt", a.getCreatedAt().toString());
                    return map;
                })
                .collect(Collectors.toList());
        return new AuthResponse("success", null, result);
    }

    @Transactional
    public AuthResponse deleteArticle(Integer id) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new AuthResponse("error", "Article not found.", null);
        commentRepository.deleteByArticle(article);
        likeRepository.deleteByArticle(article);
        articleRepository.delete(article);
        return new AuthResponse("success", "Article deleted.", null);
    }
}