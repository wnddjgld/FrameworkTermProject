package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CharacterResponse {

    private String ocid;
    private String characterName;
    private String worldName;
    private String characterClass;
    private Integer characterLevel;
    private String characterExp;
    // 추가 필드는 넥슨 API 응답에 따라 확장
}