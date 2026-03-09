package edu.cit.estrada.somessay.repository;

import edu.cit.estrada.somessay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);
}
