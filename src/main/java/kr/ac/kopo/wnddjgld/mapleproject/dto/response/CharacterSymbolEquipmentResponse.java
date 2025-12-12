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
public class CharacterSymbolEquipmentResponse {
    private String date;

    @JsonProperty("character_class")
    private String characterClass;

    private List<Symbol> symbol;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Symbol {
        @JsonProperty("symbol_name")
        private String symbolName;

        @JsonProperty("symbol_icon")
        private String symbolIcon;

        @JsonProperty("symbol_description")
        private String symbolDescription;

        @JsonProperty("symbol_force")
        private String symbolForce;

        @JsonProperty("symbol_level")
        private Integer symbolLevel;

        @JsonProperty("symbol_str")
        private String symbolStr;

        @JsonProperty("symbol_dex")
        private String symbolDex;

        @JsonProperty("symbol_int")
        private String symbolInt;

        @JsonProperty("symbol_luk")
        private String symbolLuk;

        @JsonProperty("symbol_hp")
        private String symbolHp;

        @JsonProperty("symbol_drop_rate")
        private String symbolDropRate;

        @JsonProperty("symbol_meso_rate")
        private String symbolMesoRate;

        @JsonProperty("symbol_exp_rate")
        private String symbolExpRate;

        @JsonProperty("symbol_growth_count")
        private Integer symbolGrowthCount;

        @JsonProperty("symbol_require_growth_count")
        private Integer symbolRequireGrowthCount;
    }
}
