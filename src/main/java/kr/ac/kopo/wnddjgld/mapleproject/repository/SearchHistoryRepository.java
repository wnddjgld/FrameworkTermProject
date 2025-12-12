package kr.ac.kopo.wnddjgld.mapleproject.repository;

import kr.ac.kopo.wnddjgld.mapleproject.entity.SearchHistory;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    // Pageable을 받는 메서드 - List 반환
    List<SearchHistory> findByUserOrderBySearchedAtDesc(User user, Pageable pageable);

    // Pageable 없이 전체 조회
    List<SearchHistory> findByUserOrderBySearchedAtDesc(User user);

    // 상위 10개만 조회
    List<SearchHistory> findTop10ByUserOrderBySearchedAtDesc(User user);

    // 사용자의 모든 검색 기록 삭제
    void deleteByUser(User user);
}