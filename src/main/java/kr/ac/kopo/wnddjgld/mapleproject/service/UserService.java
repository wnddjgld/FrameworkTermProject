package kr.ac.kopo.wnddjgld.mapleproject.service;

import kr.ac.kopo.wnddjgld.mapleproject.dto.request.SignupRequest;
import kr.ac.kopo.wnddjgld.mapleproject.dto.response.UserResponse;
import kr.ac.kopo.wnddjgld.mapleproject.entity.User;
import kr.ac.kopo.wnddjgld.mapleproject.exception.DuplicateUserException;
import kr.ac.kopo.wnddjgld.mapleproject.exception.UserNotFoundException;
import kr.ac.kopo.wnddjgld.mapleproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(SignupRequest request) {
        // 중복 체크
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUserException("이미 사용 중인 사용자명입니다: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException("이미 사용 중인 이메일입니다: " + request.getEmail());
        }

        // 사용자 생성
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .createdAt(savedUser.getCreatedAt())
                .build();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다: " + username));
    }

    public UserResponse getUserInfo(String username) {
        User user = findByUsername(username);
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}