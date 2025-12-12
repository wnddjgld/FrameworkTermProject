package kr.ac.kopo.wnddjgld.mapleproject.repository;

import kr.ac.kopo.wnddjgld.mapleproject.entity.Favorite;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserOrderByCreatedAtDesc(User user);

    Optional<Favorite> findByUserAndCharacterName(User user, String characterName);

    boolean existsByUserAndCharacterName(User user, String characterName);

    void deleteByUserAndCharacterName(User user, String characterName);
}