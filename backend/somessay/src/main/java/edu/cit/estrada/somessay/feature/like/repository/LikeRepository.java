package edu.cit.estrada.somessay.feature.like.repository;

import edu.cit.estrada.somessay.feature.article.entity.Article;
import edu.cit.estrada.somessay.feature.auth.entity.User;
import edu.cit.estrada.somessay.feature.like.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    int countByArticle(Article article);
    Optional<Like> findByArticleAndUser(Article article, User user);
    boolean existsByArticleAndUser(Article article, User user);
    void deleteByArticle(Article article);
    List<Like> findByArticleOrderByCreatedAtDesc(Article article);
}