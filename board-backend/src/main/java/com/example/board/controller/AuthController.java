package com.example.board.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth") // 프론트엔드의 axiosInstance가 요청하는 주소와 매칭
public class AuthController {

    // DB 연결 전, 임시로 메모리에 회원 정보를 저장할 Map
    private static final Map<String, Map<String, String>> tempUserDb = new HashMap<>();

    // 1. 회원가입 API (POST /api/auth/signup)
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");
    String name = request.get("name");

    // 💡 필수 값 입력 검증 추가 (Null 또는 빈 문자열 방지)
    if (email == null || email.isBlank() || 
        password == null || password.isBlank() || 
        name == null || name.isBlank()) {
        
        Map<String, String> error = new HashMap<>();
        error.put("message", "모든 항목을 입력해 주세요.");
        return ResponseEntity.badRequest().body(error);
    }

    // 1. 이메일 중복 체크
    if (tempUserDb.containsKey(email)) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "이미 사용 중인 이메일입니다.");
        return ResponseEntity.badRequest().body(error);
    }

    // 2. 아이디(이름) 중복 체크 👈 추가된 부분!
    boolean isNameDuplicate = tempUserDb.values().stream()
            .anyMatch(user -> name.equals(user.get("name")));

    if (isNameDuplicate) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "이미 사용 중인 아이디(이름)입니다.");
        return ResponseEntity.badRequest().body(error);
    }

    // 3. 중복이 없으면 메모리에 유저 정보 저장
    Map<String, String> userData = new HashMap<>();
    userData.put("email", email);
    userData.put("password", password);
    userData.put("name", name);

    tempUserDb.put(email, userData);

    Map<String, String> response = new HashMap<>();
    response.put("message", "회원가입 성공!");
    return ResponseEntity.ok(response);
}

    // 2. 로그인 API (POST /api/auth/login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        // 유저 정보 확인
        if (!tempUserDb.containsKey(email) || !tempUserDb.get(email).get("password").equals(password)) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "이메일 또는 비밀번호가 올바르지 않습니다.");
        // 💡 badRequest(400) 대신 status(401) 사용
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error); 
    }

        Map<String, String> userData = tempUserDb.get(email);

        // 프론트로 전달할 테스트용 토큰과 정보
        Map<String, Object> response = new HashMap<>();
        response.put("token", "dummy-jwt-token-for-" + email);

        Map<String, String> userObj = new HashMap<>();
        userObj.put("email", email);
        userObj.put("name", userData.get("name"));
        response.put("user", userObj);

        return ResponseEntity.ok(response);
    }

    // 3. 내 정보 조회 API (GET /api/auth/me) - 새로고침 시 로그인 유지용
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(401).body("인증 토큰이 없습니다.");
        }

        // 테스트용: 토큰에서 이메일 추출
        String email = token.replace("Bearer dummy-jwt-token-for-", "");

        if (!tempUserDb.containsKey(email)) {
            return ResponseEntity.status(401).body("유효하지 않은 유저 정보입니다.");
        }

        Map<String, String> userData = tempUserDb.get(email);
        Map<String, String> response = new HashMap<>();
        response.put("email", email);
        response.put("name", userData.get("name"));

        return ResponseEntity.ok(response);
    }
}