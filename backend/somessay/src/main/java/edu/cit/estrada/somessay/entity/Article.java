package edu.cit.estrada.somessay.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "posts")
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 20)
    private String category;

    @Column(length = 20)
    private String status = "DRAFT";

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(name = "allow_likes")
    private Boolean allowLikes = true;

    @Column(name = "allow_comments")
    private Boolean allowComments = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}