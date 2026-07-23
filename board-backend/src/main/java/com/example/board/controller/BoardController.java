package com.example.board.controller;

import com.example.board.domain.Board;
import com.example.board.dto.BoardRequest;
import com.example.board.dto.BoardResponse;
import com.example.board.service.BoardService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    // GET /api/boards?keyword=검색어 (누구나 조회 가능)
    @GetMapping
    public ResponseEntity<List<Board>> getBoards(
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(boardService.getBoards(keyword));
    }

    // GET /api/boards/{id} (누구나 조회 가능)
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getBoardById(id));
    }

    // 📸 POST /api/boards (로그인 필수 + 파일 업로드 및 공지사항 등록)
    @PostMapping
    public ResponseEntity<?> createBoard(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestParam("title") String title,
            @RequestParam("writer") String writer,
            @RequestParam("content") String content,
            @RequestParam(value = "isNotice", required = false, defaultValue = "false") boolean isNotice, // 📢 공지사항 여부 수신
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        // 1. 로그인 토큰 확인
        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 프론트에서 image 또는 file 키값으로 보낸 것 중 존재하는 파일 선택
        MultipartFile uploadFile = (image != null && !image.isEmpty()) ? image : file;
        String imageUrl = null;

        // 2. 📸 실제 uploads 폴더에 파일 저장하기!
        if (uploadFile != null && !uploadFile.isEmpty()) {
            try {
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                String originalFilename = uploadFile.getOriginalFilename();
                String savedFilename = UUID.randomUUID().toString() + "_" + originalFilename;

                File dest = new File(dir, savedFilename);
                uploadFile.transferTo(dest);

                imageUrl = "/uploads/" + savedFilename;
                System.out.println("🎉 파일 저장 성공! 경로: " + imageUrl);

            } catch (IOException e) {
                e.printStackTrace();
                System.err.println("❌ 파일 저장 중 에러 발생!");
            }
        }

        BoardRequest request = new BoardRequest();
        request.setTitle(title);
        request.setWriter(writer);
        request.setContent(content);
        request.setImageUrl(imageUrl);
        request.setNotice(isNotice); // 📢 DTO에 세팅

        Board savedBoard = boardService.createBoard(request);
        BoardResponse response = new BoardResponse(savedBoard); 

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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

        if (token == null || token.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!token.startsWith("dummy-jwt-token-for-")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }

        boardService.deleteBoard(id);
        return ResponseEntity.noContent().build();
    }
}