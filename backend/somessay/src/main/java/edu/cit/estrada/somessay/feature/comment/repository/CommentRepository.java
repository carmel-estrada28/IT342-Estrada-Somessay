package edu.cit.estrada.somessay.feature.comment.repository;

import edu.cit.estrada.somessay.feature.article.entity.Article;
import edu.cit.estrada.somessay.feature.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByArticleOrderByCreatedAtAsc(Article article);
    void deleteByArticle(Article article);
}