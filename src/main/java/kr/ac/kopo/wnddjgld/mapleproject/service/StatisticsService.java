package kr.ac.kopo.wnddjgld.mapleproject.service;

import kr.ac.kopo.wnddjgld.mapleproject.dto.response.ClassStatisticsResponse;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.PopularCharacterResponse;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.WorldPopulationResponse;
import kr.ac.kopo.wnddjgld.mapleproject.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

/**
 * 통계 관련 서비스
 * - 월드별 인구 통계
 * - 인기 캐릭터 랭킹
 * - 직업별 통계
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final SearchHistoryRepository searchHistoryRepository;
    private final Random random = new Random();

    /**
     * 월드별 인구 통계 조회
     * TODO: 실제 데이터는 넥슨 API에서 제공하지 않으므로, 자체 DB 통계나 크롤링 필요
     */
    public Mono<WorldPopulationResponse.WorldStats> getWorldPopulationStats() {
        log.info("Fetching world population statistics");

        // 임시 데이터 (실제로는 DB에서 조회)
        List<WorldPopulationResponse> worldStats = Arrays.asList(
                WorldPopulationResponse.builder()
                        .worldName("리부트")
                        .population(312969L)
                        .changeRate(-8.73)
                        .build(),
                WorldPopulationResponse.builder()
                        .worldName("베라")
                        .population(45320L)
                        .changeRate(2.15)
                        .build(),
                WorldPopulationResponse.builder()
                        .worldName("크로아")
                        .population(38250L)
                        .changeRate(-1.20)
                        .build(),
                WorldPopulationResponse.builder()
                        .worldName("스카니아")
                        .population(56780L)
                        .changeRate(0.55)
                        .build(),
                WorldPopulationResponse.builder()
                        .worldName("루나")
                        .population(42150L)
                        .changeRate(-0.35)
                        .build()
        );

        long totalPopulation = worldStats.stream()
                .mapToLong(WorldPopulationResponse::getPopulation)
                .sum();

        return Mono.just(WorldPopulationResponse.WorldStats.builder()
                .worlds(worldStats)
                .totalPopulation(totalPopulation)
                .build());
    }

    /**
     * 인기 캐릭터 랭킹 조회 (검색 기록 기반)
     */
    public Flux<PopularCharacterResponse> getPopularCharacters(int limit) {
        log.info("Fetching popular characters, limit: {}", limit);

        // 최근 7일간 검색 기록 기반으로 인기 캐릭터 조회
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);

        // TODO: 실제로는 SearchHistory에서 Group By로 집계
        // 임시 데이터
        List<PopularCharacterResponse> popularCharacters = Arrays.asList(
                PopularCharacterResponse.builder()
                        .ranking(1)
                        .characterName("융도도리")
                        .worldName("리부트")
                        .characterClass("아델")
                        .characterLevel(279)
                        .searchCount(1250L)
                        .build(),
                PopularCharacterResponse.builder()
                        .ranking(2)
                        .characterName("검은호")
                        .worldName("리부트")
                        .characterClass("나이트로드")
                        .characterLevel(293)
                        .searchCount(980L)
                        .build(),
                PopularCharacterResponse.builder()
                        .ranking(3)
                        .characterName("햄찡")
                        .worldName("리부트")
                        .characterClass("소울마스터")
                        .characterLevel(288)
                        .searchCount(875L)
                        .build(),
                PopularCharacterResponse.builder()
                        .ranking(4)
                        .characterName("리즈초롱")
                        .worldName("베라")
                        .characterClass("비숍")
                        .characterLevel(287)
                        .searchCount(720L)
                        .build(),
                PopularCharacterResponse.builder()
                        .ranking(5)
                        .characterName("9922")
                        .worldName("리부트")
                        .characterClass("패스파인더")
                        .characterLevel(200)
                        .searchCount(650L)
                        .build()
        );

        return Flux.fromIterable(popularCharacters)
                .take(limit);
    }

    /**
     * 직업별 통계 조회
     * TODO: 실제 데이터는 자체 DB에서 수집된 캐릭터 정보 기반
     */
    public Flux<ClassStatisticsResponse> getClassStatistics() {
        log.info("Fetching class statistics");

        // 임시 데이터
        List<ClassStatisticsResponse> classStats = Arrays.asList(
                ClassStatisticsResponse.builder()
                        .className("아델")
                        .characterCount(25340L)
                        .percentage(8.5)
                        .averageLevel(220)
                        .build(),
                ClassStatisticsResponse.builder()
                        .className("나이트로드")
                        .characterCount(18250L)
                        .percentage(6.1)
                        .averageLevel(235)
                        .build(),
                ClassStatisticsResponse.builder()
                        .className("소울마스터")
                        .characterCount(15780L)
                        .percentage(5.3)
                        .averageLevel(225)
                        .build(),
                ClassStatisticsResponse.builder()
                        .className("비숍")
                        .characterCount(22150L)
                        .percentage(7.4)
                        .averageLevel(210)
                        .build(),
                ClassStatisticsResponse.builder()
                        .className("히어로")
                        .characterCount(19560L)
                        .percentage(6.5)
                        .averageLevel(228)
                        .build()
        );

        return Flux.fromIterable(classStats);
    }
}
