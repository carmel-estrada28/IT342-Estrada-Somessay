package edu.cit.estrada.somessay.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ArticleResponse {
    private Integer articleId;
    private String title;
    private String content;
    private String category;
    private String status;
    private String coverUrl;
    private Boolean allowLikes;
    private Boolean allowComments;
    private AuthorDto author;
    private int likeCount;
    private int commentCount;
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;

    @Data
    public static class AuthorDto {
        private Integer userId;
        private String username;
        private String profilePicUrl;
    }
}