package edu.cit.estrada.somessay.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Integer commentId;
    private String content;
    private LocalDateTime createdAt;
    private ArticleResponse.AuthorDto author;
}