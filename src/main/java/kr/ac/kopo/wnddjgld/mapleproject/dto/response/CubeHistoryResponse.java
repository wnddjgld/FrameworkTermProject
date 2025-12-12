package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 큐브 사용 내역 응답 DTO (넥슨 API)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CubeHistoryResponse {

    @JsonProperty("count")
    private Integer count;

    @JsonProperty("cube_histories")
    private List<CubeHistory> cubeHistories;

    @JsonProperty("next_cursor")
    private String nextCursor;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CubeHistory {

        @JsonProperty("id")
        private String id;

        @JsonProperty("character_name")
        private String characterName;

        @JsonProperty("date_create")
        private String dateCreate;

        @JsonProperty("cube_type")
        private String cubeType;

        @JsonProperty("item_upgrade_result")
        private String itemUpgradeResult;

        @JsonProperty("miracle_time_flag")
        private String miracleTimeFlag;

        @JsonProperty("item_equipment_part")
        private String itemEquipmentPart;

        @JsonProperty("item_level")
        private Integer itemLevel;

        @JsonProperty("target_item")
        private String targetItem;

        @JsonProperty("potential_option_grade")
        private String potentialOptionGrade;

        @JsonProperty("additional_potential_option_grade")
        private String additionalPotentialOptionGrade;

        @JsonProperty("before_potential_options")
        private List<PotentialOption> beforePotentialOptions;

        @JsonProperty("after_potential_options")
        private List<PotentialOption> afterPotentialOptions;

        @JsonProperty("before_additional_potential_options")
        private List<PotentialOption> beforeAdditionalPotentialOptions;

        @JsonProperty("after_additional_potential_options")
        private List<PotentialOption> afterAdditionalPotentialOptions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PotentialOption {

        @JsonProperty("value")
        private String value;

        @JsonProperty("grade")
        private String grade;
    }
}
