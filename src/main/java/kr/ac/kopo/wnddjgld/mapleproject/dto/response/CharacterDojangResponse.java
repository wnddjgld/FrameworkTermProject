package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CharacterDojangResponse {
    private String date;

    @JsonProperty("character_class")
    private String characterClass;

    @JsonProperty("world_name")
    private String worldName;

    @JsonProperty("dojang_best_floor")
    private Integer dojangBestFloor;

    @JsonProperty("date_dojang_record")
    private String dateDojangRecord;

    @JsonProperty("dojang_best_time")
    private Integer dojangBestTime;
}
