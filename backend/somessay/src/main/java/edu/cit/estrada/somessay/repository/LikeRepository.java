package edu.cit.estrada.somessay.repository;

import edu.cit.estrada.somessay.entity.Article;
import edu.cit.estrada.somessay.entity.Like;
import edu.cit.estrada.somessay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    int countByArticle(Article article);
    Optional<Like> findByArticleAndUser(Article article, User user);
    boolean existsByArticleAndUser(Article article, User user);
    void deleteByArticle(Article article);
    List<Like> findByArticleOrderByCreatedAtDesc(Article article);
}