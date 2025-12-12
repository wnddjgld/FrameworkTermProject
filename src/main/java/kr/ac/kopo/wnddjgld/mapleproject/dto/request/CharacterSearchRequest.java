package kr.ac.kopo.wnddjgld.mapleproject.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CharacterSearchRequest {

    @NotBlank(message = "캐릭터명은 필수입니다")
    private String characterName;
}