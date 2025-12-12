package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class CharacterSkillResponse {
    @JsonProperty("character_class")
    private String characterClass;

    @JsonProperty("character_skill_grade")
    private String characterSkillGrade;

    @JsonProperty("character_skill")
    private List<Skill> characterSkill;

    @Data
    public static class Skill {
        @JsonProperty("skill_name")
        private String skillName;

        @JsonProperty("skill_description")
        private String skillDescription;

        @JsonProperty("skill_level")
        private Integer skillLevel;

        @JsonProperty("skill_effect")
        private String skillEffect;

        @JsonProperty("skill_icon")
        private String skillIcon;
    }
}