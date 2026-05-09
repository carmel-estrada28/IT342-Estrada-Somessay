package edu.cit.estrada.somessay.feature.like.entity;

import edu.cit.estrada.somessay.feature.article.entity.Article;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "likes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"}))
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Article article;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}