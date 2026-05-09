package edu.cit.estrada.somessay.repository;

import edu.cit.estrada.somessay.entity.Article;
import edu.cit.estrada.somessay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Integer> {
    List<Article> findByStatusOrderByCreatedAtDesc(String status);
    List<Article> findByAuthorOrderByCreatedAtDesc(User author);
    List<Article> findByAuthorAndStatusOrderByCreatedAtDesc(User author, String status);
    List<Article> findByTitleContainingIgnoreCaseAndStatus(String keyword, String status);
}