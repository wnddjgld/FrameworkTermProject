package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 월드별 인구 통계 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorldPopulationResponse {

    private String worldName;
    private Long population;
    private Double changeRate; // 전일 대비 증감률

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorldStats {
        private List<WorldPopulationResponse> worlds;
        private Long totalPopulation;
    }
}
