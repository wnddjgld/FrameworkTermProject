package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class CharacterEquipmentResponse {
    @JsonProperty("character_gender")
    private String characterGender;

    @JsonProperty("character_class")
    private String characterClass;

    @JsonProperty("item_equipment")
    private List<Equipment> itemEquipment;

    @Data
    public static class Equipment {
        @JsonProperty("item_equipment_part")
        private String itemEquipmentPart;

        @JsonProperty("item_equipment_slot")
        private String itemEquipmentSlot;

        @JsonProperty("item_name")
        private String itemName;

        @JsonProperty("item_icon")
        private String itemIcon;

        @JsonProperty("item_description")
        private String itemDescription;

        @JsonProperty("item_shape_name")
        private String itemShapeName;

        @JsonProperty("item_shape_icon")
        private String itemShapeIcon;

        @JsonProperty("item_gender")
        private String itemGender;

        @JsonProperty("item_total_option")
        private ItemOption itemTotalOption;

        @JsonProperty("item_base_option")
        private ItemOption itemBaseOption;

        @JsonProperty("potential_option_grade")
        private String potentialOptionGrade;

        @JsonProperty("potential_option_1")
        private String potentialOption1;

        @JsonProperty("potential_option_2")
        private String potentialOption2;

        @JsonProperty("potential_option_3")
        private String potentialOption3;

        @JsonProperty("additional_potential_option_grade")
        private String additionalPotentialOptionGrade;

        @JsonProperty("additional_potential_option_1")
        private String additionalPotentialOption1;

        @JsonProperty("additional_potential_option_2")
        private String additionalPotentialOption2;

        @JsonProperty("additional_potential_option_3")
        private String additionalPotentialOption3;

        @JsonProperty("item_add_option")
        private ItemOption itemAddOption;

        @JsonProperty("item_starforce")
        private String itemStarforce;

        @JsonProperty("starforce_scroll_flag")
        private String starforceScrollFlag;

        @JsonProperty("item_exceptional_option")
        private ItemOption itemExceptionalOption;

        @JsonProperty("growth_exp")
        private Long growthExp;

        @JsonProperty("growth_level")
        private Integer growthLevel;
    }

    @Data
    public static class ItemOption {
        @JsonProperty("str")
        private String str;

        @JsonProperty("dex")
        private String dex;

        @JsonProperty("int")
        private String intelligence;

        @JsonProperty("luk")
        private String luk;

        @JsonProperty("max_hp")
        private String maxHp;

        @JsonProperty("max_mp")
        private String maxMp;

        @JsonProperty("attack_power")
        private String attackPower;

        @JsonProperty("magic_power")
        private String magicPower;

        @JsonProperty("armor")
        private String armor;

        @JsonProperty("speed")
        private String speed;

        @JsonProperty("jump")
        private String jump;

        @JsonProperty("boss_damage")
        private String bossDamage;

        @JsonProperty("ignore_monster_armor")
        private String ignoreMonsterArmor;

        @JsonProperty("all_stat")
        private String allStat;

        @JsonProperty("damage")
        private String damage;

        @JsonProperty("equipment_level_decrease")
        private Integer equipmentLevelDecrease;
    }
}