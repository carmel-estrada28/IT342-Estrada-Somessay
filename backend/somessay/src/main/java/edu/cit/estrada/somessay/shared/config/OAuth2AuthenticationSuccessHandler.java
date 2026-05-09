package edu.cit.estrada.somessay.shared.config;

import edu.cit.estrada.somessay.feature.auth.entity.Role;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import edu.cit.estrada.somessay.feature.auth.repository.RoleRepository;
import edu.cit.estrada.somessay.feature.auth.repository.UserRepository;
import edu.cit.estrada.somessay.shared.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2AuthenticationSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name  = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(generateUsername(name));
            newUser.setProfilePicUrl(picture);
            newUser.setPasswordHash(null);
            newUser.setRole(userRole);
            newUser.setIsVerified(true);
            newUser.setCreatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getId(),
                user.getUsername(),
                user.getRole() != null ? user.getRole().getName() : "USER"
        );

        String redirectUrl = frontendUrl + "/oauth2/redirect?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }

    private String generateUsername(String fullName) {
        String base = fullName.toLowerCase()
                .replaceAll("\\s+", "_")
                .replaceAll("[^a-z0-9_]", "");
        String candidate = base;
        int i = 1;
        while (userRepository.existsByUsername(candidate)) {
            candidate = base + i++;
        }
        return candidate;
    }
}