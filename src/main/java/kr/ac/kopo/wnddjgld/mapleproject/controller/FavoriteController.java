package kr.ac.kopo.wnddjgld.mapleproject.controller;

import kr.ac.kopo.wnddjgld.mapleproject.entity.Favorite;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.service.FavoriteService;
import kr.ac.kopo.wnddjgld.mapleproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserService userService;

    /**
     * 즐겨찾기 추가
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> addFavorite(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> request) {

        User user = userService.findByUsername(userDetails.getUsername());
        String characterName = (String) request.get("characterName");

        // ocid, worldName 등이 없어도 일단 characterName만으로 저장
        favoriteService.addFavorite(
                user,
                characterName,
                (String) request.getOrDefault("ocid", ""),
                (String) request.getOrDefault("worldName", ""),
                (String) request.getOrDefault("characterClass", ""),
                request.containsKey("characterLevel") ? (Integer) request.get("characterLevel") : 0
        );

        Map<String, String> response = new HashMap<>();
        response.put("message", "즐겨찾기에 추가되었습니다");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * 즐겨찾기 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<Favorite>> getFavorites(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername());
        List<Favorite> favorites = favoriteService.getUserFavorites(user);
        return ResponseEntity.ok(favorites);
    }

    /**
     * 즐겨찾기 삭제
     */
    @DeleteMapping
    public ResponseEntity<Map<String, String>> removeFavorite(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> request) {

        User user = userService.findByUsername(userDetails.getUsername());
        String characterName = request.get("characterName");

        // characterName으로 삭제하도록 서비스 메서드 호출
        favoriteService.removeFavoriteByName(user, characterName);

        Map<String, String> response = new HashMap<>();
        response.put("message", "즐겨찾기가 삭제되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 즐겨찾기 여부 확인
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String characterName) {

        User user = userService.findByUsername(userDetails.getUsername());
        boolean isFavorite = favoriteService.isFavorite(user, characterName);

        Map<String, Boolean> response = new HashMap<>();
        response.put("isFavorite", isFavorite);
        return ResponseEntity.ok(response);
    }
}