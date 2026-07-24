package com.example.board.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 대화방을 구분하기 위한 식별자 (예: 회원 ID, 세션 ID, 또는 고민게시글 ID)
    private String roomId;

    // 발신자 역할 ("user" 또는 "model")
    private String role;

    // 메시지 본문
    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime createdAt;

    public ChatMessage(String roomId, String role, String message) {
        this.roomId = roomId;
        this.role = role;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }
}