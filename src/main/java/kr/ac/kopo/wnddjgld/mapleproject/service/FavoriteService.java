package kr.ac.kopo.wnddjgld.mapleproject.service;

import kr.ac.kopo.wnddjgld.mapleproject.entity.Favorite;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    /**
     * 즐겨찾기 추가
     */
    @Transactional
    public Favorite addFavorite(User user, String characterName, String ocid,
                                String worldName, String characterClass, Integer characterLevel) {
        // 중복 체크
        if (favoriteRepository.existsByUserAndCharacterName(user, characterName)) {
            throw new IllegalArgumentException("이미 즐겨찾기에 추가된 캐릭터입니다");
        }

        Favorite favorite = Favorite.builder()
                .user(user)
                .characterName(characterName)
                .ocid(ocid)
                .worldName(worldName)
                .characterClass(characterClass)
                .characterLevel(characterLevel)
                .build();

        return favoriteRepository.save(favorite);
    }

    /**
     * 즐겨찾기 삭제
     */
    @Transactional
    public void removeFavorite(User user, Long favoriteId) {
        Favorite favorite = favoriteRepository.findById(favoriteId)
                .orElseThrow(() -> new IllegalArgumentException("즐겨찾기를 찾을 수 없습니다"));

        // 본인의 즐겨찾기인지 확인
        if (!favorite.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다");
        }

        favoriteRepository.delete(favorite);
    }

    /**
     * 사용자의 즐겨찾기 목록 조회
     */
    public List<Favorite> getUserFavorites(User user) {
        return favoriteRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * 즐겨찾기 여부 확인
     */
    public boolean isFavorite(User user, String characterName) {
        return favoriteRepository.existsByUserAndCharacterName(user, characterName);
    }

    /**
     * 캐릭터 이름으로 즐겨찾기 삭제
     */
    @Transactional
    public void removeFavoriteByName(User user, String characterName) {
        Favorite favorite = favoriteRepository.findByUserAndCharacterName(user, characterName)
                .orElseThrow(() -> new IllegalArgumentException("즐겨찾기를 찾을 수 없습니다"));

        favoriteRepository.delete(favorite);
    }
}