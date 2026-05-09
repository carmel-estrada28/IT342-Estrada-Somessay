package edu.cit.estrada.somessay.feature.comment.dto;

import edu.cit.estrada.somessay.feature.article.dto.ArticleResponse;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Integer commentId;
    private String content;
    private LocalDateTime createdAt;
    private ArticleResponse.AuthorDto author;
}