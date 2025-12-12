package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CharacterSetEffectResponse {
    private String date;

    @JsonProperty("set_effect")
    private List<SetEffect> setEffect;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SetEffect {
        @JsonProperty("set_name")
        private String setName;

        @JsonProperty("total_set_count")
        private Integer totalSetCount;

        @JsonProperty("set_effect_info")
        private List<SetEffectInfo> setEffectInfo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SetEffectInfo {
        @JsonProperty("set_count")
        private Integer setCount;

        @JsonProperty("set_option")
        private String setOption;
    }
}
