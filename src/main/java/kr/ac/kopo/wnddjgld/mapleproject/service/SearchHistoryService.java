package kr.ac.kopo.wnddjgld.mapleproject.service;

import kr.ac.kopo.wnddjgld.mapleproject.entity.SearchHistory;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchHistoryService {

    private final SearchHistoryRepository searchHistoryRepository;

    /**
     * 검색 기록 추가
     */
    @Transactional
    public SearchHistory addSearchHistory(User user, String characterName, String ocid,
                                          String worldName, String characterClass, Integer characterLevel) {
        SearchHistory history = SearchHistory.builder()
                .user(user)
                .characterName(characterName)
                .ocid(ocid)
                .worldName(worldName)
                .characterClass(characterClass)
                .characterLevel(characterLevel)
                .build();

        return searchHistoryRepository.save(history);
    }

    /**
     * 사용자의 최근 검색 기록 조회 (최대 limit개)
     */
    public List<SearchHistory> getRecentSearchHistory(User user, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return searchHistoryRepository.findByUserOrderBySearchedAtDesc(user, pageable);
    }

    /**
     * 사용자의 모든 검색 기록 조회
     */
    public List<SearchHistory> getAllSearchHistory(User user) {
        return searchHistoryRepository.findByUserOrderBySearchedAtDesc(user);
    }

    /**
     * 검색 기록 삭제 (개별)
     */
    @Transactional
    public void deleteSearchHistory(User user, Long historyId) {
        SearchHistory history = searchHistoryRepository.findById(historyId)
                .orElseThrow(() -> new IllegalArgumentException("검색 기록을 찾을 수 없습니다"));

        // 본인의 검색 기록인지 확인
        if (!history.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("권한이 없습니다");
        }

        searchHistoryRepository.delete(history);
    }

    /**
     * 사용자의 모든 검색 기록 삭제
     */
    @Transactional
    public void deleteAllSearchHistory(User user) {
        searchHistoryRepository.deleteByUser(user);
    }
}