package edu.cit.estrada.somessay.service;

import edu.cit.estrada.somessay.dto.AuthResponse;
import edu.cit.estrada.somessay.dto.UpdateProfileRequest;
import edu.cit.estrada.somessay.dto.UserResponse;
import edu.cit.estrada.somessay.entity.User;
import edu.cit.estrada.somessay.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import edu.cit.estrada.somessay.repository.ArticleRepository;
import edu.cit.estrada.somessay.repository.LikeRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final LikeRepository likeRepository;

    // ── Helper ────────────────────────────────────────────

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

    // ── /me ───────────────────────────────────────────────

    public AuthResponse getMe(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return new AuthResponse("error", "User not found.", null);
        return new AuthResponse("success", null, toResponse(user));
    }

    // ── Update Profile ────────────────────────────────────

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return new AuthResponse("error", "User not found.", null);

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            // Check if username is taken by someone else
            User existing = userRepository.findByUsername(request.getUsername()).orElse(null);
            if (existing != null && !existing.getId().equals(user.getId())) {
                return new AuthResponse("error", "Username already taken.", null);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfilePicUrl() != null) user.setProfilePicUrl(request.getProfilePicUrl());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return new AuthResponse("success", "Profile updated.", toResponse(user));
    }

    // ── Admin ─────────────────────────────────────────────

    public AuthResponse getAllUsers() {
        List<UserResponse> users = userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return new AuthResponse("success", null, users);
    }

    public AuthResponse deleteUser(Integer id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return new AuthResponse("error", "User not found.", null);
        userRepository.delete(user);
        return new AuthResponse("success", "User deleted.", null);
    }

    public AuthResponse getUserActivity(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return new AuthResponse("error", "User not found.", null);

        // Get all articles by this user
        List<edu.cit.estrada.somessay.entity.Article> articles =
                articleRepository.findByAuthorOrderByCreatedAtDesc(user);

        // Get all likes on those articles
        List<Map<String, Object>> activities = new java.util.ArrayList<>();

        for (edu.cit.estrada.somessay.entity.Article article : articles) {
            List<edu.cit.estrada.somessay.entity.Like> likes =
                    likeRepository.findByArticleOrderByCreatedAtDesc(article);

            for (edu.cit.estrada.somessay.entity.Like like : likes) {
                // Don't include self-likes
                if (like.getUser().getId().equals(userId)) continue;

                Map<String, Object> activity = new java.util.HashMap<>();
                activity.put("fromUsername", like.getUser().getUsername());
                activity.put("fromUserId", like.getUser().getId());
                activity.put("fromProfilePicUrl", like.getUser().getProfilePicUrl()); // ✅ add this
                activity.put("articleId", article.getId());
                activity.put("articleTitle", article.getTitle());
                activity.put("createdAt", like.getCreatedAt().toString());
                activities.add(activity);
            }
        }

        // Sort by createdAt descending
        activities.sort((a, b) ->
                b.get("createdAt").toString().compareTo(a.get("createdAt").toString()));

        return new AuthResponse("success", null, activities);
    }
}