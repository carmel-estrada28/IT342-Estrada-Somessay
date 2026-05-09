package edu.cit.estrada.somessay.feature.admin;

import edu.cit.estrada.somessay.feature.article.entity.Article;
import edu.cit.estrada.somessay.feature.article.repository.ArticleRepository;
import edu.cit.estrada.somessay.feature.comment.repository.CommentRepository;
import edu.cit.estrada.somessay.feature.like.repository.LikeRepository;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    public ApiResponse getAllArticles() {
        List<Article> articles = articleRepository.findAll();
        List<Map<String, String>> result = articles.stream()
                .map(a -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("articleId", String.valueOf(a.getId()));
                    map.put("title", a.getTitle());
                    map.put("author", a.getAuthor().getUsername());
                    map.put("category", a.getCategory() != null ? a.getCategory() : "");
                    map.put("status", a.getStatus() != null ? a.getStatus() : "");
                    map.put("createdAt", a.getCreatedAt().toString());
                    return map;
                })
                .collect(Collectors.toList());
        return new ApiResponse("success", null, result);
    }

    @Transactional
    public ApiResponse deleteArticle(Integer id) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new ApiResponse("error", "Article not found.", null);
        commentRepository.deleteByArticle(article);
        likeRepository.deleteByArticle(article);
        articleRepository.delete(article);
        return new ApiResponse("success", "Article deleted.", null);
    }
}