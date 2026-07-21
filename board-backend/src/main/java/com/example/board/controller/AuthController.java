package com.example.board.controller;

import com.example.board.domain.User;
import com.example.board.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    // Lombok 대신 자바 기본 생성자로 UserRepository 주입 받기!
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 1. 회원가입 API (MySQL DB 저장)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");

        if (email == null || email.isBlank() || 
            password == null || password.isBlank() || 
            name == null || name.isBlank()) {
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "모든 항목을 입력해 주세요.");
            return ResponseEntity.badRequest().body(error);
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "이미 사용 중인 이메일입니다.");
            return ResponseEntity.badRequest().body(error);
        }

        // 이름(아이디) 중복 체크
        if (userRepository.existsByName(name)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "이미 사용 중인 아이디(이름)입니다.");
            return ResponseEntity.badRequest().body(error);
        }

        // MySQL DB에 영구 저장! 💾
        User user = new User(email, password, name);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입 성공!");
        return ResponseEntity.ok(response);
    }

    // 2. 로그인 API (MySQL DB 조회)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !user.getPassword().equals(password)) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("token", "dummy-jwt-token-for-" + email);

        Map<String, String> userObj = new HashMap<>();
        userObj.put("email", user.getEmail());
        userObj.put("name", user.getName());
        response.put("user", userObj);

        return ResponseEntity.ok(response);
    }

    // 3. 내 정보 조회 API (새로고침 유지용)
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(401).body("인증 토큰이 없습니다.");
        }

        String email = token.replace("Bearer dummy-jwt-token-for-", "");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body("유효하지 않은 유저 정보입니다.");
        }

        Map<String, String> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("name", user.getName());

        return ResponseEntity.ok(response);
    }
}