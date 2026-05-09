package edu.cit.estrada.somessay.feature.article.dto;

import lombok.Data;

@Data
public class ArticleRequest {
    private String title;
    private String content;
    private String category;
    private String status;
    private String coverUrl;
    private Boolean allowLikes = true;
    private Boolean allowComments = true;
}