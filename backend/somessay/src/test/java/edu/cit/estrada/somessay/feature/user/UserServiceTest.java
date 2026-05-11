package edu.cit.estrada.somessay.feature.user;

import edu.cit.estrada.somessay.feature.article.repository.ArticleRepository;
import edu.cit.estrada.somessay.feature.auth.entity.Role;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import edu.cit.estrada.somessay.feature.auth.repository.UserRepository;
import edu.cit.estrada.somessay.feature.like.repository.LikeRepository;
import edu.cit.estrada.somessay.feature.user.dto.UpdateProfileRequest;
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
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ArticleRepository articleRepository;
    @Mock private LikeRepository likeRepository;

    @InjectMocks private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setName("USER");

        testUser = new User();
        testUser.setId(1);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setRole(role);
        testUser.setBio("Test bio");
    }

    @Test
    void getMe_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));

        ApiResponse response = userService.getMe("test@example.com");

        assertEquals("success", response.getStatus());
        assertNotNull(response.getData());
    }

    @Test
    void getMe_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        ApiResponse response = userService.getMe("notfound@example.com");

        assertEquals("error", response.getStatus());
    }

    @Test
    void updateProfile_Success() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setUsername("newusername");
        request.setBio("New bio");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.empty());
        when(userRepository.save(any())).thenReturn(testUser);

        ApiResponse response = userService.updateProfile("test@example.com", request);

        assertEquals("success", response.getStatus());
    }

    @Test
    void updateProfile_UsernameTaken() {
        User otherUser = new User();
        otherUser.setId(2);
        otherUser.setUsername("takenusername");

        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setUsername("takenusername");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(userRepository.findByUsername(anyString())).thenReturn(Optional.of(otherUser));

        ApiResponse response = userService.updateProfile("test@example.com", request);

        assertEquals("error", response.getStatus());
        assertEquals("Username already taken.", response.getMessage());
    }

    @Test
    void getAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(testUser));

        ApiResponse response = userService.getAllUsers();

        assertEquals("success", response.getStatus());
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));

        ApiResponse response = userService.deleteUser(1);

        assertEquals("success", response.getStatus());
        verify(userRepository, times(1)).delete(testUser);
    }

    @Test
    void deleteUser_NotFound() {
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        ApiResponse response = userService.deleteUser(999);

        assertEquals("error", response.getStatus());
    }
}