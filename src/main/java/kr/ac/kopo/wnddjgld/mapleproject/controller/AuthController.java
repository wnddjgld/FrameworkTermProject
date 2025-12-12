package kr.ac.kopo.wnddjgld.mapleproject.controller;

import jakarta.validation.Valid;
import kr.ac.kopo.wnddjgld.mapleproject.dto.request.LoginRequest;
import kr.ac.kopo.wnddjgld.mapleproject.dto.request.SignupRequest;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.AuthResponse;
import kr.ac.kopo.wnddjgld.mapleproject.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}