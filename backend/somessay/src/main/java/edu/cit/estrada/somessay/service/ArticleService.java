package edu.cit.estrada.somessay.service;

import edu.cit.estrada.somessay.dto.*;
import edu.cit.estrada.somessay.entity.*;
import edu.cit.estrada.somessay.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // ── Helpers ──────────────────────────────────────────

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ArticleResponse toResponse(Article article, boolean includeComments) {
        ArticleResponse res = new ArticleResponse();
        res.setArticleId(article.getId());
        res.setTitle(article.getTitle());
        res.setContent(article.getContent());
        res.setCategory(article.getCategory());
        res.setStatus(article.getStatus());
        res.setCoverUrl(article.getCoverUrl());
        res.setAllowLikes(article.getAllowLikes());
        res.setAllowComments(article.getAllowComments());
        res.setCreatedAt(article.getCreatedAt());
        res.setUpdatedAt(article.getUpdatedAt());
        res.setPublishedAt(article.getCreatedAt());
        res.setLikeCount(likeRepository.countByArticle(article));

        // Author
        ArticleResponse.AuthorDto author = new ArticleResponse.AuthorDto();
        author.setUserId(article.getAuthor().getId());
        author.setUsername(article.getAuthor().getUsername());
        author.setProfilePicUrl(article.getAuthor().getProfilePicUrl());
        res.setAuthor(author);

        // Comments
        List<Comment> comments = commentRepository.findByArticleOrderByCreatedAtAsc(article);
        res.setCommentCount(comments.size());

        if (includeComments) {
            res.setComments(comments.stream().map(c -> {
                CommentResponse cr = new CommentResponse();
                cr.setCommentId(c.getId());
                cr.setContent(c.getContent());
                cr.setCreatedAt(c.getCreatedAt());

                ArticleResponse.AuthorDto commentAuthor = new ArticleResponse.AuthorDto();
                commentAuthor.setUserId(c.getAuthor().getId());
                commentAuthor.setUsername(c.getAuthor().getUsername());
                commentAuthor.setProfilePicUrl(c.getAuthor().getProfilePicUrl());
                cr.setAuthor(commentAuthor);

                return cr;
            }).collect(Collectors.toList()));
        }

        return res;
    }

    // ── Article CRUD ──────────────────────────────────────

    public AuthResponse createArticle(ArticleRequest request, String email) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return new AuthResponse("error", "Title is required.", null);
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return new AuthResponse("error", "Content is required.", null);
        }

        User user = getUserByEmail(email);

        Article article = new Article();
        article.setAuthor(user);
        article.setTitle(request.getTitle());
        article.setContent(request.getContent());
        article.setCategory(request.getCategory() != null ? request.getCategory() : "OTHER");
        article.setStatus(request.getStatus() != null ? request.getStatus() : "DRAFT");
        article.setCoverUrl(request.getCoverUrl());
        article.setAllowLikes(request.getAllowLikes() != null ? request.getAllowLikes() : true);
        article.setAllowComments(request.getAllowComments() != null ? request.getAllowComments() : true);

        articleRepository.save(article);

        return new AuthResponse("success", "Article created.", Map.of(
                "articleId", article.getId(),
                "title", article.getTitle(),
                "status", article.getStatus()
        ));
    }

    public AuthResponse getAllArticles() {
        List<ArticleResponse> articles = articleRepository
                .findByStatusOrderByCreatedAtDesc("PUBLISHED")
                .stream()
                .map(a -> toResponse(a, false))
                .collect(Collectors.toList());
        return new AuthResponse("success", null, articles);
    }

    public AuthResponse getArticleById(Integer id) {
        Article article = articleRepository.findById(id)
                .orElse(null);
        if (article == null) {
            return new AuthResponse("error", "Article not found.", null);
        }
        return new AuthResponse("success", null, toResponse(article, true));
    }

    public AuthResponse getMyArticles(Integer userId) {
        User user = userRepository.findById(userId)
                .orElse(null);
        if (user == null) {
            return new AuthResponse("error", "User not found.", null);
        }
        List<ArticleResponse> articles = articleRepository
                .findByAuthorOrderByCreatedAtDesc(user)
                .stream()
                .map(a -> toResponse(a, false))
                .collect(Collectors.toList());
        return new AuthResponse("success", null, articles);
    }

    public AuthResponse updateArticle(Integer id, ArticleRequest request, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) {
            return new AuthResponse("error", "Article not found.", null);
        }
        if (!article.getAuthor().getEmail().equals(email)) {
            return new AuthResponse("error", "You can only edit your own articles.", null);
        }

        if (request.getTitle() != null) article.setTitle(request.getTitle());
        if (request.getContent() != null) article.setContent(request.getContent());
        if (request.getCategory() != null) article.setCategory(request.getCategory());
        if (request.getStatus() != null) article.setStatus(request.getStatus());
        if (request.getCoverUrl() != null) article.setCoverUrl(request.getCoverUrl());
        if (request.getAllowLikes() != null) article.setAllowLikes(request.getAllowLikes());
        if (request.getAllowComments() != null) article.setAllowComments(request.getAllowComments());
        article.setUpdatedAt(LocalDateTime.now());

        articleRepository.save(article);
        return new AuthResponse("success", "Article updated.", Map.of(
                "articleId", article.getId(),
                "updatedAt", article.getUpdatedAt().toString()
        ));
    }

    @Transactional
    public AuthResponse deleteArticle(Integer id, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) {
            return new AuthResponse("error", "Article not found.", null);
        }
        if (!article.getAuthor().getEmail().equals(email)) {
            return new AuthResponse("error", "You can only delete your own articles.", null);
        }

        commentRepository.deleteByArticle(article);
        likeRepository.deleteByArticle(article);
        articleRepository.delete(article);
        return new AuthResponse("success", "Article deleted.", null);
    }

    // ── Likes ─────────────────────────────────────────────

    public AuthResponse likeArticle(Integer id, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new AuthResponse("error", "Article not found.", null);
        if (!article.getAllowLikes()) return new AuthResponse("error", "Likes are disabled.", null);

        User user = getUserByEmail(email);
        if (likeRepository.existsByArticleAndUser(article, user)) {
            return new AuthResponse("error", "Already liked.", null);
        }

        Like like = new Like();
        like.setArticle(article);
        like.setUser(user);
        likeRepository.save(like);

        // ✅ Send like notification email to article owner
        // Only send if the liker is not the owner
        if (!article.getAuthor().getEmail().equals(email)) {
            emailService.sendLikeNotificationEmail(
                    article.getAuthor().getEmail(),
                    article.getAuthor().getUsername(),
                    user.getUsername(),
                    article.getTitle()
            );
        }

        return new AuthResponse("success", "Post liked.", Map.of(
                "articleId", article.getId(),
                "likeCount", likeRepository.countByArticle(article)
        ));
    }

    public AuthResponse unlikeArticle(Integer id, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new AuthResponse("error", "Article not found.", null);

        User user = getUserByEmail(email);
        Like like = likeRepository.findByArticleAndUser(article, user).orElse(null);
        if (like == null) return new AuthResponse("error", "Not liked yet.", null);

        likeRepository.delete(like);
        return new AuthResponse("success", "Like removed.", Map.of(
                "articleId", article.getId(),
                "likeCount", likeRepository.countByArticle(article)
        ));
    }

    // ── Comments ──────────────────────────────────────────

    public AuthResponse addComment(Integer id, CommentRequest request, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new AuthResponse("error", "Article not found.", null);
        if (!article.getAllowComments()) return new AuthResponse("error", "Comments are disabled.", null);
        if (request.getContent() == null || request.getContent().isBlank()) {
            return new AuthResponse("error", "Comment cannot be empty.", null);
        }

        User user = getUserByEmail(email);
        Comment comment = new Comment();
        comment.setArticle(article);
        comment.setAuthor(user);
        comment.setContent(request.getContent());
        commentRepository.save(comment);

        CommentResponse cr = new CommentResponse();
        cr.setCommentId(comment.getId());
        cr.setContent(comment.getContent());
        cr.setCreatedAt(comment.getCreatedAt());

        ArticleResponse.AuthorDto author = new ArticleResponse.AuthorDto();
        author.setUserId(user.getId());
        author.setUsername(user.getUsername());
        cr.setAuthor(author);

        // ✅ Send comment notification email to article owner
        // Only send if the commenter is not the owner
        if (!article.getAuthor().getEmail().equals(email)) {
            emailService.sendCommentNotificationEmail(
                    article.getAuthor().getEmail(),
                    article.getAuthor().getUsername(),
                    user.getUsername(),
                    article.getTitle()
            );
        }

        return new AuthResponse("success", "Comment added.", cr);
    }

    public AuthResponse deleteComment(Integer commentId, String email) {
        Comment comment = commentRepository.findById(commentId).orElse(null);
        if (comment == null) return new AuthResponse("error", "Comment not found.", null);
        if (!comment.getAuthor().getEmail().equals(email)) {
            return new AuthResponse("error", "You can only delete your own comments.", null);
        }

        commentRepository.delete(comment);
        return new AuthResponse("success", "Comment deleted.", null);
    }

    // ── Search ────────────────────────────────────────────

    public AuthResponse searchArticles(String keyword) {
        List<ArticleResponse> articles = articleRepository
                .findByTitleContainingIgnoreCaseAndStatus(keyword, "PUBLISHED")
                .stream()
                .map(a -> toResponse(a, false))
                .collect(Collectors.toList());
        return new AuthResponse("success", null, articles);
    }
}