package kr.ac.kopo.wnddjgld.mapleproject.config;

import kr.ac.kopo.wnddjgld.mapleproject.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // 정적 리소스 허용 (HTML, CSS, JS, 이미지)
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/home.html",
                                "/login.html",
                                "/login",
                                "/signup.html",
                                "/signup",
                                "/dashboard.html",
                                "/dashboard",
                                "/favorites.html",
                                "/favorites",
                                "/history.html",
                                "/history",
                                "/character.html",
                                "/character",
                                "/compare.html",
                                "/compare",
                                "/loading.html",
                                "/loading",
                                "/css/**",
                                "/js/**",
                                "/images/**",
                                "/error",
                                "/favicon.ico"
                        ).permitAll()

                        // API 공개
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // 캐릭터 검색은 인증 필요 없음 (검색 기록은 로그인 시만 저장)
                        .requestMatchers("/api/characters/**").permitAll()

                        // 메이플 뉴스는 인증 필요 없음
                        .requestMatchers("/api/maple-news/**").permitAll()

                        // 그 외 모든 API는 인증 필요
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}