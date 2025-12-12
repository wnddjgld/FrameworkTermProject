package kr.ac.kopo.wnddjgld.mapleproject.controller;

import kr.ac.kopo.wnddjgld.mapleproject.entity.SearchHistory;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.service.SearchHistoryService;
import kr.ac.kopo.wnddjgld.mapleproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search-history")
@RequiredArgsConstructor
public class SearchHistoryController {

    private final SearchHistoryService searchHistoryService;
    private final UserService userService;

    /**
     * 최근 검색 기록 조회 (기본 20개)
     */
    @GetMapping
    public ResponseEntity<List<SearchHistory>> getRecentSearchHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "20") int limit) {

        User user = userService.findByUsername(userDetails.getUsername());
        List<SearchHistory> history = searchHistoryService.getRecentSearchHistory(user, limit);
        return ResponseEntity.ok(history);
    }

    /**
     * 모든 검색 기록 조회
     */
    @GetMapping("/all")
    public ResponseEntity<List<SearchHistory>> getAllSearchHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername());
        List<SearchHistory> history = searchHistoryService.getAllSearchHistory(user);
        return ResponseEntity.ok(history);
    }

    /**
     * 검색 기록 삭제 (개별)
     */
    @DeleteMapping("/{historyId}")
    public ResponseEntity<Map<String, String>> deleteSearchHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long historyId) {

        User user = userService.findByUsername(userDetails.getUsername());
        searchHistoryService.deleteSearchHistory(user, historyId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "검색 기록이 삭제되었습니다");
        return ResponseEntity.ok(response);
    }

    /**
     * 모든 검색 기록 삭제
     */
    @DeleteMapping("/all")
    public ResponseEntity<Map<String, String>> deleteAllSearchHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userService.findByUsername(userDetails.getUsername());
        searchHistoryService.deleteAllSearchHistory(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "모든 검색 기록이 삭제되었습니다");
        return ResponseEntity.ok(response);
    }
}