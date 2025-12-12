package kr.ac.kopo.wnddjgld.mapleproject.controller;

import kr.ac.kopo.wnddjgld.mapleproject.dto.response.*;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.service.CharacterService;
import kr.ac.kopo.wnddjgld.mapleproject.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

/**
 * 캐릭터 관련 REST API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {

    private final CharacterService characterService;
    private final UserService userService;

    /**
     * 캐릭터 검색 (기본 정보) - 로그인한 경우 자동으로 검색 기록 저장
     * GET /api/characters/search?name=캐릭터명
     */
    @GetMapping("/search")
    public Mono<ResponseEntity<CharacterResponse>> searchCharacter(
            @RequestParam("name") String name,
            @AuthenticationPrincipal UserDetails userDetails) {

        log.info("GET /api/characters/search?name={}", name);

        User user = null;
        if (userDetails != null) {
            user = userService.findByUsername(userDetails.getUsername());
        }

        User finalUser = user;
        return characterService.getCharacterBasicInfo(name, finalUser)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 OCID 조회
     * GET /api/characters/ocid?name=캐릭터명
     */
    @GetMapping("/ocid")
    public Mono<ResponseEntity<String>> getCharacterOcid(
            @RequestParam("name") String name) {

        log.info("GET /api/characters/ocid?name={}", name);

        return characterService.searchCharacter(name)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 상세 정보 조회 (기본 정보 + 스탯)
     * GET /api/characters/{ocid}/detail
     */
    @GetMapping("/{ocid}/detail")
    public Mono<ResponseEntity<CharacterDetailResponse>> getCharacterDetail(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/detail", ocid);

        return characterService.getCharacterDetailInfo(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 장비 정보 조회
     * GET /api/characters/{ocid}/equipment?preset=1
     */
    @GetMapping("/{ocid}/equipment")
    public Mono<ResponseEntity<CharacterEquipmentResponse>> getCharacterEquipment(
            @PathVariable("ocid") String ocid,
            @RequestParam(value = "preset", required = false) String preset) {

        log.info("GET /api/characters/{}/equipment?preset={}", ocid, preset);

        return characterService.getCharacterEquipment(ocid, preset)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 스킬 정보 조회
     * GET /api/characters/{ocid}/skill?grade=5
     */
    @GetMapping("/{ocid}/skill")
    public Mono<ResponseEntity<CharacterSkillResponse>> getCharacterSkill(
            @PathVariable("ocid") String ocid,
            @RequestParam(value = "grade", defaultValue = "5") String grade) {

        log.info("GET /api/characters/{}/skill?grade={}", ocid, grade);

        return characterService.getCharacterSkill(ocid, grade)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 큐브 사용 내역 조회
     * GET /api/characters/{ocid}/cube-history?count=10&date=2024-01-01
     */
    @GetMapping("/{ocid}/cube-history")
    public Mono<ResponseEntity<CubeHistoryResponse>> getCubeHistory(
            @PathVariable("ocid") String ocid,
            @RequestParam(value = "count", required = false) String count,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "cursor", required = false) String cursor) {

        log.info("GET /api/characters/{}/cube-history", ocid);

        return characterService.getCubeHistory(ocid, count, date, cursor)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 어빌리티 정보 조회
     * GET /api/characters/{ocid}/ability
     */
    @GetMapping("/{ocid}/ability")
    public Mono<ResponseEntity<Object>> getCharacterAbility(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/ability", ocid);

        return characterService.getCharacterAbility(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 하이퍼스탯 정보 조회
     * GET /api/characters/{ocid}/hyper-stat
     */
    @GetMapping("/{ocid}/hyper-stat")
    public Mono<ResponseEntity<Object>> getCharacterHyperStat(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/hyper-stat", ocid);

        return characterService.getCharacterHyperStat(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 심볼 정보 조회
     * GET /api/characters/{ocid}/symbol
     */
    @GetMapping("/{ocid}/symbol")
    public Mono<ResponseEntity<Object>> getCharacterSymbol(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/symbol", ocid);

        return characterService.getCharacterSymbol(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 인기도 정보 조회
     * GET /api/characters/{ocid}/popularity
     */
    @GetMapping("/{ocid}/popularity")
    public Mono<ResponseEntity<Object>> getCharacterPopularity(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/popularity", ocid);

        return characterService.getCharacterPopularity(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 헥사 매트릭스 정보 조회
     * GET /api/characters/{ocid}/hexamatrix
     */
    @GetMapping("/{ocid}/hexamatrix")
    public Mono<ResponseEntity<Object>> getCharacterHexaMatrix(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/hexamatrix", ocid);

        return characterService.getCharacterHexaMatrix(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 헥사 매트릭스 스탯 정보 조회
     * GET /api/characters/{ocid}/hexamatrix-stat
     */
    @GetMapping("/{ocid}/hexamatrix-stat")
    public Mono<ResponseEntity<Object>> getCharacterHexaMatrixStat(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/hexamatrix-stat", ocid);

        return characterService.getCharacterHexaMatrixStat(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 펫 장비 정보 조회
     * GET /api/characters/{ocid}/pet-equipment
     */
    @GetMapping("/{ocid}/pet-equipment")
    public Mono<ResponseEntity<CharacterPetEquipmentResponse>> getCharacterPetEquipment(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/pet-equipment", ocid);

        return characterService.getCharacterPetEquipment(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 세트 효과 정보 조회
     * GET /api/characters/{ocid}/set-effect
     */
    @GetMapping("/{ocid}/set-effect")
    public Mono<ResponseEntity<CharacterSetEffectResponse>> getCharacterSetEffect(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/set-effect", ocid);

        return characterService.getCharacterSetEffect(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 심볼 장비 정보 조회 (상세 정보 포함)
     * GET /api/characters/{ocid}/symbol-equipment
     */
    @GetMapping("/{ocid}/symbol-equipment")
    public Mono<ResponseEntity<CharacterSymbolEquipmentResponse>> getCharacterSymbolEquipment(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/symbol-equipment", ocid);

        return characterService.getCharacterSymbolEquipment(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 무릉도장 정보 조회
     * GET /api/characters/{ocid}/dojang
     */
    @GetMapping("/{ocid}/dojang")
    public Mono<ResponseEntity<CharacterDojangResponse>> getCharacterDojang(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/dojang", ocid);

        return characterService.getCharacterDojang(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 캐릭터 캐시 장비 정보 조회
     * GET /api/characters/{ocid}/cash-equipment
     */
    @GetMapping("/{ocid}/cash-equipment")
    public Mono<ResponseEntity<CharacterCashItemEquipmentResponse>> getCharacterCashEquipment(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/cash-equipment", ocid);

        return characterService.getCharacterCashItemEquipment(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 유니온 정보 조회
     * GET /api/characters/{ocid}/union
     */
    @GetMapping("/{ocid}/union")
    public Mono<ResponseEntity<UserUnionResponse>> getUserUnion(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/union", ocid);

        return characterService.getUserUnion(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * 업적 정보 조회
     * GET /api/characters/{ocid}/achievement
     */
    @GetMapping("/{ocid}/achievement")
    public Mono<ResponseEntity<UserAchievementResponse>> getUserAchievement(
            @PathVariable("ocid") String ocid) {

        log.info("GET /api/characters/{}/achievement", ocid);

        return characterService.getUserAchievement(ocid)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
