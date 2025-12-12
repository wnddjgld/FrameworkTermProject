package kr.ac.kopo.wnddjgld.mapleproject.service;

import kr.ac.kopo.wnddjgld.mapleproject.dto.request.LoginRequest;
import kr.ac.kopo.wnddjgld.mapleproject.dto.request.SignupRequest;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.AuthResponse;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.UserResponse;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.exception.UserNotFoundException;
import kr.ac.kopo.wnddjgld.mapleproject.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // 사용자 생성
        UserResponse userResponse = userService.createUser(request);

        // JWT 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(request.getUsername());
        String refreshToken = jwtTokenProvider.createRefreshToken(request.getUsername());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600000L)  // 1시간
                .user(userResponse)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            // 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsernameOrEmail(),
                            request.getPassword()
                    )
            );

            // 인증 성공 시 토큰 생성
            String username = authentication.getName();
            String accessToken = jwtTokenProvider.createAccessToken(username);
            String refreshToken = jwtTokenProvider.createRefreshToken(username);

            UserResponse userResponse = userService.getUserInfo(username);

            return AuthResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .expiresIn(3600000L)
                    .user(userResponse)
                    .build();

        } catch (AuthenticationException e) {
            throw new UserNotFoundException("사용자명 또는 비밀번호가 올바르지 않습니다");
        }
    }
}