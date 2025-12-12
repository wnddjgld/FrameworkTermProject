package kr.ac.kopo.wnddjgld.mapleproject.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;

    @Builder.Default  // ← 이 줄 추가!
    private String tokenType = "Bearer";

    private Long expiresIn;
    private UserResponse user;
}