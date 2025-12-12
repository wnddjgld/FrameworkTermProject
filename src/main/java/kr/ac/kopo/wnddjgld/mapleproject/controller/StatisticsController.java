package kr.ac.kopo.wnddjgld.mapleproject.controller;

import kr.ac.kopo.wnddjgld.mapleproject.dto.response.ClassStatisticsResponse;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.PopularCharacterResponse;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.WorldPopulationResponse;
import kr.ac.kopo.wnddjgld.mapleproject.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * 통계 관련 REST API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    /**
     * 월드별 인구 통계 조회
     * GET /api/statistics/world-population
     */
    @GetMapping("/world-population")
    public Mono<ResponseEntity<WorldPopulationResponse.WorldStats>> getWorldPopulation() {
        log.info("GET /api/statistics/world-population");

        return statisticsService.getWorldPopulationStats()
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 인기 캐릭터 랭킹 조회
     * GET /api/statistics/popular-characters?limit=10
     */
    @GetMapping("/popular-characters")
    public Flux<PopularCharacterResponse> getPopularCharacters(
            @RequestParam(defaultValue = "10") int limit) {
        log.info("GET /api/statistics/popular-characters?limit={}", limit);

        return statisticsService.getPopularCharacters(limit);
    }

    /**
     * 직업별 통계 조회
     * GET /api/statistics/class-statistics
     */
    @GetMapping("/class-statistics")
    public Flux<ClassStatisticsResponse> getClassStatistics() {
        log.info("GET /api/statistics/class-statistics");

        return statisticsService.getClassStatistics();
    }
}
