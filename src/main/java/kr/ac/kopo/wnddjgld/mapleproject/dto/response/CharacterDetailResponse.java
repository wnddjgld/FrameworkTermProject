package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 캐릭터 상세 정보 응답 DTO (기본 정보 + 스탯)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CharacterDetailResponse {

    private String ocid;
    private CharacterBasicResponse basicInfo;
    private CharacterStatResponse statInfo;
}
