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
public class UserAchievementResponse {
    private String date;

    @JsonProperty("achievement_grade")
    private String achievementGrade;

    @JsonProperty("achievement_point")
    private Long achievementPoint;
}
