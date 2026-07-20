package com.example.board.controller;

import com.example.board.dto.BoardRequest;
import com.example.board.dto.BoardResponse;
import com.example.board.service.BoardService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    // GET /api/boards?keyword=검색어 (누구나 조회 가능)
    @GetMapping
    public ResponseEntity<List<BoardResponse>> getBoards(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(boardService.getBoards(keyword));
    }

    // GET /api/boards/{id} (누구나 조회 가능)
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoard(id));
    }

    // 📸 POST /api/boards (로그인 필수 + 파일 업로드 가능) 
    // 💡 단 하나의 POST 메서드만 있어야 합니다!
    @PostMapping
    public ResponseEntity<?> createBoard(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam("title") String title,
            @RequestParam("writer") String writer,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        // 1. 로그인 토큰 확인
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 2. 이미지 파일 수신 확인 콘솔 출력 (테스트용)
        if (image != null && !image.isEmpty()) {
            System.out.println("📸 업로드된 파일명: " + image.getOriginalFilename());
        }

        // TODO: 나중에 BoardService에 image를 넘겨서 저장하도록 연결할 부분!
        // BoardResponse response = boardService.createBoard(title, writer, content, image);
        // return ResponseEntity.ok(response);
        
        return ResponseEntity.ok().build(); 
    }

    // PUT /api/boards/{id} (로그인 필요)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBoard(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id, 
            @Valid @RequestBody BoardRequest request) {

        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        return ResponseEntity.ok(boardService.updateBoard(id, request));
    }

    // DELETE /api/boards/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {

        // 💡 1. 토큰이 비어있는지 확인
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 💡 2. Bearer 접두사 제거 처리
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 💡 3. 토큰 값 유효성 간단 검증 (dummy 토큰인지 확인)
        if (!token.startsWith("dummy-jwt-token-for-")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }

        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }
}