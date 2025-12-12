package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class CharacterStatResponse {
    @JsonProperty("character_class")
    private String characterClass;

    @JsonProperty("final_stat")
    private List<StatDetail> finalStat;

    @Data
    public static class StatDetail {
        @JsonProperty("stat_name")
        private String statName;

        @JsonProperty("stat_value")
        private String statValue;
    }
}