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
public class CharacterCashItemEquipmentResponse {
    private String date;

    @JsonProperty("character_gender")
    private String characterGender;

    @JsonProperty("character_class")
    private String characterClass;

    @JsonProperty("preset_no")
    private Integer presetNo;

    @JsonProperty("cash_item_equipment_base")
    private List<CashItem> cashItemEquipmentBase;

    @JsonProperty("cash_item_equipment_preset_1")
    private List<CashItem> cashItemEquipmentPreset1;

    @JsonProperty("cash_item_equipment_preset_2")
    private List<CashItem> cashItemEquipmentPreset2;

    @JsonProperty("cash_item_equipment_preset_3")
    private List<CashItem> cashItemEquipmentPreset3;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashItem {
        @JsonProperty("cash_item_equipment_part")
        private String cashItemEquipmentPart;

        @JsonProperty("cash_item_equipment_slot")
        private String cashItemEquipmentSlot;

        @JsonProperty("cash_item_name")
        private String cashItemName;

        @JsonProperty("cash_item_icon")
        private String cashItemIcon;

        @JsonProperty("cash_item_description")
        private String cashItemDescription;

        @JsonProperty("cash_item_option")
        private List<CashItemOption> cashItemOption;

        @JsonProperty("date_expire")
        private String dateExpire;

        @JsonProperty("date_option_expire")
        private String dateOptionExpire;

        @JsonProperty("cash_item_label")
        private String cashItemLabel;

        @JsonProperty("cash_item_coloring_prism")
        private ColoringPrism cashItemColoringPrism;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashItemOption {
        @JsonProperty("option_type")
        private String optionType;

        @JsonProperty("option_value")
        private String optionValue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ColoringPrism {
        @JsonProperty("color_range")
        private String colorRange;

        @JsonProperty("hue")
        private Integer hue;

        @JsonProperty("saturation")
        private Integer saturation;

        @JsonProperty("value")
        private Integer value;
    }
}
