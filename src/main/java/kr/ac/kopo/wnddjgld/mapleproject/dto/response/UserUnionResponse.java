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
public class UserUnionResponse {
    private String date;

    @JsonProperty("union_level")
    private Integer unionLevel;

    @JsonProperty("union_grade")
    private String unionGrade;

    @JsonProperty("union_artifact_level")
    private Integer unionArtifactLevel;

    @JsonProperty("union_artifact_exp")
    private Integer unionArtifactExp;

    @JsonProperty("union_artifact_point")
    private Integer unionArtifactPoint;
}
