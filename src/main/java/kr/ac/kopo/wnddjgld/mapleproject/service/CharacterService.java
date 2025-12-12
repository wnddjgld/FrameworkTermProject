package kr.ac.kopo.wnddjgld.mapleproject.service;

import kr.ac.kopo.wnddjgld.mapleproject.client.NexonApiClient;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.*;
import kr.ac.kopo.wnddjgld.mapleproject.entity.SearchHistory;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.exception.CharacterNotFoundException;
import kr.ac.kopo.wnddjgld.mapleproject.repository.SearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CharacterService {

    private final NexonApiClient nexonApiClient;
    private final SearchHistoryRepository searchHistoryRepository;

    /**
     * 캐릭터 검색 (OCID 조회)
     */
    public Mono<String> searchCharacter(String characterName) {
        return nexonApiClient.getCharacterOcid(characterName)
                .map(OcidResponse::getOcid)
                .onErrorResume(error -> {
                    log.error("Character not found: {}", characterName);
                    return Mono.error(new CharacterNotFoundException("캐릭터를 찾을 수 없습니다: " + characterName));
                });
    }

    /**
     * 캐릭터 기본 정보 조회 (검색 기록 저장 포함)
     */
    public Mono<CharacterResponse> getCharacterBasicInfo(String characterName, User user) {
        return searchCharacter(characterName)
                .flatMap(ocid -> nexonApiClient.getCharacterBasic(ocid)
                        .map(basicInfo -> {
                            // 검색 기록 저장 (로그인한 경우만)
                            if (user != null) {
                                saveSearchHistory(user, basicInfo);
                            }
                            return mapToCharacterResponse(ocid, basicInfo);
                        }))
                .onErrorResume(error -> {
                    log.error("Failed to get character info: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 상세 정보 조회 (기본 정보 + 스탯)
     */
    public Mono<CharacterDetailResponse> getCharacterDetailInfo(String ocid) {
        Mono<CharacterBasicResponse> basicInfo = nexonApiClient.getCharacterBasic(ocid);
        Mono<CharacterStatResponse> statInfo = nexonApiClient.getCharacterStat(ocid);

        return Mono.zip(basicInfo, statInfo)
                .map(tuple -> {
                    CharacterBasicResponse basic = tuple.getT1();
                    CharacterStatResponse stat = tuple.getT2();

                    return CharacterDetailResponse.builder()
                            .ocid(ocid)
                            .basicInfo(basic)
                            .statInfo(stat)
                            .build();
                });
    }

    /**
     * 캐릭터 장비 정보 조회
     */
    public Mono<CharacterEquipmentResponse> getCharacterEquipment(String ocid, String preset) {
        return nexonApiClient.getCharacterEquipment(ocid, preset)
                .onErrorResume(error -> {
                    log.error("Failed to get character equipment: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 장비 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 스킬 정보 조회
     */
    public Mono<CharacterSkillResponse> getCharacterSkill(String ocid, String skillGrade) {
        return nexonApiClient.getCharacterSkill(ocid, skillGrade)
                .onErrorResume(error -> {
                    log.error("Failed to get character skill: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 스킬 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 큐브 사용 내역 조회
     */
    public Mono<CubeHistoryResponse> getCubeHistory(String ocid, String count, String date, String cursor) {
        return nexonApiClient.getCubeHistory(count, date, cursor, ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get cube history: {}", error.getMessage());
                    return Mono.just(CubeHistoryResponse.builder().build());
                });
    }

    /**
     * 캐릭터 어빌리티 정보 조회
     */
    public Mono<Object> getCharacterAbility(String ocid) {
        return nexonApiClient.getCharacterAbility(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character ability: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 어빌리티 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 하이퍼스탯 정보 조회
     */
    public Mono<Object> getCharacterHyperStat(String ocid) {
        return nexonApiClient.getCharacterHyperStat(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character hyper stat: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 하이퍼스탯 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 심볼 정보 조회 (구버전 - Object 반환)
     */
    public Mono<Object> getCharacterSymbol(String ocid) {
        return nexonApiClient.getCharacterSymbol(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character symbol: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 심볼 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 심볼 장비 정보 조회 (상세 정보 포함)
     */
    public Mono<CharacterSymbolEquipmentResponse> getCharacterSymbolEquipment(String ocid) {
        return nexonApiClient.getCharacterSymbolEquipment(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character symbol equipment: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 심볼 장비 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 인기도 정보 조회
     */
    public Mono<Object> getCharacterPopularity(String ocid) {
        return nexonApiClient.getCharacterPopularity(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character popularity: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 인기도 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 헥사 매트릭스 정보 조회
     */
    public Mono<Object> getCharacterHexaMatrix(String ocid) {
        return nexonApiClient.getCharacterHexaMatrix(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character hexa matrix: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 헥사 매트릭스 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 헥사 매트릭스 스탯 정보 조회
     */
    public Mono<Object> getCharacterHexaMatrixStat(String ocid) {
        return nexonApiClient.getCharacterHexaMatrixStat(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character hexa matrix stat: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 헥사 매트릭스 스탯 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 펫 장비 정보 조회
     */
    public Mono<CharacterPetEquipmentResponse> getCharacterPetEquipment(String ocid) {
        return nexonApiClient.getCharacterPetEquipment(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character pet equipment: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 펫 장비 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 세트 효과 정보 조회
     */
    public Mono<CharacterSetEffectResponse> getCharacterSetEffect(String ocid) {
        return nexonApiClient.getCharacterSetEffect(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character set effect: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 세트 효과 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 무릉도장 정보 조회
     */
    public Mono<CharacterDojangResponse> getCharacterDojang(String ocid) {
        return nexonApiClient.getCharacterDojang(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character dojang: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 무릉도장 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 캐릭터 캐시 장비 정보 조회
     */
    public Mono<CharacterCashItemEquipmentResponse> getCharacterCashItemEquipment(String ocid) {
        return nexonApiClient.getCharacterCashItemEquipment(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get character cash item equipment: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("캐릭터 캐시 장비 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 유니온 정보 조회
     */
    public Mono<UserUnionResponse> getUserUnion(String ocid) {
        return nexonApiClient.getUserUnion(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get union info: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("유니온 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 업적 정보 조회
     */
    public Mono<UserAchievementResponse> getUserAchievement(String ocid) {
        return nexonApiClient.getUserAchievement(ocid)
                .onErrorResume(error -> {
                    log.error("Failed to get achievement info: {}", error.getMessage());
                    return Mono.error(new CharacterNotFoundException("업적 정보를 가져올 수 없습니다"));
                });
    }

    /**
     * 검색 기록 저장
     */
    private void saveSearchHistory(User user, CharacterBasicResponse basicInfo) {
        try {
            SearchHistory history = SearchHistory.builder()
                    .user(user)
                    .characterName(basicInfo.getCharacterName())
                    .worldName(basicInfo.getWorldName())
                    .characterClass(basicInfo.getCharacterClass())
                    .characterLevel(basicInfo.getCharacterLevel())
                    .searchedAt(LocalDateTime.now())
                    .build();

            searchHistoryRepository.save(history);
            log.info("Search history saved for user: {}, character: {}",
                    user.getUsername(), basicInfo.getCharacterName());
        } catch (Exception e) {
            log.error("Failed to save search history", e);
        }
    }

    /**
     * CharacterBasicResponse를 CharacterResponse로 변환
     */
    private CharacterResponse mapToCharacterResponse(String ocid, CharacterBasicResponse basicInfo) {
        return CharacterResponse.builder()
                .ocid(ocid)
                .characterName(basicInfo.getCharacterName())
                .worldName(basicInfo.getWorldName())
                .characterClass(basicInfo.getCharacterClass())
                .characterLevel(basicInfo.getCharacterLevel())
                .characterExp(basicInfo.getCharacterExp() != null ? basicInfo.getCharacterExp().toString() : "0")
                .build();
    }
}
