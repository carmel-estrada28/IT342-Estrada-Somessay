package edu.cit.estrada.somessay.feature.user;

import edu.cit.estrada.somessay.feature.article.entity.Article;
import edu.cit.estrada.somessay.feature.article.repository.ArticleRepository;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import edu.cit.estrada.somessay.feature.auth.repository.UserRepository;
import edu.cit.estrada.somessay.feature.like.entity.Like;
import edu.cit.estrada.somessay.feature.like.repository.LikeRepository;
import edu.cit.estrada.somessay.feature.user.dto.UpdateProfileRequest;
import edu.cit.estrada.somessay.feature.user.dto.UserResponse;
import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import edu.cit.estrada.somessay.feature.comment.entity.Comment;
import edu.cit.estrada.somessay.feature.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    private UserResponse toResponse(User user) {
        UserResponse res = new UserResponse();
        res.setUserId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setRole(user.getRole() != null ? user.getRole().getName() : "USER");
        res.setBio(user.getBio());
        res.setProfilePicUrl(user.getProfilePicUrl());
        res.setIsVerified(user.getIsVerified());
        res.setCreatedAt(user.getCreatedAt());
        return res;
    }

    public ApiResponse getMe(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return new ApiResponse("error", "User not found.", null);
        return new ApiResponse("success", null, toResponse(user));
    }

    public ApiResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return new ApiResponse("error", "User not found.", null);

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            User existing = userRepository.findByUsername(request.getUsername()).orElse(null);
            if (existing != null && !existing.getId().equals(user.getId())) {
                return new ApiResponse("error", "Username already taken.", null);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfilePicUrl() != null) user.setProfilePicUrl(request.getProfilePicUrl());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return new ApiResponse("success", "Profile updated.", toResponse(user));
    }

    public ApiResponse getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return new ApiResponse("success", null, users);
    }

    public ApiResponse deleteUser(Integer id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return new ApiResponse("error", "User not found.", null);
        userRepository.delete(user);
        return new ApiResponse("success", "User deleted.", null);
    }

    public ApiResponse getUserActivity(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return new ApiResponse("error", "User not found.", null);

        List<Article> articles = articleRepository.findByAuthorOrderByCreatedAtDesc(user);
        List<Map<String, Object>> activities = new ArrayList<>();

        for (Article article : articles) {
            // existing likes loop — keep as is
            List<Like> likes = likeRepository.findByArticleOrderByCreatedAtDesc(article);
            for (Like like : likes) {
                if (like.getUser().getId().equals(userId)) continue;

                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "like");  // ← add this line too
                activity.put("fromUsername", like.getUser().getUsername());
                activity.put("fromUserId", like.getUser().getId());
                activity.put("fromProfilePicUrl", like.getUser().getProfilePicUrl());
                activity.put("articleId", article.getId());
                activity.put("articleTitle", article.getTitle());
                activity.put("createdAt", like.getCreatedAt().toString());
                activities.add(activity);
            }

            List<Comment> comments = commentRepository.findByArticleOrderByCreatedAtAsc(article);
            for (Comment comment : comments) {
                if (comment.getAuthor().getId().equals(userId)) continue;

                Map<String, Object> activity = new HashMap<>();
                activity.put("type", "comment");
                activity.put("fromUsername", comment.getAuthor().getUsername());
                activity.put("fromUserId", comment.getAuthor().getId());
                activity.put("fromProfilePicUrl", comment.getAuthor().getProfilePicUrl());
                activity.put("articleId", article.getId());
                activity.put("articleTitle", article.getTitle());
                activity.put("commentContent", comment.getContent());
                activity.put("createdAt", comment.getCreatedAt().toString());
                activities.add(activity);
            }
        }

        activities.sort((a, b) ->
                b.get("createdAt").toString().compareTo(a.get("createdAt").toString()));

        return new ApiResponse("success", null, activities);
    }
}