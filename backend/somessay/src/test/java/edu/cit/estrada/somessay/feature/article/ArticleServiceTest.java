package edu.cit.estrada.somessay.feature.article;

import edu.cit.estrada.somessay.feature.article.dto.ArticleRequest;
import edu.cit.estrada.somessay.feature.article.entity.Article;
import edu.cit.estrada.somessay.feature.article.repository.ArticleRepository;
import edu.cit.estrada.somessay.feature.auth.entity.Role;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import edu.cit.estrada.somessay.feature.auth.repository.UserRepository;
import edu.cit.estrada.somessay.feature.comment.dto.CommentRequest;
import edu.cit.estrada.somessay.feature.comment.repository.CommentRepository;
import edu.cit.estrada.somessay.feature.like.entity.Like;
import edu.cit.estrada.somessay.feature.like.repository.LikeRepository;
import edu.cit.estrada.somessay.feature.user.EmailService;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock private ArticleRepository articleRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private LikeRepository likeRepository;
    @Mock private UserRepository userRepository;
    @Mock private EmailService emailService;

    @InjectMocks private ArticleService articleService;

    private User testUser;
    private Article testArticle;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setName("USER");

        testUser = new User();
        testUser.setId(1);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setRole(role);

        testArticle = new Article();
        testArticle.setId(1);
        testArticle.setTitle("Test Article");
        testArticle.setContent("Test content here");
        testArticle.setCategory("ESSAY");
        testArticle.setStatus("PUBLISHED");
        testArticle.setAuthor(testUser);
        testArticle.setAllowLikes(true);
        testArticle.setAllowComments(true);
    }

    // ── Create Article Tests ──────────────────────────────

    @Test
    void createArticle_Success() {
        ArticleRequest request = new ArticleRequest();
        request.setTitle("New Article");
        request.setContent("Some content here");
        request.setCategory("ESSAY");
        request.setStatus("PUBLISHED");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(articleRepository.save(any())).thenReturn(testArticle);

        ApiResponse response = articleService.createArticle(request, "test@example.com");

        assertEquals("success", response.getStatus());
    }

    @Test
    void createArticle_MissingTitle() {
        ArticleRequest request = new ArticleRequest();
        request.setTitle("");
        request.setContent("Some content");

        ApiResponse response = articleService.createArticle(request, "test@example.com");

        assertEquals("error", response.getStatus());
        assertEquals("Title is required.", response.getMessage());
    }

    @Test
    void createArticle_MissingContent() {
        ArticleRequest request = new ArticleRequest();
        request.setTitle("Valid Title");
        request.setContent("");

        ApiResponse response = articleService.createArticle(request, "test@example.com");

        assertEquals("error", response.getStatus());
        assertEquals("Content is required.", response.getMessage());
    }

    // ── Get Article Tests ─────────────────────────────────

    @Test
    void getArticleById_Success() {
        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));
        when(likeRepository.countByArticle(any())).thenReturn(5);
        when(commentRepository.findByArticleOrderByCreatedAtAsc(any())).thenReturn(List.of());

        ApiResponse response = articleService.getArticleById(1);

        assertEquals("success", response.getStatus());
    }

    @Test
    void getArticleById_NotFound() {
        when(articleRepository.findById(999)).thenReturn(Optional.empty());

        ApiResponse response = articleService.getArticleById(999);

        assertEquals("error", response.getStatus());
        assertEquals("Article not found.", response.getMessage());
    }

    @Test
    void getAllArticles_Success() {
        when(articleRepository.findByStatusOrderByCreatedAtDesc("PUBLISHED"))
                .thenReturn(List.of(testArticle));
        when(likeRepository.countByArticle(any())).thenReturn(0);
        when(commentRepository.findByArticleOrderByCreatedAtAsc(any())).thenReturn(List.of());

        ApiResponse response = articleService.getAllArticles();

        assertEquals("success", response.getStatus());
    }

    // ── Delete Article Tests ──────────────────────────────

    @Test
    void deleteArticle_Success() {
        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));

        ApiResponse response = articleService.deleteArticle(1, "test@example.com");

        assertEquals("success", response.getStatus());
    }

    @Test
    void deleteArticle_NotOwner() {
        User otherUser = new User();
        otherUser.setId(2);
        otherUser.setEmail("other@example.com");

        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));

        ApiResponse response = articleService.deleteArticle(1, "other@example.com");

        assertEquals("error", response.getStatus());
    }

    // ── Like Tests ────────────────────────────────────────

    @Test
    void likeArticle_Success() {
        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(likeRepository.existsByArticleAndUser(any(), any())).thenReturn(false);
        when(likeRepository.save(any())).thenReturn(new Like());
        when(likeRepository.countByArticle(any())).thenReturn(1);

        ApiResponse response = articleService.likeArticle(1, "other@example.com");

        assertEquals("success", response.getStatus());
    }

    @Test
    void likeArticle_AlreadyLiked() {
        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(likeRepository.existsByArticleAndUser(any(), any())).thenReturn(true);

        ApiResponse response = articleService.likeArticle(1, "test@example.com");

        assertEquals("error", response.getStatus());
        assertEquals("Already liked.", response.getMessage());
    }

    @Test
    void likeArticle_LikesDisabled() {
        testArticle.setAllowLikes(false);
        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));

        ApiResponse response = articleService.likeArticle(1, "test@example.com");

        assertEquals("error", response.getStatus());
        assertEquals("Likes are disabled.", response.getMessage());
    }

    // ── Comment Tests ─────────────────────────────────────

    @Test
    void addComment_Success() {
        CommentRequest request = new CommentRequest();
        request.setContent("Great article!");

        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(commentRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        ApiResponse response = articleService.addComment(1, request, "test@example.com");

        assertEquals("success", response.getStatus());
    }

    @Test
    void addComment_EmptyContent() {
        CommentRequest request = new CommentRequest();
        request.setContent("");

        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));

        ApiResponse response = articleService.addComment(1, request, "test@example.com");

        assertEquals("error", response.getStatus());
    }

    @Test
    void addComment_CommentsDisabled() {
        testArticle.setAllowComments(false);
        CommentRequest request = new CommentRequest();
        request.setContent("Great article!");

        when(articleRepository.findById(1)).thenReturn(Optional.of(testArticle));

        ApiResponse response = articleService.addComment(1, request, "test@example.com");

        assertEquals("error", response.getStatus());
        assertEquals("Comments are disabled.", response.getMessage());
    }
}