package kr.ac.kopo.wnddjgld.mapleproject.client;

import kr.ac.kopo.wnddjgld.mapleproject.dto.response.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.DefaultUriBuilderFactory;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
public class NexonApiClient {

    private final WebClient webClient;

    public NexonApiClient(@Value("${nexon.api.key}") String apiKey) {
        DefaultUriBuilderFactory factory = new DefaultUriBuilderFactory("https://open.api.nexon.com/maplestory/v1");
        factory.setEncodingMode(DefaultUriBuilderFactory.EncodingMode.VALUES_ONLY);

        this.webClient = WebClient.builder()
                .uriBuilderFactory(factory)
                .defaultHeader("x-nxopen-api-key", apiKey)
                .defaultHeader("Accept-Charset", StandardCharsets.UTF_8.name())
                .build();
    }

    /**
     * 캐릭터 OCID 조회
     */
    public Mono<OcidResponse> getCharacterOcid(String characterName) {
        log.info("Fetching OCID for character: {}", characterName);

        return webClient.get()
                .uri(uriBuilder -> {
                    var uri = uriBuilder
                            .path("/id")
                            .queryParam("character_name", characterName)
                            .build();
                    log.info("Request URI: {}", uri);
                    return uri;
                })
                .retrieve()
                .onStatus(
                        status -> !status.is2xxSuccessful(),
                        response -> {
                            log.error("HTTP Status: {}", response.statusCode());
                            return response.bodyToMono(String.class)
                                    .doOnNext(body -> log.error("Response body: {}", body))
                                    .then(Mono.error(new RuntimeException("Failed to get OCID: " + response.statusCode())));
                        }
                )
                .bodyToMono(OcidResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved OCID: {}", response.getOcid()))
                .doOnError(error -> log.error("Failed to retrieve OCID for character: {}", characterName, error));
    }

    /**
     * 캐릭터 기본 정보 조회
     */
    public Mono<CharacterBasicResponse> getCharacterBasic(String ocid) {
        log.info("Fetching basic info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/basic")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(CharacterBasicResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved basic info for: {}", response.getCharacterName()))
                .doOnError(error -> log.error("Failed to retrieve basic info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 종합 능력치 조회
     */
    public Mono<CharacterStatResponse> getCharacterStat(String ocid) {
        log.info("Fetching stat info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/stat")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(CharacterStatResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved stat info"))
                .doOnError(error -> log.error("Failed to retrieve stat info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 장비 정보 조회
     */
    public Mono<CharacterEquipmentResponse> getCharacterEquipment(String ocid, String preset) {
        log.info("Fetching equipment info for OCID: {}, preset: {}", ocid, preset);

        return webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .path("/character/item-equipment")
                            .queryParam("ocid", ocid);
                    if (preset != null && !preset.isEmpty()) {
                        builder.queryParam("preset_no", preset);
                    }
                    return builder.build();
                })
                .retrieve()
                .bodyToMono(CharacterEquipmentResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved equipment info"))
                .doOnError(error -> log.error("Failed to retrieve equipment info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 스킬 정보 조회
     */
    public Mono<CharacterSkillResponse> getCharacterSkill(String ocid, String characterSkillGrade) {
        log.info("Fetching skill info for OCID: {}, grade: {}", ocid, characterSkillGrade);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/skill")
                        .queryParam("ocid", ocid)
                        .queryParam("character_skill_grade", characterSkillGrade)
                        .build())
                .retrieve()
                .bodyToMono(CharacterSkillResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved skill info"))
                .doOnError(error -> log.error("Failed to retrieve skill info for OCID: {}", ocid, error));
    }

    /**
     * 큐브 사용 내역 조회
     */
    public Mono<CubeHistoryResponse> getCubeHistory(String count, String date, String cursor, String ocid) {
        log.info("Fetching cube history for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/cube-use/results");
                    if (count != null) builder.queryParam("count", count);
                    if (date != null) builder.queryParam("date", date);
                    if (cursor != null) builder.queryParam("cursor", cursor);
                    if (ocid != null) builder.queryParam("ocid", ocid);
                    return builder.build();
                })
                .retrieve()
                .bodyToMono(CubeHistoryResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved cube history"))
                .doOnError(error -> log.error("Failed to retrieve cube history", error));
    }

    /**
     * 캐릭터 어빌리티 정보 조회
     */
    public Mono<Object> getCharacterAbility(String ocid) {
        log.info("Fetching ability info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/ability")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnSuccess(response -> log.info("Successfully retrieved ability info"))
                .doOnError(error -> log.error("Failed to retrieve ability info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 하이퍼스탯 정보 조회
     */
    public Mono<Object> getCharacterHyperStat(String ocid) {
        log.info("Fetching hyper stat info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/hyper-stat")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnSuccess(response -> log.info("Successfully retrieved hyper stat info"))
                .doOnError(error -> log.error("Failed to retrieve hyper stat info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 심볼 정보 조회
     */
    public Mono<Object> getCharacterSymbol(String ocid) {
        log.info("Fetching symbol info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/symbol-equipment")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnSuccess(response -> log.info("Successfully retrieved symbol info"))
                .doOnError(error -> log.error("Failed to retrieve symbol info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 인기도 정보 조회
     */
    public Mono<Object> getCharacterPopularity(String ocid) {
        log.info("Fetching popularity info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/popularity")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnSuccess(response -> log.info("Successfully retrieved popularity info"))
                .doOnError(error -> log.error("Failed to retrieve popularity info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 헥사 매트릭스 정보 조회
     */
    public Mono<Object> getCharacterHexaMatrix(String ocid) {
        log.info("Fetching hexa matrix info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/hexamatrix")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnSuccess(response -> log.info("Successfully retrieved hexa matrix info"))
                .doOnError(error -> log.error("Failed to retrieve hexa matrix info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 헥사 매트릭스 스탯 정보 조회
     */
    public Mono<Object> getCharacterHexaMatrixStat(String ocid) {
        log.info("Fetching hexa matrix stat info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/hexamatrix-stat")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(Object.class)
                .doOnSuccess(response -> log.info("Successfully retrieved hexa matrix stat info"))
                .doOnError(error -> log.error("Failed to retrieve hexa matrix stat info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 펫 장비 정보 조회
     */
    public Mono<CharacterPetEquipmentResponse> getCharacterPetEquipment(String ocid) {
        log.info("Fetching pet equipment info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/pet-equipment")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(CharacterPetEquipmentResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved pet equipment info"))
                .doOnError(error -> log.error("Failed to retrieve pet equipment info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 세트 효과 정보 조회
     */
    public Mono<CharacterSetEffectResponse> getCharacterSetEffect(String ocid) {
        log.info("Fetching set effect info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/set-effect")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(CharacterSetEffectResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved set effect info"))
                .doOnError(error -> log.error("Failed to retrieve set effect info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 심볼 장비 정보 조회 (능력치 포함)
     */
    public Mono<CharacterSymbolEquipmentResponse> getCharacterSymbolEquipment(String ocid) {
        log.info("Fetching symbol equipment info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/symbol-equipment")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(CharacterSymbolEquipmentResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved symbol equipment info"))
                .doOnError(error -> log.error("Failed to retrieve symbol equipment info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 무릉도장 정보 조회
     */
    public Mono<CharacterDojangResponse> getCharacterDojang(String ocid) {
        log.info("Fetching dojang info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/dojang")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(CharacterDojangResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved dojang info"))
                .doOnError(error -> log.error("Failed to retrieve dojang info for OCID: {}", ocid, error));
    }

    /**
     * 캐릭터 캐시 장비 정보 조회
     */
    public Mono<CharacterCashItemEquipmentResponse> getCharacterCashItemEquipment(String ocid) {
        log.info("Fetching cash item equipment info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/character/cashitem-equipment")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(CharacterCashItemEquipmentResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved cash item equipment info"))
                .doOnError(error -> log.error("Failed to retrieve cash item equipment info for OCID: {}", ocid, error));
    }

    /**
     * 유니온 정보 조회
     */
    public Mono<UserUnionResponse> getUserUnion(String ocid) {
        log.info("Fetching union info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/user/union")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(UserUnionResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved union info"))
                .doOnError(error -> log.error("Failed to retrieve union info for OCID: {}", ocid, error));
    }

    /**
     * 업적 정보 조회 (계정 기반)
     */
    public Mono<UserAchievementResponse> getUserAchievement(String ocid) {
        log.info("Fetching achievement info for OCID: {}", ocid);

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/user/achievement")
                        .queryParam("ocid", ocid)
                        .build())
                .retrieve()
                .bodyToMono(UserAchievementResponse.class)
                .doOnSuccess(response -> log.info("Successfully retrieved achievement info"))
                .doOnError(error -> log.error("Failed to retrieve achievement info for OCID: {}", ocid, error));
    }
}