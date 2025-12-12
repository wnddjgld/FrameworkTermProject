package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 인기 캐릭터 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PopularCharacterResponse {

    private Integer ranking;
    private String characterName;
    private String worldName;
    private String characterClass;
    private Integer characterLevel;
    private Long searchCount; // 검색 횟수
}
