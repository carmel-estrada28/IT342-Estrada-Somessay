package edu.cit.estrada.somessay.feature.article;

import edu.cit.estrada.somessay.feature.article.dto.ArticleRequest;
import edu.cit.estrada.somessay.feature.article.dto.ArticleResponse;
import edu.cit.estrada.somessay.feature.article.entity.Article;
import edu.cit.estrada.somessay.feature.article.repository.ArticleRepository;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import edu.cit.estrada.somessay.feature.auth.repository.UserRepository;
import edu.cit.estrada.somessay.feature.comment.entity.Comment;
import edu.cit.estrada.somessay.feature.comment.dto.CommentRequest;
import edu.cit.estrada.somessay.feature.comment.dto.CommentResponse;
import edu.cit.estrada.somessay.feature.comment.repository.CommentRepository;
import edu.cit.estrada.somessay.feature.like.entity.Like;
import edu.cit.estrada.somessay.feature.like.repository.LikeRepository;
import edu.cit.estrada.somessay.feature.user.EmailService;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
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

        ArticleResponse.AuthorDto author = new ArticleResponse.AuthorDto();
        author.setUserId(article.getAuthor().getId());
        author.setUsername(article.getAuthor().getUsername());
        author.setProfilePicUrl(article.getAuthor().getProfilePicUrl());
        res.setAuthor(author);

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

    public ApiResponse createArticle(ArticleRequest request, String email) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            return new ApiResponse("error", "Title is required.", null);
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            return new ApiResponse("error", "Content is required.", null);
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

        Article saved = articleRepository.save(article);

        return new ApiResponse("success", "Article created.", Map.of(
                "articleId", saved.getId(),
                "title", saved.getTitle(),
                "status", saved.getStatus()
        ));
    }

    public ApiResponse getAllArticles() {
        List<ArticleResponse> articles = articleRepository
                .findByStatusOrderByCreatedAtDesc("PUBLISHED")
                .stream()
                .map(a -> toResponse(a, false))
                .collect(Collectors.toList());
        return new ApiResponse("success", null, articles);
    }

    public ApiResponse getArticleById(Integer id) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new ApiResponse("error", "Article not found.", null);
        return new ApiResponse("success", null, toResponse(article, true));
    }

    public ApiResponse getMyArticles(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return new ApiResponse("error", "User not found.", null);
        List<ArticleResponse> articles = articleRepository
                .findByAuthorOrderByCreatedAtDesc(user)
                .stream()
                .map(a -> toResponse(a, false))
                .collect(Collectors.toList());
        return new ApiResponse("success", null, articles);
    }

    public ApiResponse updateArticle(Integer id, ArticleRequest request, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new ApiResponse("error", "Article not found.", null);
        if (!article.getAuthor().getEmail().equals(email)) {
            return new ApiResponse("error", "You can only edit your own articles.", null);
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
        return new ApiResponse("success", "Article updated.", Map.of(
                "articleId", article.getId(),
                "updatedAt", article.getUpdatedAt().toString()
        ));
    }

    @Transactional
    public ApiResponse deleteArticle(Integer id, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new ApiResponse("error", "Article not found.", null);
        if (!article.getAuthor().getEmail().equals(email)) {
            return new ApiResponse("error", "You can only delete your own articles.", null);
        }
        commentRepository.deleteByArticle(article);
        likeRepository.deleteByArticle(article);
        articleRepository.delete(article);
        return new ApiResponse("success", "Article deleted.", null);
    }

    public ApiResponse likeArticle(Integer id, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new ApiResponse("error", "Article not found.", null);
        if (!article.getAllowLikes()) return new ApiResponse("error", "Likes are disabled.", null);

        User user = getUserByEmail(email);
        if (likeRepository.existsByArticleAndUser(article, user)) {
            return new ApiResponse("error", "Already liked.", null);
        }

        Like like = new Like();
        like.setArticle(article);
        like.setUser(user);
        likeRepository.save(like);

        if (!article.getAuthor().getEmail().equals(email)) {
            emailService.sendLikeNotificationEmail(
                    article.getAuthor().getEmail(),
                    article.getAuthor().getUsername(),
                    user.getUsername(),
                    article.getTitle()
            );
        }

        return new ApiResponse("success", "Post liked.", Map.of(
                "articleId", article.getId(),
                "likeCount", likeRepository.countByArticle(article)
        ));
    }

    public ApiResponse unlikeArticle(Integer id, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new ApiResponse("error", "Article not found.", null);

        User user = getUserByEmail(email);
        Like like = likeRepository.findByArticleAndUser(article, user).orElse(null);
        if (like == null) return new ApiResponse("error", "Not liked yet.", null);

        likeRepository.delete(like);
        return new ApiResponse("success", "Like removed.", Map.of(
                "articleId", article.getId(),
                "likeCount", likeRepository.countByArticle(article)
        ));
    }

    public ApiResponse addComment(Integer id, CommentRequest request, String email) {
        Article article = articleRepository.findById(id).orElse(null);
        if (article == null) return new ApiResponse("error", "Article not found.", null);
        if (!article.getAllowComments()) return new ApiResponse("error", "Comments are disabled.", null);
        if (request.getContent() == null || request.getContent().isBlank()) {
            return new ApiResponse("error", "Comment cannot be empty.", null);
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

        return new ApiResponse("success", "Comment added.", cr);
    }

    public ApiResponse deleteComment(Integer commentId, String email) {
        Comment comment = commentRepository.findById(commentId).orElse(null);
        if (comment == null) return new ApiResponse("error", "Comment not found.", null);
        if (!comment.getAuthor().getEmail().equals(email)) {
            return new ApiResponse("error", "You can only delete your own comments.", null);
        }
        commentRepository.delete(comment);
        return new ApiResponse("success", "Comment deleted.", null);
    }

    public ApiResponse searchArticles(String keyword) {
        List<ArticleResponse> articles = articleRepository
                .findByTitleContainingIgnoreCaseAndStatus(keyword, "PUBLISHED")
                .stream()
                .map(a -> toResponse(a, false))
                .collect(Collectors.toList());
        return new ApiResponse("success", null, articles);
    }
}